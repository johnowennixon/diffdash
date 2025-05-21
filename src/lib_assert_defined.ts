import * as lib_abort from "./lib_abort.js"

export default {}

export function is_defined<T>(value: T | undefined): T {
  if (value !== undefined) {
    return value
  }

  console.error(value)
  return lib_abort.with_error("Assertion failed: value is undefined")
}
