import {EMPTY} from "./lib_char_empty.js"

export function parse_int(input: string): number {
  return Number.parseInt(input, 10)
}

export function parse_float(input: string): number {
  return Number.parseFloat(input)
}

export function parse_int_or_undefined(input: string | undefined | null): number | undefined {
  return input === undefined || input === null || input === EMPTY ? undefined : parse_int(input)
}

export function parse_float_or_undefined(input: string | undefined | null): number | undefined {
  return input === undefined || input === null || input === EMPTY ? undefined : parse_float(input)
}
