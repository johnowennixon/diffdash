import * as lib_ansi from "./lib_ansi.js"
import type {AnsiColourizer} from "./lib_ansi.js"
import {EMPTY, LF, SPACE} from "./lib_char.js"
import * as lib_datetime from "./lib_datetime.js"
import * as lib_enabled from "./lib_enabled.js"
import * as lib_stdio from "./lib_stdio.js"

export default {}

export const enables = {
  timestamp: lib_enabled.enabled_from_env("TELL_TIMESTAMP"),
  okay: lib_enabled.enabled_from_env("TELL_OKAY", {default: true}),
}

export type TellParams = {
  silent?: boolean
  message: string
}

export type Teller = (message: string) => void
export type TellerPromise = (message: string) => Promise<void>

function tell_generic({message, colourizer}: {message: string; colourizer?: AnsiColourizer}): void {
  while (message.endsWith(LF)) {
    message = message.slice(0, -1)
  }

  let text = EMPTY

  if (enables.timestamp) {
    const now_local_ymdthms = lib_datetime.datetime_format_local_iso_ymdthms(lib_datetime.datetime_now())
    text += lib_ansi.ansi_grey(now_local_ymdthms)
    text += SPACE
  }

  if (colourizer) {
    text += colourizer(message)
  }

  lib_stdio.write_stderr_linefeed(text)
}

export function tell_nowhere(_message: string): void {
  // intentionally empty
}

export function tell_plain(message: string): void {
  tell_generic({message, colourizer: lib_ansi.ansi_normal})
}

export function tell_error(message: string): void {
  tell_generic({message, colourizer: lib_ansi.ansi_red})
}

export function tell_warning(message: string): void {
  tell_generic({message, colourizer: lib_ansi.ansi_yellow})
}

export function tell_success(message: string): void {
  tell_generic({message, colourizer: lib_ansi.ansi_green})
}

export function tell_info(message: string): void {
  tell_generic({message, colourizer: lib_ansi.ansi_cyan})
}

export function tell_action(message: string): void {
  tell_generic({message, colourizer: lib_ansi.ansi_magenta})
}

export function tell_debug(message: string): void {
  tell_generic({message, colourizer: lib_ansi.ansi_grey})
}

export function tell_blank(): void {
  tell_plain(EMPTY)
}

export function tell_okay(): void {
  if (enables.okay) {
    tell_success("Okay")
  }
}
