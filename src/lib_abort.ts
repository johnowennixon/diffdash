import {ansi_red, ansi_yellow} from "./lib_ansi.js"
import {stdio_write_stderr_linefeed} from "./lib_stdio_write.js"

export function abort_exit(exitcode = 1): never {
  process.exit(exitcode)
}

export function abort_with_warning(message: string): never {
  if (process.stdout.isTTY) {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
  }

  stdio_write_stderr_linefeed(ansi_yellow(message))

  abort_exit()
}

export function abort_with_error(message: string): never {
  if (process.stdout.isTTY) {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
  }

  stdio_write_stderr_linefeed(ansi_red(message))

  abort_exit()
}
