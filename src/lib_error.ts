import * as lib_abort from "./lib_abort.js"

export default {}

export function error_ignore(_error: Error): void {
  /* intentionally left empty */
}

export function error_console(error: Error): void {
  console.error(error)
}

export function error_get_text(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error)
}

export function error_abort(error: Error): void {
  const message = `Unhandled error: ${error_get_text(error)}`
  lib_abort.abort_with_error(message)
}
