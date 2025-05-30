import ansis from "ansis"

import {EMPTY} from "./lib_char.js"

export default {}

export type AnsiColourizer = (message: string) => string

export const ansi_normal: AnsiColourizer = (message: string): string => message

export const ansi_dim: AnsiColourizer = (message: string): string => ansis.dim(message)
export const ansi_bold: AnsiColourizer = (message: string): string => ansis.bold(message)
export const ansi_italic: AnsiColourizer = (message: string): string => ansis.italic(message)

export const ansi_red: AnsiColourizer = (message: string): string => ansis.redBright(message)
export const ansi_yellow: AnsiColourizer = (message: string): string => ansis.yellowBright(message)
export const ansi_green: AnsiColourizer = (message: string): string => ansis.greenBright(message)
export const ansi_cyan: AnsiColourizer = (message: string): string => ansis.cyanBright(message)
export const ansi_blue: AnsiColourizer = (message: string): string => ansis.blueBright(message)
export const ansi_magenta: AnsiColourizer = (message: string): string => ansis.magentaBright(message)
export const ansi_grey: AnsiColourizer = (message: string): string => ansis.gray(message)

export function ansi_boolean(bool: boolean): AnsiColourizer {
  return bool ? ansi_green : ansi_red
}

export function ansi_strip(text: string): string {
  const pattern = String.raw`\u001B\[[^m]*m`
  // eslint-disable-next-line sonarjs/no-control-regex
  return text.replace(new RegExp(pattern, "g"), EMPTY)
}
