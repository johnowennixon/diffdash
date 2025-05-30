import * as lib_abort from "./lib_abort.js"
import * as lib_debug from "./lib_debug.js"
import type {DiffDashConfig} from "./lib_diffdash_config.js"
import * as lib_diffdash_modify from "./lib_diffdash_modify.js"
import * as lib_error from "./lib_error.js"
import {git_message_generate_result} from "./lib_git_message_generate.js"
import type {GitMessageGenerateResult} from "./lib_git_message_generate.js"
import type {GitMessagePromptInputs} from "./lib_git_message_prompt.js"
import * as lib_git_message_ui from "./lib_git_message_ui.js"
import * as lib_git_message_validate from "./lib_git_message_validate.js"
import * as lib_git_simple_open from "./lib_git_simple_open.js"
import type {SimpleGit} from "./lib_git_simple_open.js"
import * as lib_git_simple_staging from "./lib_git_simple_staging.js"
import * as lib_llm_config from "./lib_llm_config.js"
import * as lib_stdio from "./lib_stdio.js"
import * as lib_tell from "./lib_tell.js"
import * as lib_tui_justify from "./lib_tui_justify.js"
import * as lib_tui_readline from "./lib_tui_readline.js"

export default {}

async function phase_open(): Promise<SimpleGit> {
  const git = await lib_git_simple_open.git_simple_open_git_repo()

  await lib_git_simple_open.git_simple_open_check_not_bare(git)

  return git
}

async function phase_add({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {auto_add, disable_add, silent} = config

  if (lib_debug.debug_channels.git) {
    const status = await git.status()

    lib_debug.debug_inspect(status, "status")
  }

  const has_staged_changes = await lib_git_simple_staging.git_simple_staging_has_staged_changes(git)

  if (has_staged_changes) {
    return
  }

  const has_unstaged_changes = await lib_git_simple_staging.git_simple_staging_has_unstaged_changes(git)

  if (!has_unstaged_changes) {
    lib_abort.abort_with_warning("No changes found in the repository - there is nothing to commit")
  }

  if (disable_add) {
    lib_abort.abort_with_warning("No staged changes found and adding changes is disabled")
  }

  if (auto_add) {
    if (!silent) {
      lib_tell.tell_action("Auto-adding changes")
    }
  } else {
    const add_confirmed = await lib_tui_readline.tui_readline_confirm(
      "No staged changes found - would you like to add all changes?",
    )

    if (!add_confirmed) {
      lib_abort.abort_with_warning("Please add changes before creating a commit")
    }
  }

  await lib_git_simple_staging.git_simple_staging_stage_all_changes(git)
  if (!silent) {
    lib_tell.tell_success("All changed files added successfully")
  }
}

async function phase_status({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {disable_status, silent} = config

  if (disable_status || silent) {
    return
  }

  lib_tell.tell_info("Files staged for commit:")

  const status = await git.status()

  const files_added = status.files.filter((file) => file.index === "A")
  const files_deleted = status.files.filter((file) => file.index === "D")
  const files_renamed = status.files.filter((file) => file.index === "R")
  const files_modified = status.files.filter((file) => file.index === "M")

  const files_staged = [
    // All the possible staged index codes
    ...files_added,
    ...files_deleted,
    ...files_renamed,
    ...files_modified,
  ]
  const max_length = Math.max(...files_staged.map((file) => file.path.length), 10)

  for (const file of files_added) {
    lib_stdio.write_stdout_linefeed(`  ${lib_tui_justify.tui_justify_left(max_length, file.path)}  (added)`)
  }

  for (const file of files_modified) {
    lib_stdio.write_stdout_linefeed(`  ${lib_tui_justify.tui_justify_left(max_length, file.path)}  (modified)`)
  }

  for (const file of files_renamed) {
    lib_stdio.write_stdout_linefeed(
      `  ${lib_tui_justify.tui_justify_left(max_length, file.path)}  (renamed from ${file.from})`,
    )
  }

  for (const file of files_deleted) {
    lib_stdio.write_stdout_linefeed(`  ${lib_tui_justify.tui_justify_left(max_length, file.path)}  (deleted)`)
  }

  if (files_staged.length === 0) {
    lib_abort.abort_with_warning("No files staged for commit")
  }
}

async function phase_compare({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {silent} = config

  if (!silent) {
    lib_tell.tell_action("Generating Git commit messages using all models in parallel")
  }

  const {all_llm_configs, add_prefix, add_suffix} = config

  const diffstat = await lib_git_simple_staging.git_simple_staging_get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.git_simple_staging_get_staged_diff(git)

  const inputs: GitMessagePromptInputs = {diffstat, diff}

  const result_promises = all_llm_configs.map((llm_config) => git_message_generate_result({llm_config, inputs}))

  const all_results: Array<GitMessageGenerateResult> = await Promise.all(result_promises)

  for (const result of all_results) {
    const {llm_config, seconds, error_text} = result
    let {git_message} = result

    const model_via = lib_llm_config.llm_config_get_model_via(llm_config)

    if (error_text) {
      lib_tell.tell_warning(
        `Failed to generate a commit message in ${seconds} seconds using ${model_via}: ${error_text}`,
      )
      continue
    }

    if (!git_message) {
      continue
    }

    lib_tell.tell_info(`Git commit message in ${seconds} seconds using ${model_via}:`)

    const validation_result = lib_git_message_validate.git_message_validate_get_result(git_message)

    const teller = validation_result.valid ? lib_tell.tell_plain : lib_tell.tell_warning

    git_message = lib_diffdash_modify.diffdash_modify_add_prefix_or_suffix({git_message, add_prefix, add_suffix})
    git_message = lib_diffdash_modify.diffdash_modify_add_footer({git_message, llm_config})

    lib_git_message_ui.git_message_display({git_message, teller})
  }
}

async function phase_commit({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {add_prefix, add_suffix, auto_commit, disable_commit, disable_preview, silent, llm_config} = config

  const model_via = lib_llm_config.llm_config_get_model_via(llm_config)

  if (!silent) {
    lib_tell.tell_action(`Generating the Git commit message using ${model_via}`)
  }

  const diffstat = await lib_git_simple_staging.git_simple_staging_get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.git_simple_staging_get_staged_diff(git)

  const inputs: GitMessagePromptInputs = {diffstat, diff}

  const result: GitMessageGenerateResult = await git_message_generate_result({llm_config, inputs})

  const {error_text} = result
  let {git_message} = result

  if (error_text) {
    lib_abort.abort_with_error(`Failed to generate a commit message using ${model_via}: ${error_text}`)
  }

  if (!git_message) {
    return
  }

  lib_git_message_validate.git_message_validate_check(git_message)

  git_message = lib_diffdash_modify.diffdash_modify_add_prefix_or_suffix({git_message, add_prefix, add_suffix})
  git_message = lib_diffdash_modify.diffdash_modify_add_footer({git_message, llm_config})

  if (!disable_preview && !silent) {
    lib_git_message_ui.git_message_display({git_message, teller: lib_tell.tell_plain})
  }

  if (disable_commit) {
    return
  }

  if (auto_commit) {
    if (!silent) {
      lib_tell.tell_action("Auto-committing changes")
    }
  } else {
    const commit_confirmed = await lib_tui_readline.tui_readline_confirm("Do you want to commit these changes?")

    if (!commit_confirmed) {
      lib_abort.abort_with_warning("Commit cancelled by user")
    }
  }

  await lib_git_simple_staging.git_simple_staging_create_commit(git, git_message)

  if (!silent) {
    lib_tell.tell_success("Changes committed successfully")
  }
}

async function phase_push({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {auto_push, disable_commit, disable_push, no_verify, silent} = config

  if (disable_push || disable_commit) {
    return
  }

  if (auto_push) {
    if (!silent) {
      lib_tell.tell_action("Auto-pushing changes")
    }
  } else {
    const push_confirmed = await lib_tui_readline.tui_readline_confirm("Do you want to push these changes?")
    if (!push_confirmed) {
      return
    }
  }

  try {
    await lib_git_simple_staging.git_simple_staging_push_to_remote(git, no_verify)
  } catch (error) {
    lib_abort.abort_with_error(`Failed to push to remote: ${lib_error.error_get_text(error)}`)
  }

  if (!silent) {
    lib_tell.tell_success("Changes pushed successfully")
  }
}

export async function diffdash_sequence_normal(config: DiffDashConfig): Promise<void> {
  const git = await phase_open()

  await phase_add({config, git})
  await phase_status({config, git})
  await phase_commit({config, git})
  await phase_push({config, git})
}

export async function diffdash_sequence_compare(config: DiffDashConfig): Promise<void> {
  const git = await phase_open()

  await phase_add({config, git})
  await phase_status({config, git})
  await phase_compare({config, git})
}
