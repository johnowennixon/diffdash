import fs from "node:fs"

import {LF} from "./lib_char.js"

export default {}

export function get_tty_available_stdout(): boolean {
  return process.stdout.isTTY === true
}

export function get_tty_available_stderr(): boolean {
  return process.stderr.isTTY === true
}

export function get_tty_columns_stdout(): number | undefined {
  return process.stdout.columns
}

export function get_tty_columns_stderr(): number | undefined {
  return process.stderr.columns
}

export function write_stdout(message: string): void {
  fs.writeSync(1, message)
}

export function write_stdout_linefeed(message: string): void {
  write_stdout(message + LF)
}

export function write_stderr(message: string): void {
  fs.writeSync(2, message)
}

export function write_stderr_linefeed(message: string): void {
  write_stderr(message + LF)
}
