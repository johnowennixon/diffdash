import {ansi_red, ansi_yellow} from "./lib_ansi.js"
import {write_stderr_linefeed} from "./lib_stdio.js"

export default {}

export function abort_exit(): never {
  process.exit(1)
}

export function abort_with_warning(message: string): never {
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)

  write_stderr_linefeed(ansi_yellow(message))

  abort_exit()
}

export function abort_with_error(message: string): never {
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)

  write_stderr_linefeed(ansi_red(message))

  abort_exit()
}
