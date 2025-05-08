import type {SimpleGit} from "simple-git"

import type {DiffDashConfig} from "./lib_diffdash_config.js"
import * as lib_diffdash_footer from "./lib_diffdash_footer.js"
import * as lib_git_message_generator from "./lib_git_message_generator.js"
import * as lib_git_message_ui from "./lib_git_message_ui.js"
import * as lib_git_simple_staging from "./lib_git_simple_staging.js"
import * as lib_llm_config from "./lib_llm_config.js"
import * as lib_llm_models_diff from "./lib_llm_models_diff.js"
import * as lib_tell from "./lib_tell.js"
import * as lib_unused from "./lib_unused.js"

export default {}

export async function generate_for_commit({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<string> {
  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  const {llm_config} = config

  lib_tell.action(`Generating the commit message using LLM ${lib_llm_config.get_llm_model_via(llm_config)}`)

  const generate_result = await lib_git_message_generator.generate_message({llm_config, diffstat, diff})

  const {llm_response} = generate_result

  const commit_message_with_footer = lib_diffdash_footer.add_footer({llm_response, llm_config})

  lib_git_message_ui.display_message({message: commit_message_with_footer, teller: lib_tell.normal})

  return commit_message_with_footer
}

export async function generate_and_preview({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  lib_unused.unused(config)

  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  const details = lib_llm_models_diff.get_details()

  const all_llm_configs = lib_llm_config.all_llm_configs(details)

  lib_tell.action("Generating Git commit messages using all models in parallel")

  // Create an array of promises for parallel execution
  const generate_result_promises = all_llm_configs.map((llm_config) =>
    lib_git_message_generator.generate_message({llm_config, diffstat, diff}),
  )

  // Wait for all messages to be generated in parallel
  const all_generate_results = await Promise.all(generate_result_promises)

  // Display all generated messages
  for (const generate_result of all_generate_results) {
    const {llm_config, llm_response} = generate_result

    const commit_message_with_footer = lib_diffdash_footer.add_footer({llm_response, llm_config})

    lib_tell.info(`Commit message from ${lib_llm_config.get_llm_model_via(llm_config)}:`)
    lib_git_message_ui.display_message({message: commit_message_with_footer, teller: lib_tell.normal})
  }
}
