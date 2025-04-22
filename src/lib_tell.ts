import * as lib_ansi from "./lib_ansi.js"
import type {AnsiColourizer} from "./lib_ansi.js"
import {EMPTY, LF, SPACE} from "./lib_char.js"
import * as lib_datetime from "./lib_datetime.js"
import * as lib_enabled from "./lib_enabled.js"
import * as lib_stdio from "./lib_stdio.js"

export default {}

export const enables = {
  timestamp: lib_enabled.from_env("TELL_TIMESTAMP"),
}

export type Teller = (message: string) => void
export type TellerPromise = (message: string) => Promise<void>

export const nowhere: Teller = (_message: string) => {
  // intentionally empty
}

function generic(message: string, colourizer: AnsiColourizer): void {
  while (message.endsWith(LF)) {
    message = message.slice(0, -1)
  }

  let text = EMPTY

  if (enables.timestamp) {
    const now_local_ymdthms = lib_datetime.format_local_iso_ymdthms(lib_datetime.now())
    text += lib_ansi.grey(now_local_ymdthms)
    text += SPACE
  }

  text += colourizer(message)

  lib_stdio.write_stderr_linefeed(text)
}

export const normal: Teller = (message: string): void => {
  generic(message, lib_ansi.normal)
}

export const error: Teller = (message: string): void => {
  generic(message, lib_ansi.red)
}

export const warning: Teller = (message: string): void => {
  generic(message, lib_ansi.yellow)
}

export const success: Teller = (message: string): void => {
  generic(message, lib_ansi.green)
}

export const info: Teller = (message: string): void => {
  generic(message, lib_ansi.cyan)
}

export const action: Teller = (message: string): void => {
  generic(message, lib_ansi.magenta)
}

export const debug: Teller = (message: string): void => {
  generic(message, lib_ansi.grey)
}

export function blank(): void {
  normal(EMPTY)
}

export function okay(): void {
  success("Okay")
}

/**
 * Display a formatted commit message with proper syntax highlighting
 */
export function message(text: string): void {
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
