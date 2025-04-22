import * as lib_ansi from "./lib_ansi.js"
import * as lib_stdio from "./lib_stdio.js"

export default {}

export function exit(): never {
  process.exit(1)
}

export function abort(message: string): never {
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)

  lib_stdio.write_stderr_linefeed(lib_ansi.red(message))

  exit()
}
