import {EMPTY} from "./lib_char.js"

export default {}

export function parse_int_or_undefined(input: string | undefined): number | undefined {
  return input === undefined || input === EMPTY ? undefined : Number.parseInt(input)
}

export function parse_float_or_undefined(input: string | undefined): number | undefined {
  return input === undefined || input === EMPTY ? undefined : Number.parseFloat(input)
}
