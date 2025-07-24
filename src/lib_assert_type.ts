import {abort_with_error} from "./lib_abort.js"
import {
  type_guard_is_boolean,
  type_guard_is_number,
  type_guard_is_object,
  type_guard_is_string,
} from "./lib_type_guard.js"

export function assert_type_boolean(value: unknown): boolean {
  if (type_guard_is_boolean(value)) {
    return value
  }

  console.error(value)
  return abort_with_error("Assertion failed: value is not a boolean")
}

export function assert_type_number(value: unknown): number {
  if (type_guard_is_number(value)) {
    return value
  }

  console.error(value)
  return abort_with_error("Assertion failed: value is not a number")
}

export function assert_type_string(value: unknown): string {
  if (type_guard_is_string(value)) {
    return value
  }

  console.error(value)
  return abort_with_error("Assertion failed: value is not a string")
}

export function assert_type_object(value: unknown): Record<string, unknown> {
  if (type_guard_is_object(value)) {
    return value
  }

  console.error(value)
  return abort_with_error("Assertion failed: value is not an object")
}
