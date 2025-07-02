import {BOX_DRAWINGS_LIGHT_HORIZONTAL} from "./lib_char_box.js"
import {SPACE} from "./lib_char_punctuation.js"
import type {TellSync} from "./lib_tell.js"
import {tui_justify_centre} from "./lib_tui_justify.js"

export function tui_block_string({
  teller,
  content,
  title,
  pad_char = BOX_DRAWINGS_LIGHT_HORIZONTAL,
  fallback_width = 80,
}: {
  teller: TellSync
  content: string
  title?: string
  pad_char?: string
  fallback_width?: number
}): void {
  const width = process.stdout.isTTY ? process.stdout.columns : fallback_width

  const separator = pad_char.repeat(width)

  const top_line = title ? tui_justify_centre({line: SPACE + title + SPACE, width, pad_char}) : separator

  teller(top_line)
  teller(content)
  teller(separator)
}
