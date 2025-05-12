import * as lib_abort from "./lib_abort.js"

export default {}

export function ignore(_err: Error): void {
  /* intentionally left empty */
}

export function log(err: Error): void {
  console.error(err)
}

export function abort(err: Error): void {
  const message = `Unhandled error: ${err instanceof Error ? err.message : String(err)}`
  lib_abort.with_error(message)
}
