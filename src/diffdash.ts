#!/usr/bin/env tsx

import * as lib_abort from "./lib_abort.js"
import * as lib_ansi from "./lib_ansi.js"
import * as lib_diffdash_config from "./lib_diffdash_config.js"
import * as lib_git_message_generator from "./lib_git_message_generator.js"
import * as lib_git_message_ui from "./lib_git_message_ui.js"
import * as lib_git_simple_staging from "./lib_git_simple_staging.js"
import * as lib_git_simple_utils from "./lib_git_simple_utils.js"
import * as lib_readline_ui from "./lib_readline_ui.js"
import * as lib_tell from "./lib_tell.js"

async function main(): Promise<void> {
  const diffdash = lib_ansi.italic("DiffDash")

  lib_tell.normal(`This is ${diffdash} - the AI Git commit tool as fast as an API call`)

  // Process and validate configuration
  const config = lib_diffdash_config.process_config()

  const {llm_config} = config

  const git = await lib_git_simple_utils.open_repository()
  const is_valid = await lib_git_simple_utils.validate_repository(git)

  if (!is_valid) {
    lib_abort.abort("Cannot proceed with an invalid repository")
  }

  // Check for staged changes
  const has_staged_changes = await lib_git_simple_staging.has_staged_changes(git)

  if (!has_staged_changes) {
    // Check if there are any unstaged changes
    const has_unstaged_changes = await lib_git_simple_staging.has_unstaged_changes(git)

    if (!has_unstaged_changes) {
      lib_abort.abort("No changes found in the repository - there is nothing to commit")
    }

    // Ask if the user wants to stage all changes
    const stage_all_confirmed = await lib_readline_ui.confirm(
      "No staged changes found - would you like to add all changes?",
    )

    if (stage_all_confirmed) {
      await lib_git_simple_staging.stage_all_changes(git)
      lib_tell.success("All changes have been added")
    } else {
      lib_abort.abort("Please add changes before creating a commit")
    }
  }

  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  // Generate commit message
  const commit_message = await lib_git_message_generator.generate_message({
    llm_config,
    diffstat,
    diff,
  })

  // Display the generated message and get confirmation
  lib_tell.info("Generated commit message:")
  lib_git_message_ui.display_message(commit_message)

  const confirmed = await lib_readline_ui.confirm("Do you want to commit these changes?")

  if (!confirmed) {
    lib_abort.abort("Commit cancelled by user.")
  }

  // Create the commit
  await lib_git_simple_staging.create_commit(git, commit_message)
  lib_tell.success("Changes committed successfully")

  // Ask if the user wants to push the changes
  const push_confirmed = await lib_readline_ui.confirm("Do you want to push these changes?")

  if (push_confirmed) {
    const push_success = await lib_git_simple_utils.push_to_remote(git)
    if (push_success) {
      lib_tell.success("Changes pushed successfully")
    }
  }
}

await main().catch((error) => {
  lib_tell.error(`Unhandled error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
