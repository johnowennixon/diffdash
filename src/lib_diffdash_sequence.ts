import {abort_with_error, abort_with_warning} from "./lib_abort.js"
import {debug_channels, debug_inspect} from "./lib_debug.js"
import {diffdash_add_footer, diffdash_add_prefix_or_suffix} from "./lib_diffdash_add.js"
import type {DiffDashConfig} from "./lib_diffdash_config.js"
import {error_get_text} from "./lib_error.js"
import {git_message_generate_result} from "./lib_git_message_generate.js"
import type {GitMessageGenerateResult} from "./lib_git_message_generate.js"
import type {GitMessagePromptInputs} from "./lib_git_message_prompt.js"
import {git_message_display} from "./lib_git_message_ui.js"
import {git_message_validate_check, git_message_validate_get_result} from "./lib_git_message_validate.js"
import type {SimpleGit} from "./lib_git_simple_open.js"
import {git_simple_open_check_not_bare, git_simple_open_git_repo} from "./lib_git_simple_open.js"
import {
  git_simple_staging_create_commit,
  git_simple_staging_get_staged_diff,
  git_simple_staging_get_staged_diffstat,
  git_simple_staging_has_staged_changes,
  git_simple_staging_has_unstaged_changes,
  git_simple_staging_push_to_remote,
  git_simple_staging_stage_all_changes,
} from "./lib_git_simple_staging.js"
import {llm_config_get_model_via} from "./lib_llm_config.js"
import {stdio_write_stdout_linefeed} from "./lib_stdio_write.js"
import {tell_action, tell_info, tell_plain, tell_success, tell_warning} from "./lib_tell.js"
import {tui_justify_left} from "./lib_tui_justify.js"
import {tui_readline_confirm} from "./lib_tui_readline.js"

async function phase_open(): Promise<SimpleGit> {
  const git = await git_simple_open_git_repo()

  await git_simple_open_check_not_bare(git)

  return git
}

async function phase_add({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {auto_add, disable_add, silent} = config

  if (debug_channels.git) {
    const status = await git.status()

    debug_inspect(status, "status")
  }

  const has_staged_changes = await git_simple_staging_has_staged_changes(git)

  if (has_staged_changes) {
    return
  }

  const has_unstaged_changes = await git_simple_staging_has_unstaged_changes(git)

  if (!has_unstaged_changes) {
    abort_with_warning("No changes found in the repository - there is nothing to commit")
  }

  if (disable_add) {
    abort_with_warning("No staged changes found and adding changes is disabled")
  }

  if (auto_add) {
    if (!silent) {
      tell_action("Auto-adding changes")
    }
  } else {
    const add_confirmed = await tui_readline_confirm("No staged changes found - would you like to add all changes?")

    if (!add_confirmed) {
      abort_with_warning("Please add changes before creating a commit")
    }
  }

  await git_simple_staging_stage_all_changes(git)
  if (!silent) {
    tell_success("All changed files added successfully")
  }
}

async function phase_status({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {disable_status, silent} = config

  if (disable_status || silent) {
    return
  }

  tell_info("Files staged for commit:")

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
    stdio_write_stdout_linefeed(`  ${tui_justify_left(max_length, file.path)}  (added)`)
  }

  for (const file of files_modified) {
    stdio_write_stdout_linefeed(`  ${tui_justify_left(max_length, file.path)}  (modified)`)
  }

  for (const file of files_renamed) {
    stdio_write_stdout_linefeed(`  ${tui_justify_left(max_length, file.path)}  (renamed from ${file.from})`)
  }

  for (const file of files_deleted) {
    stdio_write_stdout_linefeed(`  ${tui_justify_left(max_length, file.path)}  (deleted)`)
  }

  if (files_staged.length === 0) {
    abort_with_warning("No files staged for commit")
  }
}

async function phase_compare({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {silent} = config

  if (!silent) {
    tell_action("Generating Git commit messages using all models in parallel")
  }

  const {all_llm_configs, add_prefix, add_suffix} = config

  const diffstat = await git_simple_staging_get_staged_diffstat(git)
  const diff = await git_simple_staging_get_staged_diff(git)

  const inputs: GitMessagePromptInputs = {diffstat, diff}

  const result_promises = all_llm_configs.map((llm_config) => git_message_generate_result({llm_config, inputs}))

  const all_results: Array<GitMessageGenerateResult> = await Promise.all(result_promises)

  for (const result of all_results) {
    const {llm_config, seconds, error_text} = result
    let {git_message} = result

    const model_via = llm_config_get_model_via(llm_config)

    if (error_text) {
      tell_warning(`Failed to generate a commit message in ${seconds} seconds using ${model_via}: ${error_text}`)
      continue
    }

    if (!git_message) {
      continue
    }

    tell_info(`Git commit message in ${seconds} seconds using ${model_via}:`)

    const validation_result = git_message_validate_get_result(git_message)

    const teller = validation_result.valid ? tell_plain : tell_warning

    git_message = diffdash_add_prefix_or_suffix({git_message, add_prefix, add_suffix})
    git_message = diffdash_add_footer({git_message, llm_config})

    git_message_display({git_message, teller})
  }
}

async function phase_commit({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {add_prefix, add_suffix, auto_commit, disable_commit, disable_preview, silent, llm_config} = config

  const model_via = llm_config_get_model_via(llm_config)

  if (!silent) {
    tell_action(`Generating the Git commit message using ${model_via}`)
  }

  const diffstat = await git_simple_staging_get_staged_diffstat(git)
  const diff = await git_simple_staging_get_staged_diff(git)

  const inputs: GitMessagePromptInputs = {diffstat, diff}

  const result: GitMessageGenerateResult = await git_message_generate_result({llm_config, inputs})

  const {error_text} = result
  let {git_message} = result

  if (error_text) {
    abort_with_error(`Failed to generate a commit message using ${model_via}: ${error_text}`)
  }

  if (!git_message) {
    return
  }

  git_message_validate_check(git_message)

  git_message = diffdash_add_prefix_or_suffix({git_message, add_prefix, add_suffix})
  git_message = diffdash_add_footer({git_message, llm_config})

  if (!disable_preview && !silent) {
    git_message_display({git_message, teller: tell_plain})
  }

  if (disable_commit) {
    return
  }

  if (auto_commit) {
    if (!silent) {
      tell_action("Auto-committing changes")
    }
  } else {
    const commit_confirmed = await tui_readline_confirm("Do you want to commit these changes?")

    if (!commit_confirmed) {
      abort_with_warning("Commit cancelled by user")
    }
  }

  await git_simple_staging_create_commit(git, git_message)

  if (!silent) {
    tell_success("Changes committed successfully")
  }
}

async function phase_push({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {auto_push, disable_commit, disable_push, no_verify, silent} = config

  if (disable_push || disable_commit) {
    return
  }

  if (auto_push) {
    if (!silent) {
      tell_action("Auto-pushing changes")
    }
  } else {
    const push_confirmed = await tui_readline_confirm("Do you want to push these changes?")
    if (!push_confirmed) {
      return
    }
  }

  try {
    await git_simple_staging_push_to_remote(git, no_verify)
  } catch (error) {
    abort_with_error(`Failed to push to remote: ${error_get_text(error)}`)
  }

  if (!silent) {
    tell_success("Changes pushed successfully")
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
