import {EMPTY, LF} from "./lib_char.js"

export default {}

const MAX_LENGTH = 100_000

export interface GitMessagePromptDetails {
  diffstat: string
  diff: string
}

export function get_system_prompt(): string {
  const system_prompt = `
Your role is to generate a Git commit message in conversational English.
The user does not want Conventional Commits - the summary line must be a normal sentence.

The user will send you a <diffstat> block, the output of a 'git diff --staged --stat' command.
The user will send you a <diff> block, the output of a 'git diff --staged' command.

Some reminders of how diffs work:
* Lines that start with a single plus sign have been added to the file.
* Lines that start with a single minus sign have been removed from the file.
* Lines that start with @@ indicate a jump to a different section of the file - you can not see the code in these gaps.

You must output in the following format - without any preamble or conclusion:
* First line: a single sentence giving a concise summary of the changes written.
* Leave a blank line after the first line.
* Then add around five bullet points (lines that start with a dash).
* And nothing else.

Use the imperative mood and present tense.
Please write in full sentences that start with a capital letter.
Each sentence should be on its own line.
Focus on why things were changed, not how or what.
Don't assume the change is always an improvement - we all make mistakes.
Each bullet point should be a single sentence explaining the key changes in more detail.
If there are a lot of changes, you will need to summarize even more.
Avoid comma-separated lists of more than five items in any sentence.
Avoid making the bullet points just a list of similar things.

Everything you write will be checked for validity and then saved directly to Git - it will not be reviewed by a human.
Therefore, you must just output the Git message itself without any introductory or concluding sections.
`.trim()

  return system_prompt
}

export function get_user_prompt(details: GitMessagePromptDetails): string {
  const {diffstat, diff} = details

  const truncate = diff.length > MAX_LENGTH

  const diff_truncated = truncate ? diff.slice(0, MAX_LENGTH) + LF : diff

  const format_portion = `
You must output in the following format - without any preamble or conclusion:
* First line: A single sentence giving a concise summary of the changes written.
* Leave a blank line after the first line.
* Then add around five bullet points (lines that start with a dash).
* And nothing else.
`.trim()

  let result = EMPTY

  result += "<diffstat>" + LF + diffstat + "</diffstat>" + LF + LF

  result += "<diff>" + LF + diff_truncated + "</diff>" + LF + LF

  if (truncate) {
    result += "Please note: the Diff above has been truncated" + LF + LF
  }

  result += format_portion + LF + LF

  return result.trim()
}
