import * as lib_abort from "./lib_abort.js"

export default {}

export function ignore(_error: Error): void {
  /* intentionally left empty */
}

export function log(error: Error): void {
  console.error(error)
}

export function get_error_text(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error)
}

export function abort(error: Error): void {
  const message = `Unhandled error: ${get_error_text(error)}`
  lib_abort.with_error(message)
}
