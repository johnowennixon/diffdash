import * as lib_ansi from "./lib_ansi.js"
import * as lib_stdio from "./lib_stdio.js"

export default {}

export function abort_exit(): never {
  process.exit(1)
}

export function abort_with_warning(message: string): never {
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)

  lib_stdio.write_stderr_linefeed(lib_ansi.ansi_yellow(message))

  abort_exit()
}

export function abort_with_error(message: string): never {
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)

  lib_stdio.write_stderr_linefeed(lib_ansi.ansi_red(message))

  abort_exit()
}
