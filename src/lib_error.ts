import {abort_with_error} from "./lib_abort.js"
import {LF} from "./lib_char_control.js"

export function error_ignore(_error: Error): void {
  /* intentionally left empty */
}

export function error_console(error: Error): void {
  console.error(error)
}

export function error_get_text(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error)
}

export function error_get_message(error: unknown): string {
  const message_perhaps_multiline =
    error instanceof Error
      ? error.name === "Error"
        ? error.message
        : `${error.name}: ${error.message}`
      : String(error)

  return message_perhaps_multiline.split(LF)[0] || "Blank Error"
}

export function error_abort(error: Error): void {
  const message_perhaps_multiline = `Unhandled error: ${error_get_text(error)}`

  abort_with_error(message_perhaps_multiline)
}
