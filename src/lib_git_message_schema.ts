import {z} from "zod"

import {LF} from "./lib_char_control.js"
import {EMPTY} from "./lib_char_empty.js"

export default {}

export const git_message_schema = z.object({
  summary_line: z.string().describe("A single sentence giving a concise summary of the changes."),
  extra_lines: z
    .array(z.string().describe("Another sentence giving more information about the changes."))
    .describe("More information about the changes."),
})

export type GitMessageSchema = z.TypeOf<typeof git_message_schema>

export function git_message_schema_format(message: GitMessageSchema): string {
  return [
    message.summary_line,
    EMPTY, // Empty line
    ...message.extra_lines.map((line) => (line.startsWith("- ") ? line : `- ${line}`)),
  ].join(LF)
}
