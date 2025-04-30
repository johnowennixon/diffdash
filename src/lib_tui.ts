import {
  BACKSLASH,
  BS,
  COMMA,
  CR,
  DASH,
  DIGIT_0,
  DOT,
  ELLIPSIS,
  EMPTY,
  FF,
  LEFT_DOUBLE_QUOTATION_MARK,
  LEFT_SINGLE_QUOTATION_MARK,
  LF,
  QUOTE_DOUBLE,
  QUOTE_SINGLE,
  RIGHT_DOUBLE_QUOTATION_MARK,
  RIGHT_SINGLE_QUOTATION_MARK,
  ROUND_LEFT,
  ROUND_RIGHT,
  SPACE,
  TAB,
  VT,
} from "./lib_char.js"

export default {}

export function bracket_round(s: string): string {
  return ROUND_LEFT + s + ROUND_RIGHT
}

export function quote_plain_double(s: string): string {
  return QUOTE_DOUBLE + s + QUOTE_DOUBLE
}

export function quote_plain_single(s: string): string {
  return QUOTE_SINGLE + s + QUOTE_SINGLE
}

export function quote_smart_double(s: string): string {
  return LEFT_DOUBLE_QUOTATION_MARK + s + RIGHT_DOUBLE_QUOTATION_MARK
}

export function quote_smart_single(s: string): string {
  return LEFT_SINGLE_QUOTATION_MARK + s + RIGHT_SINGLE_QUOTATION_MARK
}

export function none_dash(s: string | number | null | undefined): string {
  if (s === undefined || s === null || s === EMPTY) {
    return DASH
  }

  return s.toString()
}

export function spaces(n: number): string {
  return EMPTY.padEnd(n)
}

export function truncate_plain(n: number, s: string, truncate = true): string {
  return truncate ? s.slice(0, n) : s
}

export function truncate_ellipsis(n: number | undefined, s: string, truncate = true): string {
  if (n === undefined || !truncate) {
    return s.slice()
  }

  if (s.length <= n) {
    return s.slice()
  }

  return s.slice(0, n - 2) + SPACE + ELLIPSIS
}

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

export function justify_zero(n: number, s: string): string {
  return s.padStart(n, DIGIT_0)
}

export function integer_commas(n: number): string {
  return Math.round(n).toLocaleString()
}

export function money_format(value: number): string {
  const rounded = Math.round(value * 100)

  const units = Math.floor(rounded / 100)
  const cents = rounded % 100

  return integer_commas(units) + DOT + justify_zero(2, cents.toString())
}

function to_readable_char(c: string): string {
  switch (c) {
    case BACKSLASH:
      return BACKSLASH + BACKSLASH

    case BS:
      return BACKSLASH + "b"

    case CR:
      return BACKSLASH + "r"

    case FF:
      return BACKSLASH + "f"

    case LF:
      return BACKSLASH + "n"

    case TAB:
      return BACKSLASH + "t"

    case VT:
      return BACKSLASH + "v"

    default:
      break
  }

  switch (c) {
    case LEFT_DOUBLE_QUOTATION_MARK:
    case LEFT_SINGLE_QUOTATION_MARK:
    case RIGHT_DOUBLE_QUOTATION_MARK:
    case RIGHT_SINGLE_QUOTATION_MARK:
      return c

    default:
      break
  }

  const code = c.charCodeAt(0)

  if (code >= 32 && code <= 126) {
    return c
  }

  return BACKSLASH + "u" + justify_zero(4, code.toString(16))
}

export function to_readable(s: string): string {
  let readable = EMPTY

  for (const c of s) {
    readable += to_readable_char(c)
  }

  return readable
}

export function string_array_comma_separated(s: Array<string>): string {
  return s.length > 0 ? s.join(COMMA + SPACE) : DASH
}
