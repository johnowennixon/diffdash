import * as lib_abort from "./lib_abort.js"
import * as lib_debug from "./lib_debug.js"
import type {DiffDashConfig} from "./lib_diffdash_config.js"
import * as lib_diffdash_generate from "./lib_diffdash_generate.js"
import * as lib_git_message_ui from "./lib_git_message_ui.js"
import * as lib_git_simple_open from "./lib_git_simple_open.js"
import type {SimpleGit} from "./lib_git_simple_open.js"
import * as lib_git_simple_staging from "./lib_git_simple_staging.js"
import * as lib_stdio from "./lib_stdio.js"
import * as lib_tell from "./lib_tell.js"
import * as lib_tui from "./lib_tui.js"
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
    lib_stdio.write_stdout_linefeed(`  ${lib_tui.justify_left(max_length, file.path)}  (added)`)
  }

  for (const file of files_modified) {
    lib_stdio.write_stdout_linefeed(`  ${lib_tui.justify_left(max_length, file.path)}  (modified)`)
  }

  for (const file of files_renamed) {
    lib_stdio.write_stdout_linefeed(`  ${lib_tui.justify_left(max_length, file.path)}  (renamed from ${file.from})`)
  }

  for (const file of files_deleted) {
    lib_stdio.write_stdout_linefeed(`  ${lib_tui.justify_left(max_length, file.path)}  (deleted)`)
  }

  if (files_staged.length === 0) {
    lib_abort.with_warning("No files staged for commit")
  }
}

async function phase_compare({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  await lib_diffdash_generate.generate_and_compare({config, git})
}

async function phase_commit({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {auto_commit, disable_commit, disable_preview, silent} = config

  const commit_message_with_footer = await lib_diffdash_generate.generate_for_commit({config, git})

  if (!disable_preview && !silent) {
    lib_git_message_ui.display_message({message: commit_message_with_footer, teller: lib_tell.plain})
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

  await lib_git_simple_staging.create_commit(git, commit_message_with_footer)
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
