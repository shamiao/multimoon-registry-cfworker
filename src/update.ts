import { CheckUpdateRep, CheckUpdateReq, UpdateRep, UpdateReq } from "./proto/update"

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

  const data = {
    installer: req.toolchain.installer,
    bin: [] as any[],
    core: [] as any[],
  }
  for (const file of req.toolchain.bin) {
    // COMMENT OUT NOTE: 
    // xz decompress with wasm is not supported on CloudFlare worker.
    // bypass checksum verification now.

    // const content_stream = new Blob([file.uploadContent]).stream();
    // const xz_stream = new XzReadableStream(content_stream);
    // const hasher = crypto.createHash('sha256')
    // await stream.promises.pipeline(xz_stream, hasher)
    // console.log(file.filename, hasher.digest('hex'))

    data.bin.push({
      filename: file.filename,
      downloadfrom: file.downloadfrom,
      checksum: file.checksum,
    })
  }
  {
    const file = req.toolchain.core[0]
    data.core.push({
      filename: file.filename,
      downloadfrom: file.downloadfrom,
      checksum: file.checksum,
    })
  }
  const data_bytes = (new TextEncoder()).encode(JSON.stringify(data))

  // upload files to R2
  const uploaded = [] as any[]
  for (const file of req.toolchain.bin) {
    const key = `${req.name}/${req.arch}/${file.downloadfrom}`
    if ((await env.REG_BUCKET.head(key)) == null) {
      uploaded.push(await env.REG_BUCKET.put(key, file.uploadContent));
    }
  }
  {
    const file = req.toolchain.core[0]
    const key = `${req.name}/multiarch/${file.downloadfrom}`
    if ((await env.REG_BUCKET.head(key)) == null) {
      uploaded.push(await env.REG_BUCKET.put(key, file.uploadContent));
    }
  }
  // console.log(uploaded)

  // save new entry in D1
  const timestamp = Math.floor(Date.now() / 1000);
  // find existing toolchain entry in D1
  const query = await env.REG_DB.prepare("SELECT * FROM toolchains WHERE arch = ? AND name = ?")
    .bind(req.arch, req.name)
    .all();
  if (!query.success) { return new Response("server internal error (database error)\n", { status: 500 }); }
  const shouldInsert = (query.results.length == 0)
  let queryInsertUpdate;
  if (shouldInsert) {
    queryInsertUpdate = env.REG_DB
      .prepare("INSERT INTO toolchains (arch, name, last_modified, data) VALUES (?, ?, ?, ?) ")
      .bind(req.arch, req.name, timestamp, data_bytes)
  } else {
    queryInsertUpdate = env.REG_DB
      .prepare("UPDATE toolchains SET last_modified = ?, data = ? WHERE arch = ? AND name = ?")
      .bind(timestamp, data_bytes, req.arch, req.name)
  }
  await queryInsertUpdate.run();

  const rep = UpdateRep.create();
  return new Response(UpdateRep.encode(rep).finish());
}
