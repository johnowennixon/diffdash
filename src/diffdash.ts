#!/usr/bin/env tsx

import * as lib_ansi from "./lib_ansi.js"
import * as lib_diffdash_config from "./lib_diffdash_config.js"
import * as lib_diffdash_core from "./lib_diffdash_core.js"
import * as lib_tell from "./lib_tell.js"

async function main(): Promise<void> {
  const diffdash = lib_ansi.italic("DiffDash")

  lib_tell.normal(`This is ${diffdash} - the AI Git commit tool as fast as an API call`)

  const config = lib_diffdash_config.process_config()

  await lib_diffdash_core.sequence_work(config)

  lib_tell.okay()
}

await main().catch((error) => {
  lib_tell.error(`Unhandled error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
