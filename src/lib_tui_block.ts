import {EQUALS, SPACE} from "./lib_char_punctuation.js"
import type {TellSync} from "./lib_tell.js"
import {tui_justify_centre} from "./lib_tui_justify.js"

export function tui_block_string({
  teller,
  content,
  title,
  pad_char = EQUALS,
  width = 120,
}: {teller: TellSync; content: string; title?: string; pad_char?: string; width?: number}): void {
  const separator = pad_char.repeat(width)

  const top_line = title ? tui_justify_centre({line: SPACE + title + SPACE, width, pad_char}) : separator

  teller(top_line)
  teller(content)
  teller(separator)
}
