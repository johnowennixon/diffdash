#!/usr/bin/env tsx

import * as lib_ansi from "./lib_ansi.js"
import * as lib_diffdash_config from "./lib_diffdash_config.js"
import * as lib_diffdash_core from "./lib_diffdash_core.js"
import {PROGRAM_NAME, PROGRAM_VERSION} from "./lib_package_details.js"
import * as lib_tell from "./lib_tell.js"

async function main(): Promise<void> {
  const config = lib_diffdash_config.process_config()

  if (config.version) {
    lib_tell.normal(`${PROGRAM_NAME} v${PROGRAM_VERSION}`)
    process.exit(0)
  }

  lib_tell.normal(`This is ${lib_ansi.italic("DiffDash")} - the fast AI Git commit tool`)

  await (config.preview ? lib_diffdash_core.sequence_preview(config) : lib_diffdash_core.sequence_normal(config))

  lib_tell.okay()
}

await main().catch((error) => {
  lib_tell.error(`Unhandled error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
