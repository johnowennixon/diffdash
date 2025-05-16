import {z} from "zod"

import {DASH, EMPTY, LF} from "./lib_char.js"

export default {}

export const git_commit_message_schema = z.object({
  summary_line: z.string(),
  extra_lines: z.array(z.string()),
})

export type GitCommitMessage = z.infer<typeof git_commit_message_schema>

export function format_git_commit_message(message: GitCommitMessage): string {
  return [
    message.summary_line,
    EMPTY, // Empty line
    ...message.extra_lines.map((extra_line) => `${DASH} ${extra_line}`),
  ].join(LF)
}
