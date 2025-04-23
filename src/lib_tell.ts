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

export type Teller = (message: string) => void
export type TellerPromise = (message: string) => Promise<void>

export const nowhere: Teller = (_message: string) => {
  // intentionally empty
}

function generic(message: string, colourizer: AnsiColourizer): void {
  while (message.endsWith(LF)) {
    message = message.slice(0, -1)
  }

  let text = EMPTY

  if (enables.timestamp) {
    const now_local_ymdthms = lib_datetime.format_local_iso_ymdthms(lib_datetime.now())
    text += lib_ansi.grey(now_local_ymdthms)
    text += SPACE
  }

  text += colourizer(message)

  lib_stdio.write_stderr_linefeed(text)
}

export const normal: Teller = (message: string): void => {
  generic(message, lib_ansi.normal)
}

export const error: Teller = (message: string): void => {
  generic(message, lib_ansi.red)
}

export const warning: Teller = (message: string): void => {
  generic(message, lib_ansi.yellow)
}

export const success: Teller = (message: string): void => {
  generic(message, lib_ansi.green)
}

export const info: Teller = (message: string): void => {
  generic(message, lib_ansi.cyan)
}

export const action: Teller = (message: string): void => {
  generic(message, lib_ansi.magenta)
}

export const debug: Teller = (message: string): void => {
  generic(message, lib_ansi.grey)
}

export function blank(): void {
  normal(EMPTY)
}

export function okay(): void {
  success("Okay")
}
