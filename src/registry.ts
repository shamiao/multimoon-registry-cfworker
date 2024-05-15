
export async function registry(arch: String, request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const query: D1Result<DbToolchain> = await 
    env.REG_DB.prepare("SELECT * FROM toolchains WHERE arch = ? ORDER BY last_modified DESC")
      .bind(arch)
      .all();
  if (!query.success) { return new Response("server internal error (database error)\n", { status: 500 }); }

  const result = {
    toolchains: [] as any[],
    downloadfrom: "https://multimoon-cf-r2.lopt.dev/",
    last_modified: 0,
  };

  for (const db_rec of query.results) {
    const db_data: any = JSON.parse((new TextDecoder()).decode(Uint8Array.from(db_rec.data)))
    // make toolchain in response
    const toolchain: any = {
      name: db_rec.name,
      installer: db_data.installer,
      bin: [] as any[],
      core: [] as any[],
      last_modified: db_rec.last_modified,
    };
    for (const bin of db_data.bin) {
      toolchain.bin.push({
        filename: bin.filename,
        downloadfrom: bin.downloadfrom,
        checksum: bin.checksum,
      })
    }
    const core = db_data.core[0];
    toolchain.core.push({
      filename: core.filename,
      downloadfrom: core.downloadfrom,
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
