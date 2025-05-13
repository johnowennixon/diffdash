import {DIGIT_0, SPACE} from "./lib_char.js"
import {truncate_ellipsis, truncate_plain} from "./lib_tui_truncate.js"

export default {}

export function justify_left(n: number, s: string, ellipsis = false, truncate = false): string {
  let justified = s

  if (ellipsis) {
    justified = truncate_ellipsis(n, justified)
  }

  if (truncate) {
    justified = truncate_plain(n, justified)
  }

  justified = justified.padEnd(n)

  return justified
}

export function justify_right(n: number, s: string): string {
  return s.padStart(n)
}

export function justify_centre({
  line,
  width,
  pad_char = SPACE,
}: {line: string; width: number; pad_char?: string}): string {
  if (line.length >= width) {
    return line
  }

  const total_pad = width - line.length
  const left_pad = Math.floor(total_pad / 2)
  const right_pad = total_pad - left_pad

  return pad_char.repeat(left_pad) + line + pad_char.repeat(right_pad)
}

export function justify_zero(n: number, s: string): string {
  return s.padStart(n, DIGIT_0)
}
