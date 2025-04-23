#!/usr/bin/env tsx

import * as lib_abort from "./lib_abort.js"
import * as lib_ansi from "./lib_ansi.js"
import {EMPTY, LF} from "./lib_char.js"
import * as lib_diffdash_config from "./lib_diffdash_config.js"
import * as lib_git_message_generator from "./lib_git_message_generator.js"
import * as lib_git_simple_utils from "./lib_git_simple_utils.js"
import * as lib_git_staging from "./lib_git_staging.js"
import * as lib_readline_prompt from "./lib_readline_prompt.js"
import * as lib_stdio from "./lib_stdio.js"
import * as lib_tell from "./lib_tell.js"

/**
 * Display a formatted commit message with proper syntax highlighting
 */
export function display_message(text: string): void {
  // Split the message into lines
  const lines = text.split(LF)

  // First line is the subject (highlighted in bold)
  if (lines.length > 0 && lines[0]) {
    const subject = lines[0]
    lib_stdio.write_stderr_linefeed(lib_ansi.bold(subject))
  }

  // Add an empty line if there isn't one after the subject
  if (lines.length > 1 && lines[1] && lines[1].trim() !== EMPTY) {
    lib_stdio.write_stderr_linefeed(EMPTY)
  }

  // Rest of the message is shown in normal text
  // Highlighting bullet points in cyan
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i] || ""

    // Highlight bullet points
    if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
      const parts = line.split(/^(\s*[-*]\s+)/)
      if (parts.length >= 3) {
        const indent = parts[0] || ""
        const bullet = parts[1] || ""
        const content = parts.slice(2).join("")
        lib_stdio.write_stderr_linefeed(`${indent}${lib_ansi.cyan(bullet)}${content}`)
        continue
      }
    }

    lib_stdio.write_stderr_linefeed(line)
  }

  // Add a blank line after the message
  lib_stdio.write_stderr_linefeed(EMPTY)
}

async function main(): Promise<void> {
  // Process and validate configuration
  const config = lib_diffdash_config.process_config()

  // Open and validate the repository
  if (config.verbose) {
    lib_tell.info(`Opening repository at ${config.repo_path}...`)
  }

  const git = await lib_git_simple_utils.open_repository(config.repo_path)
  const is_valid = await lib_git_simple_utils.validate_repository(git)

  if (!is_valid) {
    lib_abort.abort("Cannot proceed with an invalid repository")
  }

  // Check for staged changes
  const has_staged_changes = await lib_git_staging.has_staged_changes(git)

  if (!has_staged_changes) {
    lib_abort.abort("No staged changes found. Please stage changes before creating a commit.")
  }

  // Gather context for the commit message
  if (config.verbose) {
    lib_tell.info("Gathering information about staged changes...")
  }

  const diff_stats = await lib_git_staging.get_staged_diff_stats(git)
  const diff = await lib_git_staging.get_staged_diff(git)

  // Generate commit message
  if (config.verbose) {
    lib_tell.info("Generating commit message using LLM...")
  }

  const commit_message = await lib_git_message_generator.generate_message({
    config,
    diff_stats,
    diff,
  })

  // Display the generated message and get confirmation
  lib_tell.info("Generated commit message:")
  display_message(commit_message)

  const confirmed = await lib_readline_prompt.confirm("Do you want to create this commit?")

  if (!confirmed) {
    lib_abort.abort("Commit cancelled by user.")
  }

  // Create the commit
  if (config.verbose) {
    lib_tell.info("Creating commit...")
  }

  try {
    await lib_git_staging.create_commit(git, commit_message)
    lib_tell.success("Commit created successfully!")
  } catch (error) {
    lib_abort.abort(`Failed to create commit: ${error instanceof Error ? error.message : String(error)}`)
  }

  lib_tell.okay()
}

await main().catch((error) => {
  lib_tell.error(`Unhandled error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
