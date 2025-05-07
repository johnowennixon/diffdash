import type {SimpleGit} from "simple-git"

import {EMPTY} from "./lib_char.js"
import type {DiffDashConfig} from "./lib_diffdash_config.js"
import * as lib_git_message_generator from "./lib_git_message_generator.js"
import * as lib_git_message_ui from "./lib_git_message_ui.js"
import * as lib_git_simple_staging from "./lib_git_simple_staging.js"
import * as lib_llm_config from "./lib_llm_config.js"
import * as lib_llm_models_diff from "./lib_llm_models_diff.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export async function generate_and_preview({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<string> {
  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  if (config.all_models) {
    const details = lib_llm_models_diff.get_details()

    const all_llm_configs = lib_llm_config.all_llm_configs(details)

    lib_tell.action("Generating Git commit messages using all models in parallel")

    // Create an array of promises for parallel execution
    const message_promises = all_llm_configs.map((llm_config) =>
      lib_git_message_generator.generate_message({llm_config, diffstat, diff}),
    )

    // Wait for all messages to be generated in parallel
    const all_messages = await Promise.all(message_promises)

    // Display all generated messages
    for (const [index, llm_config] of all_llm_configs.entries()) {
      const commit_message = all_messages[index]

      if (commit_message) {
        lib_tell.info(`Commit message from ${lib_llm_config.get_llm_model_via(llm_config)}:`)
        lib_git_message_ui.display_message(commit_message)
      }
    }

    return EMPTY
  }

  const {llm_config} = config

  lib_tell.action(`Generating the commit message using LLM ${lib_llm_config.get_llm_model_via(llm_config)}`)

  const commit_message = await lib_git_message_generator.generate_message({llm_config, diffstat, diff})

  lib_git_message_ui.display_message(commit_message)

  return commit_message
}
