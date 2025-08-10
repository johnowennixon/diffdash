import {EMPTY} from "./lib_char_empty.js"
import {DASH} from "./lib_char_punctuation.js"

function tui_none_generic(str: string | number | null | undefined, replacement: string): string {
  if (str === undefined || str === null || str === EMPTY) {
    return replacement
  }

  return str.toString()
}

export function tui_none_blank(str: string | number | null | undefined): string {
  return tui_none_generic(str, EMPTY)
}

export function tui_none_dash(str: string | number | null | undefined): string {
  return tui_none_generic(str, DASH)
}
