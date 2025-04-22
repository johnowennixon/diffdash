import * as lib_abort from "./lib_abort.js"

export default {}

export function get_first<T>(array: Array<T>): T {
  if (array.length === 0) {
    return lib_abort.abort("Array length is zero")
  }

  // biome-ignore lint/style/noNonNullAssertion: already checked
  return array[0]!
}

export function get_last<T>(array: Array<T>): T {
  if (array.length === 0) {
    return lib_abort.abort("Array length is zero")
  }

  // biome-ignore lint/style/noNonNullAssertion: already checked
  return array.at(-1)!
}

export function get_length_one<T>(array: Array<T>): T {
  if (array.length !== 1) {
    return lib_abort.abort("Array length is not exactly one")
  }

  // biome-ignore lint/style/noNonNullAssertion: already checked
  return array[0]!
}

export function get_index<T>(array: Array<T>, index: number): T {
  if (index < 0 || index >= array.length) {
    return lib_abort.abort("Array index is not in range")
  }

  // biome-ignore lint/style/noNonNullAssertion: already checked
  return array[index]!
}
