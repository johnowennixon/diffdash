import {EMPTY, LF} from "./lib_char.js"

export default {}

const MAX_LENGTH = 120_000

export interface GitMessagePromptDetails {
  diffstat: string
  diff: string
  original: string
  use_original: boolean
}

export interface StagedChangesPromptDetails {
  diff_stats: string
  diff: string
  branch_info: {name: string; last_commit_sha: string}
  recent_commits: Array<{sha: string; message: string}>
  prefix?: string | undefined
  suffix?: string | undefined
}

/**
 * System prompt for the LLM
 */
export function get_system_prompt(): string {
  const system_prompt = `
Your role is to generate a Git commit message in standard English.
The user does not want Conventional Commits.
Just use proper sentences throughout.

The user will send you a <diffstat> block, the output of a 'git diff --staged --stat' command.
The user will send you a <diff> block, the output of a 'git diff --staged' command.

Some reminders of how diffs work:
- Lines that start with a single plus sign have been added to the file.
- Lines that start with a single minus sign have been removed from the file.
- Lines that start with @@ indicate a jump to a different section of the file - you can not see the code that are in these gaps.

Use the following format:
- First line: A single sentence giving a concise summary of the changes written.
- Leave a blank line after the first line.
- Then add a handful of bullet points containing single sentences explaining the key changes in more detail.

Please write in full sentences that start with a capital letter.
Each sentence should be on its own line.
Focus on what changed and why, not how.
Use the present tense.

Everything you write will be presented to the user for review before committing.
Therefore, just output the Git message itself without any introduction or comments at the end.
`.trim()

  return system_prompt
}

/**
 * Create a user prompt for the original history rewriting functionality
 */
export function get_user_prompt(details: GitMessagePromptDetails): string {
  const {diffstat, diff, original, use_original} = details

  let result = EMPTY

  if (use_original) {
    result += "<original>" + LF + original + "</original>" + LF + LF
  }

  result += "<diffstat>" + LF + diffstat + "</diffstat>" + LF + LF

  result += "<diff>" + LF + diff + "</diff>" + LF + LF

  // If the prompt is too long, truncate it and add a note
  if (result.length > MAX_LENGTH) {
    result = result.slice(0, MAX_LENGTH) + LF + LF + LF + "[The Diff has been truncated]"
  }

  return result
}

/**
 * Create a user prompt for staged changes
 */
export function create_user_prompt_for_staged_changes(details: StagedChangesPromptDetails): string {
  const {diff_stats, diff, branch_info, recent_commits, prefix, suffix} = details

  let result = EMPTY

  // Add custom prefix if provided
  if (prefix) {
    result += prefix + LF + LF
  }

  // Add branch information
  result += "<branch>" + LF
  result += `Current branch: ${branch_info.name}` + LF
  result += "</branch>" + LF + LF

  // Add recent commits for context
  if (recent_commits.length > 0) {
    result += "<recent_commits>" + LF
    for (const commit of recent_commits) {
      result += `${commit.sha.substring(0, 7)}: ${commit.message.split("\n")[0]}` + LF
    }
    result += "</recent_commits>" + LF + LF
  }

  // Add diffstat
  result += "<diffstat>" + LF + diff_stats + "</diffstat>" + LF + LF

  // Add full diff
  result += "<diff>" + LF + diff + "</diff>" + LF + LF

  // Add custom suffix if provided
  if (suffix) {
    result += suffix + LF + LF
  }

  // If the prompt is too long, truncate it and add a note
  if (result.length > MAX_LENGTH) {
    result = result.slice(0, MAX_LENGTH) + LF + LF + LF + "[The Diff has been truncated]"
  }

  return result
}
