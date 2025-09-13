import {LF} from "./lib_char_control.js"
import {EMPTY} from "./lib_char_empty.js"

export function text_split_lines(text: string): Array<string> {
  const lines = text.split(/\r?\n/)

  if (lines.length > 0) {
    const last_line = lines.at(-1)

    if (last_line === EMPTY) {
      return lines.slice(0, -1)
    }
  }

  return lines
}

export function text_join_lines(lines: Array<string>): string {
  return lines.length > 0 ? lines.join(LF) + LF : EMPTY
}

function text_lines_matching_generic(text: string, pattern: string, remove: boolean): string {
  const regex = new RegExp(pattern)

  const lines = text_split_lines(text)

  const new_lines: Array<string> = []

  for (const line of lines) {
    const found = regex.test(line)
    if (found !== remove) {
      new_lines.push(line)
    }
  }

  return text_join_lines(new_lines)
}

export function text_lines_matching_only(text: string, pattern: string): string {
  return text_lines_matching_generic(text, pattern, false)
}

export function text_lines_matching_remove(text: string, pattern: string): string {
  return text_lines_matching_generic(text, pattern, true)
}

export function text_get_head(text: string, lines: number): string {
  return text_join_lines(text_split_lines(text).slice(0, lines))
}

export function text_get_tail(text: string, lines: number): string {
  return text_join_lines(text_split_lines(text).slice(-lines))
}
