#!/usr/bin/env node

import {ansi_blue, ansi_italic, ansi_red} from "./lib_ansi.js"
import {diffdash_config_get} from "./lib_diffdash_config.js"
import {diffdash_llm_model_details} from "./lib_diffdash_llm.js"
import {diffdash_sequence_compare, diffdash_sequence_normal} from "./lib_diffdash_sequence.js"
import {error_abort} from "./lib_error.js"
import {llm_list_models} from "./lib_llm_list.js"
import {PACKAGE_NAME, PACKAGE_VERSION} from "./lib_package.js"
import {tell_okay, tell_plain} from "./lib_tell.js"

async function main(): Promise<void> {
  const config = diffdash_config_get()

  const {version, compare, silent, llm_list} = config

  if (version) {
    tell_plain(`${PACKAGE_NAME} v${PACKAGE_VERSION}`)
    process.exit(0)
  }

  if (!silent) {
    const diffdash = ansi_italic(ansi_blue("Diff") + ansi_red("Dash"))
    tell_plain(`This is ${diffdash} - the fast AI Git commit tool`)
  }

  if (llm_list) {
    llm_list_models({llm_model_details: diffdash_llm_model_details})
    process.exit(0)
  }

  // eslint-disable-next-line unicorn/prefer-ternary
  if (compare) {
    await diffdash_sequence_compare(config)
  } else {
    await diffdash_sequence_normal(config)
  }

  if (!silent) {
    tell_okay()
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(error_abort)
