import {LF} from "./lib_char_control.js"
import {EMPTY} from "./lib_char_empty.js"

const LF_LF = LF + LF

export type GitMessagePromptInputs = {
  diffstat: string
  diff: string
  extra_prompts: Array<string> | undefined
}

const portion_role =
  `
Your role is to generate a Git commit message in conversational English.
The user does not want Conventional Commits - the summary line must be a normal sentence.
`.trim() + LF_LF

const portion_inputs =
  `
The user will send you a <diffstat> block, the output of a 'git diff --staged --stat' command.
The user will send you a <diff> block, the output of a 'git diff --staged' command.
`.trim() + LF_LF

const portion_reminders =
  `
Some reminders of how diffs work:
- Lines that start with a single plus sign have been added to the file.
- Lines that start with a single minus sign have been removed from the file.
- Lines that start with @@ indicate a jump to a different section of the file - you can not see the code in these gaps.
`.trim() + LF_LF

const portion_format_structured =
  `
You must output in the following format (this will be forced):
- summary_line: a single sentence giving a concise summary of the changes.
- extra_lines: additional sentences giving more information about the changes.
`.trim() + LF_LF

const portion_format_unstructured =
  `
You must output in the following format - without any preamble or conclusion:
- First line: a single sentence giving a concise summary of the changes.
- Second line: completely blank - not even any spaces.
- Then an unordered list (with a dash prefix) of additional sentences giving more information about the changes.
- And nothing else.
`.trim() + LF_LF

const portion_format = (has_structured_json: boolean): string => {
  return has_structured_json ? portion_format_structured : portion_format_unstructured
}

const portion_instructions =
  `
Use the imperative mood and present tense.
Please write in full sentences that start with a capital letter.
Write prose rather than making lists.
Keep each sentence no longer than about twenty words.
Focus on why things were changed, not how or what.
Things that are being added are more relevant than things that are being deleted.
Code changes are more important than documentation changes.
Be humble - you don't really know why the change was made.
Don't assume the change is always an improvement - it might be making things worse.
The number of additional sentences should depend upon the complexity of the change.
A simple change needs only two additional sentences scaling up to a complex change with five additional sentences.
If there are a lot of changes, you will need to summarize even more.
`.trim() + LF_LF

const portion_extra = (extra_prompts: Array<string> | undefined): string => {
  return extra_prompts && extra_prompts.length > 0 ? extra_prompts.map((s) => s.trim()).join(LF) + LF_LF : EMPTY
}

const portion_final =
  `
Everything you write will be checked for validity and then saved directly to Git - it will not be reviewed by a human.
Therefore, you must just output the Git message itself without any introductory or concluding sections.
`.trim() + LF_LF

export function git_message_prompt_get_system({
  has_structured_json,
  inputs,
}: {
  has_structured_json: boolean
  inputs: GitMessagePromptInputs
}): string {
  let system_prompt = EMPTY

  system_prompt += portion_role
  system_prompt += portion_inputs
  system_prompt += portion_reminders
  system_prompt += portion_format(has_structured_json)
  system_prompt += portion_instructions
  system_prompt += portion_extra(inputs.extra_prompts)
  system_prompt += portion_final

  return system_prompt.trim()
}

export function git_message_prompt_get_user({
  has_structured_json,
  inputs,
  max_length,
}: {
  has_structured_json: boolean
  inputs: GitMessagePromptInputs
  max_length: number
}): string {
  const {diffstat, diff} = inputs

  const truncate = diffstat.length + diff.length > max_length

  const diff_truncated = truncate ? diff.slice(0, max_length - diffstat.length) + LF : diff

  let user_prompt = EMPTY

  user_prompt += "<diffstat>" + LF + diffstat + "</diffstat>" + LF_LF

  user_prompt += "<diff>" + LF + diff_truncated + "</diff>" + LF_LF

  if (truncate) {
    user_prompt += "Please note: the Diff above has been truncated" + LF_LF
  }

  user_prompt += portion_format(has_structured_json)

  return user_prompt.trim()
}
