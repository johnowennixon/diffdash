import type {SimpleGit} from "simple-git"

import * as lib_abort from "./lib_abort.js"
import type {DiffDashConfig} from "./lib_diffdash_config.js"
import * as lib_git_message_generator from "./lib_git_message_generator.js"
import * as lib_git_message_ui from "./lib_git_message_ui.js"
import * as lib_git_simple_open from "./lib_git_simple_open.js"
import * as lib_git_simple_staging from "./lib_git_simple_staging.js"
import * as lib_llm_config from "./lib_llm_config.js"
import * as lib_readline_ui from "./lib_readline_ui.js"
import * as lib_stdio from "./lib_stdio.js"
import * as lib_tell from "./lib_tell.js"
import * as lib_tui from "./lib_tui.js"

export default {}

async function phase_open(): Promise<SimpleGit> {
  const git = await lib_git_simple_open.open_git_repo()

  await lib_git_simple_open.check_git_repo_is_not_bare(git)

  return git
}

async function phase_add(config: DiffDashConfig, git: SimpleGit): Promise<void> {
  const {auto_add, disable_add} = config

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
    lib_tell.action("Auto-adding changes")
  } else {
    const add_confirmed = await lib_readline_ui.confirm("No staged changes found - would you like to add all changes?")

    if (!add_confirmed) {
      lib_abort.with_warning("Please add changes before creating a commit")
    }
  }

  await lib_git_simple_staging.stage_all_changes(git)
  lib_tell.success("All changed files added successfully")
}

async function phase_status(config: DiffDashConfig, git: SimpleGit): Promise<void> {
  const {disable_status} = config

  if (disable_status) {
    return
  }

  lib_tell.info("Files staged for commit:")

  const status = await git.status()

  // Get the maximum length of file paths for alignment
  const all_files = [
    ...status.created,
    ...status.modified,
    ...status.renamed.map((rename) => rename.to),
    ...status.deleted,
  ]
  const max_length = Math.max(...all_files.map((file) => file.length), 10)

  // Display new files
  if (status.created.length > 0) {
    for (const file of status.created) {
      lib_stdio.write_stdout_linefeed(`  ${lib_tui.justify_left(max_length, file)}  (new)`)
    }
  }

  // Display modified files
  if (status.modified.length > 0) {
    for (const file of status.modified) {
      lib_stdio.write_stdout_linefeed(`  ${lib_tui.justify_left(max_length, file)}  (modified)`)
    }
  }

  // Display renamed files
  if (status.renamed.length > 0) {
    for (const rename of status.renamed) {
      lib_stdio.write_stdout_linefeed(`  ${lib_tui.justify_left(max_length, rename.to)}  (renamed from ${rename.from})`)
    }
  }

  // Display deleted files
  if (status.deleted.length > 0) {
    for (const file of status.deleted) {
      lib_stdio.write_stdout_linefeed(`  ${lib_tui.justify_left(max_length, file)}  (deleted)`)
    }
  }

  // If no files are staged (this shouldn't happen at this point, but just in case)
  if (status.staged.length === 0) {
    lib_abort.with_warning("No files staged for commit")
  }
}

async function phase_commit(config: DiffDashConfig, git: SimpleGit): Promise<void> {
  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  const {llm_config, auto_commit, disable_commit} = config

  const {llm_model_name, llm_provider} = llm_config

  lib_tell.action(`Generating the commit message (using ${llm_model_name} via ${llm_provider})`)

  lib_llm_config.show_llm_config({llm_config})

  const commit_message = await lib_git_message_generator.generate_message({
    llm_config,
    diffstat,
    diff,
  })

  lib_git_message_ui.display_message(commit_message)

  if (disable_commit) {
    return
  }

  if (auto_commit) {
    lib_tell.action("Auto-committing changes")
  } else {
    const commit_confirmed = await lib_readline_ui.confirm("Do you want to commit these changes?")

    if (!commit_confirmed) {
      lib_abort.with_warning("Commit cancelled by user")
    }
  }

  await lib_git_simple_staging.create_commit(git, commit_message)
  lib_tell.success("Changes committed successfully")
}

async function phase_push(config: DiffDashConfig, git: SimpleGit): Promise<void> {
  const {auto_push, disable_commit, disable_push, no_verify} = config

  if (disable_push || disable_commit) {
    return
  }

  if (auto_push) {
    lib_tell.action("Auto-pushing changes")
  } else {
    const push_confirmed = await lib_readline_ui.confirm("Do you want to push these changes?")
    if (!push_confirmed) {
      return
    }
  }

  const push_success = await lib_git_simple_staging.push_to_remote(git, no_verify)
  if (push_success) {
    lib_tell.success("Changes pushed successfully")
  }
}

export async function sequence_work(config: DiffDashConfig): Promise<void> {
  const git = await phase_open()

  await phase_add(config, git)
  await phase_status(config, git)
  await phase_commit(config, git)
  await phase_push(config, git)
}
