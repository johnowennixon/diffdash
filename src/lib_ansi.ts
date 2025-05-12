import ansis from "ansis"

import {EMPTY} from "./lib_char.js"

export default {}

export type AnsiColourizer = (message: string) => string

export const normal: AnsiColourizer = (message: string): string => message

export const dim: AnsiColourizer = (message: string): string => ansis.dim(message)
export const bold: AnsiColourizer = (message: string): string => ansis.bold(message)
export const italic: AnsiColourizer = (message: string): string => ansis.italic(message)

export const red: AnsiColourizer = (message: string): string => ansis.redBright(message)
export const yellow: AnsiColourizer = (message: string): string => ansis.yellowBright(message)
export const green: AnsiColourizer = (message: string): string => ansis.greenBright(message)
export const cyan: AnsiColourizer = (message: string): string => ansis.cyanBright(message)
export const blue: AnsiColourizer = (message: string): string => ansis.blueBright(message)
export const magenta: AnsiColourizer = (message: string): string => ansis.magentaBright(message)
export const grey: AnsiColourizer = (message: string): string => ansis.gray(message)

export function colourizer_boolean(bool: boolean): AnsiColourizer {
  return bool ? green : red
}

export function strip(text: string): string {
  const pattern = String.raw`\u001B\[[^m]*m`
  // eslint-disable-next-line sonarjs/no-control-regex
  return text.replace(new RegExp(pattern, "g"), EMPTY)
}
