import type {SimpleGit} from "simple-git"

import type {DiffDashConfig} from "./lib_diffdash_config.js"
import * as lib_git_message_generator from "./lib_git_message_generator.js"
import * as lib_git_message_ui from "./lib_git_message_ui.js"
import * as lib_git_simple_staging from "./lib_git_simple_staging.js"
import * as lib_llm_config from "./lib_llm_config.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export async function generate_and_preview({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<string> {
  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  const {llm_config} = config

  const {llm_model_name, llm_provider} = llm_config

  lib_tell.action(`Generating the commit message (using ${llm_model_name} via ${llm_provider})`)

  lib_llm_config.show_llm_config({llm_config})

  const commit_message = await lib_git_message_generator.generate_message({
    llm_config,
    diffstat,
    diff,
  })

  lib_git_message_ui.display_message(commit_message)

  return commit_message
}
