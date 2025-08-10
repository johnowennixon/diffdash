import {EMPTY} from "./lib_char_empty.js"
import {DOT} from "./lib_char_punctuation.js"
import {tui_justify_left, tui_justify_zero} from "./lib_tui_justify.js"

export function tui_number_plain({
  num,
  justify_left,
  justify_right,
}: {
  num: number | null | undefined
  justify_left?: number | undefined
  justify_right?: number | undefined
}): string {
  let str = num === null || num === undefined ? EMPTY : num.toString()

  if (justify_left !== undefined) {
    str = tui_justify_left(justify_left, str)
  }

  if (justify_right !== undefined) {
    str = tui_justify_left(justify_right, str)
  }

  return str
}

export function tui_number_integer_commas(n: number): string {
  return Math.round(n).toLocaleString()
}

export function tui_number_money_format(value: number): string {
  const rounded = Math.round(value * 100)

  const units = Math.floor(rounded / 100)
  const cents = rounded % 100

  return tui_number_integer_commas(units) + DOT + tui_justify_zero(2, cents.toString())
}
