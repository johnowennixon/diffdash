import {writeSync} from "node:fs"

import {LF} from "./lib_char_control.js"

export default {}

export function stdio_write_stdout(message: string): void {
  writeSync(1, message)
}

export function stdio_write_stdout_linefeed(message: string): void {
  stdio_write_stdout(message + LF)
}

export function stdio_write_stderr(message: string): void {
  writeSync(2, message)
}

export function stdio_write_stderr_linefeed(message: string): void {
  stdio_write_stderr(message + LF)
}
