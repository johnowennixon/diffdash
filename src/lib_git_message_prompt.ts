import {EMPTY, LF} from "./lib_char.js"

export default {}

const MAX_LENGTH = 120_000

export interface GitMessagePromptDetails {
  diffstat: string
  diff: string
  original: string
  use_original: boolean
}

export function get_system_prompt(): string {
  const system_prompt = `
Your role is to generate a Git commit message in conversational English.
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
- Then add a handful of bullet points (lines starting with a dash).
- Each bullet point should be a single sentence explaining the key changes in more detail.

Please write in full sentences that start with a capital letter.
Each sentence should be on its own line.
Focus on what changed and why, not how.
Avoid lists of more than three items in any one sentence and replace them with a summary.
Use the present tense.

Everything you write will be saved directly to Git and will not be reviewed by a human.
Therefore, just output the Git message itself without any introduction or comments at the end.
`.trim()

  return system_prompt
}

export function get_user_prompt(details: GitMessagePromptDetails): string {
  const {diffstat, diff} = details

  let result = EMPTY

  result += "<diffstat>" + LF + diffstat + "</diffstat>" + LF + LF

  result += "<diff>" + LF + diff + "</diff>" + LF + LF

  // If the prompt is too long, truncate it and add a note
  if (result.length > MAX_LENGTH) {
    result = result.slice(0, MAX_LENGTH) + LF + LF + LF + "[The Diff has been truncated]"
  }

  return result
}
