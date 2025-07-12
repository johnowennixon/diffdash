#!/usr/bin/env node

import {ansi_blue, ansi_italic, ansi_red} from "./lib_ansi.js"
import {diffdash_config_get} from "./lib_diffdash_config.js"
import {diffdash_sequence_compare, diffdash_sequence_normal, diffdash_sequence_output} from "./lib_diffdash_sequence.js"
import {error_abort} from "./lib_error.js"
import {tell_okay, tell_plain} from "./lib_tell.js"

async function main(): Promise<void> {
  const config = diffdash_config_get()

  const {silent, just_output, llm_compare} = config

  if (!silent && !just_output) {
    const diffdash = ansi_italic(ansi_blue("Diff") + ansi_red("Dash"))
    tell_plain(`This is ${diffdash} - the fast AI Git commit tool`)
  }

  if (just_output) {
    await diffdash_sequence_output(config)
  } else if (llm_compare) {
    await diffdash_sequence_compare(config)
  } else {
    await diffdash_sequence_normal(config)
  }

  if (!silent && !just_output) {
    tell_okay()
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(error_abort)
