import * as lib_abort from "./lib_abort.js"
import * as lib_type_guard from "./lib_type_guard.js"

export default {}

export function assert(expected: boolean, message: string): void {
  if (!expected) {
    lib_abort.with_error(message)
  }
}

export function not_undefined<T>(value: T | undefined): T {
  if (value !== undefined) {
    return value
  }

  console.error(value)
  return lib_abort.with_error("Assertion failed: value is undefined")
}

export function is_boolean(value: unknown): boolean {
  if (lib_type_guard.is_boolean(value)) {
    return value
  }

  console.error(value)
  return lib_abort.with_error("Assertion failed: value is not a boolean")
}

export function is_number(value: unknown): number {
  if (lib_type_guard.is_number(value)) {
    return value
  }

  console.error(value)
  return lib_abort.with_error("Assertion failed: value is not a number")
}

export function is_string(value: unknown): string {
  if (lib_type_guard.is_string(value)) {
    return value
  }

  console.error(value)
  return lib_abort.with_error("Assertion failed: value is not a string")
}

export function is_object(value: unknown): Record<string, unknown> {
  if (lib_type_guard.is_object(value)) {
    return value
  }

  console.error(value)
  return lib_abort.with_error("Assertion failed: value is not an object")
}
