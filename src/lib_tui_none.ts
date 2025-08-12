import {EMPTY} from "./lib_char_empty.js"
import {DASH} from "./lib_char_punctuation.js"

// eslint-disable-next-line sonarjs/use-type-alias
function tui_none_generic({str, none}: {str: string | number | null | undefined; none: string}): string {
  return str === undefined || str === null || str === EMPTY ? none : str.toString()
}

export function tui_none_blank(str: string | number | null | undefined): string {
  return tui_none_generic({str, none: EMPTY})
}

export function tui_none_dash(str: string | number | null | undefined): string {
  return tui_none_generic({str, none: DASH})
}
