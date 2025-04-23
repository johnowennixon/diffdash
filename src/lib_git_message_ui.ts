import * as lib_ansi from "./lib_ansi.js"
import {EMPTY, LF} from "./lib_char.js"
import * as lib_stdio from "./lib_stdio.js"

export default {}

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
