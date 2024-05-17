
export async function registry(arch: String, request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const query: D1Result<DbToolchain> = await 
    env.REG_DB.prepare("SELECT id,arch,`name`,last_modified,moonver,installer " + 
      "FROM toolchains WHERE arch = ? ORDER BY last_modified DESC")
      .bind(arch)
      .all();
  if (!query.success) { return new Response("server internal error (database error)\n", { status: 500 }); }
  
  const files_of_toolchain = new Map<string, DbFile[]>();
  if (query.results.length > 0) {
    let q_binds: any[] = [arch]
    for (const db_rec of query.results) {
      q_binds.push(db_rec.name);
    }
    let r_files = await env.REG_DB.prepare("SELECT id,type,toolchain,arch,filename,downloadname,checksum " +
      "FROM files WHERE arch = ? AND toolchain IN (" +
      Array(query.results.length).fill('?').join(',') + ")")
      .bind(...q_binds)
      .all<DbFile>();
    if (!r_files.success) { return new Response("server internal error (database error)\n", { status: 500 }); }
    for (const db_rec of r_files.results) {
      let files = files_of_toolchain.get(db_rec.toolchain) || [];
      files.push(db_rec);
      files_of_toolchain.set(db_rec.toolchain, files);
    }
  }

  const result = {
    toolchains: [] as any[],
    downloadfrom: "https://multimoon-cf-r2.lopt.dev/",
    last_modified: 0,
  };

  for (const db_rec of query.results) {
    const files = files_of_toolchain.get(db_rec.name) || [];
    const bin_files = files.filter((v) => v.type == 'bin');
    const core_files = files.filter((v) => v.type == 'core');

    // make toolchain in response
    const toolchain: any = {
      name: db_rec.name,
      moonver: db_rec.moonver,
      installer: db_rec.installer,
      bin: [] as any[],
      core: [] as any[],
      last_modified: db_rec.last_modified,
    };
    for (const bin of bin_files) {
      toolchain.bin.push({
        filename: bin.filename,
        downloadfrom: bin.downloadname,
        checksum: bin.checksum,
      })
    }
    const core = core_files[0];
    toolchain.core.push({
      filename: core.filename,
      downloadfrom: core.downloadname,
      checksum: core.checksum,
    })

    // add toolchain to response
    result.toolchains.push(toolchain);
    if (db_rec.last_modified > result.last_modified) {
      result.last_modified = db_rec.last_modified
    }
  }

  return Response.json(result);
}
