import {z} from "zod"

import {EMPTY, LF} from "./lib_char.js"

export default {}

export const git_commit_message_schema = z.object({
  summary_line: z.string().describe("A single sentence giving a concise summary of the changes."),
  extra_lines: z
    .array(z.string().describe("Another sentence giving more information about the changes."))
    .describe("More information about the changes."),
})

export type GitCommitMessage = z.TypeOf<typeof git_commit_message_schema>

export function format_git_commit_message(message: GitCommitMessage): string {
  return [
    message.summary_line,
    EMPTY, // Empty line
    ...message.extra_lines.map((line) => (line.startsWith("- ") ? line : `- ${line}`)),
  ].join(LF)
}
