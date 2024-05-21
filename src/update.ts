import { CheckUpdateRep, CheckUpdateReq, UpdateRep, UpdateReq, UploadFileRep, UploadFileReq } from "./proto/update"

export async function check(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const req_bytes = new Uint8Array(await request.arrayBuffer());
  if (req_bytes.length == 0) { return new Response("bad request (empty)\n", { status: 400 }); }
  const req = CheckUpdateReq.decode(req_bytes);
  if (req.arch == undefined || req.name == undefined) {
    return new Response("bad request (missing fields)\n", { status: 400 });
  }

  const query = await env.REG_DB.prepare("SELECT * FROM toolchains WHERE arch = ? AND name = ?")
    .bind(req.arch, req.name)
    .all();
  if (!query.success) { return new Response("server internal error (database error)\n", { status: 500 }); }

  const shouldUpdate = (query.results.length == 0)

  const rep = CheckUpdateRep.create();
  rep.shouldUpdate = shouldUpdate;
  return new Response(CheckUpdateRep.encode(rep).finish());
}

export async function update(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const body = new Uint8Array(await request.arrayBuffer());
  if (body.length == 0) { return new Response("bad request (empty)\n", { status: 400 }); }
  const req = UpdateReq.decode(body);
  if (req.arch == undefined || req.name == undefined || req.toolchain == undefined) {
    return new Response("bad request (missing fields)\n", { status: 400 });
  }

  // upload files to R2 & save files entry in D1
  // NOTE: 
  // xz decompress with wasm is not supported on CloudFlare worker.
  // bypass checksum verification now.
  const uploaded = [] as any[]
  for (const file of req.toolchain.bin) {
    const dbfile = await env.REG_DB.prepare("SELECT id,type,toolchain,arch,filename,downloadname,checksum " +
      "FROM files WHERE arch = ? AND toolchain = ? AND type = ? AND filename = ? LIMIT 1")
      .bind(req.arch, req.name, 'bin', file.filename)
      .first<DbFile>();
    const key = `${req.name}/${req.arch}/${file.downloadfrom}`
    if ((await env.REG_BUCKET.head(key)) == null) {
      console.log(`uploading ${key} to R2`)
      uploaded.push(await env.REG_BUCKET.put(key, file.uploadContent));
    }
    if (dbfile == null) {
      console.log(`inserting bin ${req.toolchain.name} ${req.arch} ${file.filename} to D1`)
      const q = await env.REG_DB
        .prepare("INSERT INTO files (`type`, `toolchain`, `arch`, `filename`, `downloadname`, `checksum`) " + 
          "VALUES (?, ?, ?, ?, ?, ?)")
        .bind('bin', req.toolchain.name, req.arch, file.filename, file.downloadfrom, file.checksum)
        .run();
      if (!q.success) { return new Response("server internal error (database error)\n", { status: 500 }); }
    }
  }
  {
    const file = req.toolchain.core[0]
    const dbfile = await env.REG_DB.prepare("SELECT id,type,toolchain,arch,filename,downloadname,checksum " +
      "FROM files WHERE arch = ? AND toolchain = ? AND type = ? AND filename = ? LIMIT 1")
      .bind(req.arch, req.name, 'core', file.filename)
      .first<DbFile>();
    const key = `${req.name}/multiarch/${file.downloadfrom}`
    if ((await env.REG_BUCKET.head(key)) == null) {
      console.log(`uploading ${key} to R2`)
      uploaded.push(await env.REG_BUCKET.put(key, file.uploadContent));
    }
    if (dbfile == null) {
      console.log(`inserting core ${req.toolchain.name} ${req.arch} ${file.filename} to D1`)
      const q = await env.REG_DB
        .prepare("INSERT INTO files (`type`, `toolchain`, `arch`, `filename`, `downloadname`, `checksum`) " + 
          "VALUES (?, ?, ?, ?, ?, ?)")
        .bind('core', req.toolchain.name, req.arch, file.filename, file.downloadfrom, file.checksum)
        .run();
      if (!q.success) { return new Response("server internal error (database error)\n", { status: 500 }); }
    }
  }

  // save new toolchain entry in D1
  const timestamp = Math.floor(Date.now() / 1000);
  // find existing toolchain entry in D1
  const query = await env.REG_DB.prepare("SELECT * FROM toolchains WHERE arch = ? AND name = ?")
    .bind(req.arch, req.name)
    .all();
  if (!query.success) { return new Response("server internal error (database error)\n", { status: 500 }); }
  const shouldInsert = (query.results.length == 0)
  let queryInsertUpdate;
  if (shouldInsert) {
    console.log(`inserting toolchain ${req.name} ${req.arch} to D1`)
    queryInsertUpdate = env.REG_DB
      .prepare("INSERT INTO toolchains (arch, name, moonver, installer, last_modified) VALUES (?, ?, ?, ?, ?) ")
      .bind(req.arch, req.name, req.toolchain.moonver, req.toolchain.installer, timestamp)
  } else {
    console.log(`updating toolchain ${req.name} ${req.arch} to D1`)
    queryInsertUpdate = env.REG_DB
      .prepare("UPDATE toolchains SET last_modified = ?, moonver = ?, installer = ? WHERE arch = ? AND name = ?")
      .bind(timestamp, req.toolchain.moonver, req.toolchain.installer, req.arch, req.name)
  }
  await queryInsertUpdate.run();

  const rep = UpdateRep.create();
  return new Response(UpdateRep.encode(rep).finish());
}

export async function upload_file(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const body = new Uint8Array(await request.arrayBuffer());
  if (body.length == 0) { return new Response("bad request (empty)\n", { status: 400 }); }
  const req = UploadFileReq.decode(body);
  if (req.arch == undefined || req.name == undefined || req.type == undefined || req.file == undefined) {
    return new Response("bad request (missing fields)\n", { status: 400 });
  }

  let arch_in_path = req.arch
  let put_options: R2PutOptions = {}
  if (req.type == 'core') {
    arch_in_path = 'multiarch'
    put_options.sha256 = req.file.checksum.substring(7); // todo: temp code to strip 'sha256:', should use a dedicated field
  }
  const path = `${req.name}/${arch_in_path}/${req.file.downloadfrom}`;

  // check existing
  const dbfile = await env.REG_DB.prepare("SELECT id,type,toolchain,arch,filename,downloadname,checksum " +
    "FROM files WHERE arch = ? AND toolchain = ? AND type = ? AND filename = ? LIMIT 1")
    .bind(req.arch, req.name, req.type, req.file.filename)
    .first<DbFile>();
  if (dbfile != null) {
    if (dbfile.downloadname == req.file.downloadfrom && dbfile.checksum == req.file.checksum) {
      const rep = UploadFileRep.create();
      rep.path = path;
      return new Response(UploadFileRep.encode(rep).finish());
    }
  }

  // upload files to R2
  let uploaded = null;
  if ((await env.REG_BUCKET.head(path)) == null) {
    console.log(`uploading R2 file ${path}`)
    console.log(`  request: `, req)
    uploaded = await env.REG_BUCKET.put(path, req.file.uploadContent, put_options);
  }

  // save/update entry in D1
  let queryInsertUpdate;
  if (dbfile == null) {
    queryInsertUpdate = env.REG_DB
      .prepare("INSERT INTO files (`type`, `toolchain`, `arch`, `filename`, `downloadname`, `checksum`) " + 
        "VALUES (?, ?, ?, ?, ?, ?)")
      .bind(req.type, req.name, req.arch, req.file.filename, req.file.downloadfrom, req.file.checksum)
  } else {
    queryInsertUpdate = env.REG_DB
      .prepare("UPDATE files SET type = ?, toolchain = ?, arch = ?, filename = ?, downloadname = ?, checksum = ? WHERE id = ?")
      .bind(req.type, req.name, req.arch, req.file.filename, req.file.downloadfrom, req.file.checksum, dbfile.id)
  }
  await queryInsertUpdate.run();

  const rep = UploadFileRep.create();
  rep.path = path;
  return new Response(UploadFileRep.encode(rep).finish());
}
