import {EQUALS, SPACE} from "./lib_char.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export function center_pad(text: string, width: number, pad_char = SPACE): string {
  if (text.length >= width) {
    return text
  }

  const total_pad = width - text.length
  const left_pad = Math.floor(total_pad / 2)
  const right_pad = total_pad - left_pad

  return pad_char.repeat(left_pad) + text + pad_char.repeat(right_pad)
}

export function string_block({content, title, width = 100}: {content: string; title?: string; width?: number}): void {
  const separator = EQUALS.repeat(width)

  const top_line = title ? center_pad(SPACE + title + SPACE, width, EQUALS) : separator

  lib_tell.debug(top_line)
  lib_tell.debug(content)
  lib_tell.debug(separator)
}
