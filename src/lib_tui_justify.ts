import {DIGIT_0} from "./lib_char_digit.js"
import {SPACE} from "./lib_char_punctuation.js"
import {tui_truncate_ellipsis, tui_truncate_plain} from "./lib_tui_truncate.js"

export function tui_justify_left(n: number, s: string, ellipsis = false, truncate = false): string {
  let justified = s

  if (ellipsis) {
    justified = tui_truncate_ellipsis(n, justified)
  }

  if (truncate) {
    justified = tui_truncate_plain(n, justified)
  }

  justified = justified.padEnd(n)

  return justified
}

export function tui_justify_right(n: number, s: string): string {
  return s.padStart(n)
}

export function tui_justify_centre({
  line,
  width,
  pad_char = SPACE,
}: {
  line: string
  width: number
  pad_char?: string
}): string {
  if (line.length >= width) {
    return line
  }

  const total_pad = width - line.length
  const left_pad = Math.floor(total_pad / 2)
  const right_pad = total_pad - left_pad

  return pad_char.repeat(left_pad) + line + pad_char.repeat(right_pad)
}

export function tui_justify_zero(n: number, s: string): string {
  return s.padStart(n, DIGIT_0)
}
