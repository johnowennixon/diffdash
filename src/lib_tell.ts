import * as lib_ansi from "./lib_ansi.js"
import type {AnsiColourizer} from "./lib_ansi.js"
import {EMPTY, LF, SPACE} from "./lib_char.js"
import * as lib_datetime from "./lib_datetime.js"
import * as lib_enabled from "./lib_enabled.js"
import * as lib_stdio from "./lib_stdio.js"

export default {}

export const enables = {
  timestamp: lib_enabled.from_env("TELL_TIMESTAMP"),
}

export type TellParams = {
  silent?: boolean
  message: string
}

export type Teller = (message: string) => void
export type TellerPromise = (message: string) => Promise<void>

function generic({message, colourizer}: {message: string; colourizer?: AnsiColourizer}): void {
  while (message.endsWith(LF)) {
    message = message.slice(0, -1)
  }

  let text = EMPTY

  if (enables.timestamp) {
    const now_local_ymdthms = lib_datetime.format_local_iso_ymdthms(lib_datetime.now())
    text += lib_ansi.grey(now_local_ymdthms)
    text += SPACE
  }

  if (colourizer) {
    text += colourizer(message)
  }

  lib_stdio.write_stderr_linefeed(text)
}

export function nowhere(_message: string): void {
  // intentionally empty
}

export function plain(message: string): void {
  generic({message, colourizer: lib_ansi.normal})
}

export function error(message: string): void {
  generic({message, colourizer: lib_ansi.red})
}

export function warning(message: string): void {
  generic({message, colourizer: lib_ansi.yellow})
}

export function success(message: string): void {
  generic({message, colourizer: lib_ansi.green})
}

export function info(message: string): void {
  generic({message, colourizer: lib_ansi.cyan})
}

export function action(message: string): void {
  generic({message, colourizer: lib_ansi.magenta})
}

export function debug(message: string): void {
  generic({message, colourizer: lib_ansi.grey})
}

export function blank(): void {
  plain(EMPTY)
}

export function okay(): void {
  success("Okay")
}
