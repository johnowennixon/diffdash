import {build} from "esbuild"

await build({
  entryPoints: ["./src/diffdash.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: "./out/diffdash.cjs",
})
