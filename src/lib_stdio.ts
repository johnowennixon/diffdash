import fs from "node:fs"

import {LF} from "./lib_char.js"

export default {}

export function stdio_tty_get_available_stdout(): boolean {
  return process.stdout.isTTY === true
}

export function stdio_tty_get_available_stderr(): boolean {
  return process.stderr.isTTY === true
}

export function stdio_tty_get_columns_stdout(): number | undefined {
  return process.stdout.columns
}

export function stdio_tty_get_columns_stderr(): number | undefined {
  return process.stderr.columns
}

export function stdio_write_stdout(message: string): void {
  fs.writeSync(1, message)
}

export function stdio_write_stdout_linefeed(message: string): void {
  stdio_write_stdout(message + LF)
}

export function stdio_write_stderr(message: string): void {
  fs.writeSync(2, message)
}

export function stdio_write_stderr_linefeed(message: string): void {
  stdio_write_stderr(message + LF)
}
