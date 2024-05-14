
export async function registry(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  let registry = {
    toolchains: [
      {
        name: "2024-05-07",
        installer: "2024-05-07",
        last_modified: 1715040000,
        bin: [
          {
            filename: "moon",
            downloadfrom: "moon.caa08ff1.xz",
            checksum: "sha256:caa08ff1b0611a0dbb9051a38c7b600e59934ad72056d7f529a912d594c30684",
          },
          {
            filename: "moonc",
            downloadfrom: "moonc.c1f50160.xz",
            checksum: "sha256:c1f5016029ab4ec77d4bf15b4a830d7a8abe341ea9298571030626b341c63c77",
          },
          {
            filename: "moonfmt",
            downloadfrom: "moonfmt.bd122e85.xz",
            checksum: "sha256:bd122e859cd28b2c2da6b4f2cb5187ccc3811075930db30f922b354db61e92ff",
          },
          {
            filename: "moonrun",
            downloadfrom: "moonrun.e0046f97.xz",
            checksum: "sha256:e0046f97bd6d7602efa36f8981fba9e133b180b08b796c2717dead75f9bd6847",
          },
          {
            filename: "moondoc",
            downloadfrom: "moondoc.9e415764.xz",
            checksum: "sha256:9e4157647f5283e0980e7efbc8708ee6fe146b24fa560c4d336fccc20b0c74cc",
          },
          {
            filename: "mooninfo",
            downloadfrom: "mooninfo.78a78ddd.xz",
            checksum: "sha256:78a78ddd1487fc59386c5e9ba96b69d257a67d83d4c28926b7d8510b4be28465",
          },
          {
            filename: "moon_cove_report",
            downloadfrom: "moon_cove_report.3124c726.xz",
            checksum: "sha256:3124c726bf2d2b3700d8bce4a3260d15878ae747eef1ed8643c548373da05cbc",
          },
        ],
        core: [
          {
            filename: "core.zip",
            downloadfrom: "core.05de2bf2.zip",
            checksum: "sha256:05de2bf289a4872afd570f0ba55d5e4f15ce87f72f35f47eef851c5e7411a69e",
          },
        ],
      }
    ],
    downloadfrom: "https://multimoon-cf-r2.lopt.dev/",
    last_modified: 1715594490,
  };
  return Response.json(registry);
}
