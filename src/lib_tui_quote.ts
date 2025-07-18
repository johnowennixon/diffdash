import {
  BACKTICK,
  LESS_THAN,
  MORE_THAN,
  QUOTE_DOUBLE,
  QUOTE_SINGLE,
  ROUND_LEFT,
  ROUND_RIGHT,
  SQUARE_LEFT,
  SQUARE_RIGHT,
} from "./lib_char_punctuation.js"
import {
  LEFT_DOUBLE_QUOTATION_MARK,
  LEFT_SINGLE_QUOTATION_MARK,
  RIGHT_DOUBLE_QUOTATION_MARK,
  RIGHT_SINGLE_QUOTATION_MARK,
} from "./lib_char_smart.js"

export function tui_quote_plain_double(s: string): string {
  return QUOTE_DOUBLE + s + QUOTE_DOUBLE
}

export function tui_quote_plain_single(s: string): string {
  return QUOTE_SINGLE + s + QUOTE_SINGLE
}

export function tui_quote_smart_double(s: string): string {
  return LEFT_DOUBLE_QUOTATION_MARK + s + RIGHT_DOUBLE_QUOTATION_MARK
}

export function tui_quote_smart_single(s: string): string {
  return LEFT_SINGLE_QUOTATION_MARK + s + RIGHT_SINGLE_QUOTATION_MARK
}

export function tui_quote_bracket_round(s: string): string {
  return ROUND_LEFT + s + ROUND_RIGHT
}

export function tui_quote_bracket_square(s: string): string {
  return SQUARE_LEFT + s + SQUARE_RIGHT
}

export function tui_quote_bracket_angle(s: string): string {
  return LESS_THAN + s + MORE_THAN
}

export function tui_quote_backtick(s: string): string {
  return BACKTICK + s + BACKTICK
}
