#!/usr/bin/env tsx

import * as lib_abort from "./lib_abort.js"
import * as lib_ansi from "./lib_ansi.js"
import * as lib_diffdash_config from "./lib_diffdash_config.js"
import * as lib_git_message_generator from "./lib_git_message_generator.js"
import * as lib_git_message_ui from "./lib_git_message_ui.js"
import * as lib_git_simple_staging from "./lib_git_simple_staging.js"
import * as lib_git_simple_utils from "./lib_git_simple_utils.js"
import * as lib_readline_prompt from "./lib_readline_prompt.js"
import * as lib_tell from "./lib_tell.js"

async function main(): Promise<void> {
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
    lib_abort.abort("No staged changes found. Please stage changes before creating a commit.")
  }

  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  // Generate commit message

  const commit_message = await lib_git_message_generator.generate_message({
    llm_config,
    diffstat: diffstat,
    diff,
  })

  // Display the generated message and get confirmation
  lib_tell.info("Generated commit message:")
  lib_git_message_ui.display_message(commit_message)

  const confirmed = await lib_readline_prompt.confirm(lib_ansi.bold("Do you want to create this commit?"))

  if (!confirmed) {
    lib_abort.abort("Commit cancelled by user.")
  }

  // Create the commit
  try {
    await lib_git_simple_staging.create_commit(git, commit_message)
    lib_tell.success("Commit created successfully!")
  } catch (error) {
    lib_abort.abort(`Failed to create commit: ${error instanceof Error ? error.message : String(error)}`)
  }
}

await main().catch((error) => {
  lib_tell.error(`Unhandled error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
