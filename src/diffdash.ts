#!/usr/bin/env node

import {blue, italic, red} from "./lib_ansi.js"
import * as lib_diffdash_config from "./lib_diffdash_config.js"
import * as lib_diffdash_core from "./lib_diffdash_core.js"
import * as lib_error from "./lib_error.js"
import {PROGRAM_NAME, PROGRAM_VERSION} from "./lib_package_details.js"
import * as lib_tell from "./lib_tell.js"

async function main(): Promise<void> {
  const config = lib_diffdash_config.get_config()

  const {version, silent} = config

  if (version) {
    lib_tell.plain(`${PROGRAM_NAME} v${PROGRAM_VERSION}`)
    process.exit(0)
  }

  if (!silent) {
    const diffdash = italic(blue("Diff") + red("Dash"))
    lib_tell.plain(`This is ${diffdash} - the fast AI Git commit tool`)
  }

  await (config.compare ? lib_diffdash_core.sequence_compare(config) : lib_diffdash_core.sequence_normal(config))

  if (!silent) {
    lib_tell.okay()
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(lib_error.abort)
