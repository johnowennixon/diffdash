import {EQUALS, SPACE} from "./lib_char.js"
import type {Teller} from "./lib_tell.js"
import * as lib_tui_justify from "./lib_tui_justify.js"

export default {}

export function tui_block_string({
  teller,
  content,
  title,
  pad_char = EQUALS,
  width = 120,
}: {teller: Teller; content: string; title?: string; pad_char?: string; width?: number}): void {
  const separator = pad_char.repeat(width)

  const top_line = title
    ? lib_tui_justify.tui_justify_centre({line: SPACE + title + SPACE, width, pad_char})
    : separator

  teller(top_line)
  teller(content)
  teller(separator)
}
