import * as lib_abort from "./lib_abort.js"
import * as lib_assert from "./lib_assert.js"
import * as lib_debug from "./lib_debug.js"
import type {DiffDashConfig} from "./lib_diffdash_config.js"
import * as lib_diffdash_modify from "./lib_diffdash_modify.js"
import * as lib_git_message_generate from "./lib_git_message_generate.js"
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
  const git = await lib_git_simple_open.open_git_repo()

  await lib_git_simple_open.check_git_repo_is_not_bare(git)

  return git
}

async function phase_add({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {auto_add, disable_add, silent} = config

  if (lib_debug.channels.git) {
    const status = await git.status()

    lib_debug.inspect(status, "status")
  }

  const has_staged_changes = await lib_git_simple_staging.has_staged_changes(git)

  if (has_staged_changes) {
    return
  }

  const has_unstaged_changes = await lib_git_simple_staging.has_unstaged_changes(git)

  if (!has_unstaged_changes) {
    lib_abort.with_warning("No changes found in the repository - there is nothing to commit")
  }

  if (disable_add) {
    lib_abort.with_warning("No staged changes found and adding changes is disabled")
  }

  if (auto_add) {
    if (!silent) {
      lib_tell.action("Auto-adding changes")
    }
  } else {
    const add_confirmed = await lib_tui_readline.confirm("No staged changes found - would you like to add all changes?")

    if (!add_confirmed) {
      lib_abort.with_warning("Please add changes before creating a commit")
    }
  }

  await lib_git_simple_staging.stage_all_changes(git)
  if (!silent) {
    lib_tell.success("All changed files added successfully")
  }
}

async function phase_status({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {disable_status, silent} = config

  if (disable_status || silent) {
    return
  }

  lib_tell.info("Files staged for commit:")

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
    lib_stdio.write_stdout_linefeed(`  ${lib_tui_justify.justify_left(max_length, file.path)}  (added)`)
  }

  for (const file of files_modified) {
    lib_stdio.write_stdout_linefeed(`  ${lib_tui_justify.justify_left(max_length, file.path)}  (modified)`)
  }

  for (const file of files_renamed) {
    lib_stdio.write_stdout_linefeed(
      `  ${lib_tui_justify.justify_left(max_length, file.path)}  (renamed from ${file.from})`,
    )
  }

  for (const file of files_deleted) {
    lib_stdio.write_stdout_linefeed(`  ${lib_tui_justify.justify_left(max_length, file.path)}  (deleted)`)
  }

  if (files_staged.length === 0) {
    lib_abort.with_warning("No files staged for commit")
  }
}

async function phase_compare({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {silent} = config

  if (!silent) {
    lib_tell.action("Generating Git commit messages using all models in parallel")
  }

  const {all_llm_configs, add_prefix, add_suffix} = config

  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  const inputs = {diffstat, diff}

  const generate_result_promises = all_llm_configs.map((llm_config) =>
    lib_git_message_generate.generate_message({llm_config, inputs}),
  )

  const all_generate_results = await Promise.allSettled(generate_result_promises)

  for (const [index, generate_result] of all_generate_results.entries()) {
    const llm_config = lib_assert.not_undefined(all_llm_configs[index])

    if (generate_result.status !== "fulfilled") {
      lib_tell.warning(`Failed to generate a commit message using LLM ${lib_llm_config.get_llm_model_via(llm_config)}`)
      continue
    }

    lib_tell.info(`Git commit message from ${lib_llm_config.get_llm_model_via(llm_config)}:`)

    let message = generate_result.value

    const validation_result = lib_git_message_validate.get_valid(message)

    const teller = validation_result.valid ? lib_tell.plain : lib_tell.warning

    message = lib_diffdash_modify.add_prefix_or_suffix({message, add_prefix, add_suffix})
    message = lib_diffdash_modify.add_footer({message, llm_config})

    lib_git_message_ui.display_message({message, teller})
  }
}

async function phase_commit({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {add_prefix, add_suffix, auto_commit, disable_commit, disable_preview, silent, llm_config} = config

  if (!silent) {
    lib_tell.action(`Generating the Git commit message using LLM ${lib_llm_config.get_llm_model_via(llm_config)}`)
  }

  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  const inputs = {diffstat, diff}

  let message = await lib_git_message_generate.generate_message({llm_config, inputs}).catch(() => {
    lib_abort.with_error(
      `Failed to generate a commit message using LLM ${lib_llm_config.get_llm_model_via(llm_config)}`,
    )
  })

  lib_git_message_validate.check_valid(message)

  message = lib_diffdash_modify.add_prefix_or_suffix({message, add_prefix, add_suffix})
  message = lib_diffdash_modify.add_footer({message, llm_config})

  if (!disable_preview && !silent) {
    lib_git_message_ui.display_message({message, teller: lib_tell.plain})
  }

  if (disable_commit) {
    return
  }

  if (auto_commit) {
    if (!silent) {
      lib_tell.action("Auto-committing changes")
    }
  } else {
    const commit_confirmed = await lib_tui_readline.confirm("Do you want to commit these changes?")

    if (!commit_confirmed) {
      lib_abort.with_warning("Commit cancelled by user")
    }
  }

  await lib_git_simple_staging.create_commit(git, message)

  if (!silent) {
    lib_tell.success("Changes committed successfully")
  }
}

async function phase_push({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {auto_push, disable_commit, disable_push, no_verify, silent} = config

  if (disable_push || disable_commit) {
    return
  }

  if (auto_push) {
    if (!silent) {
      lib_tell.action("Auto-pushing changes")
    }
  } else {
    const push_confirmed = await lib_tui_readline.confirm("Do you want to push these changes?")
    if (!push_confirmed) {
      return
    }
  }

  try {
    await lib_git_simple_staging.push_to_remote(git, no_verify)
  } catch (error) {
    lib_abort.with_error(`Failed to push to remote: ${error instanceof Error ? error.message : String(error)}`)
  }

  if (!silent) {
    lib_tell.success("Changes pushed successfully")
  }
}

export async function sequence_normal(config: DiffDashConfig): Promise<void> {
  const git = await phase_open()

  await phase_add({config, git})
  await phase_status({config, git})
  await phase_commit({config, git})
  await phase_push({config, git})
}

export async function sequence_compare(config: DiffDashConfig): Promise<void> {
  const git = await phase_open()

  await phase_add({config, git})
  await phase_status({config, git})
  await phase_compare({config, git})
}
