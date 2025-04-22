import {SPACE} from "./lib_char.js"
import type {StringMap, StringObject, StringReplacer} from "./lib_type.js"

export default {}

export function sorter_locale(lhs: string, rhs: string): number {
  return lhs.localeCompare(rhs)
}

export function replaces(str: string, replacer: StringReplacer | null): string {
  return replacer ? replacer(str) : str
}

export function replace_all(str: string, search: string, replacement: string): string {
  return str.split(search).join(replacement)
}

export function map_to_object(map: StringMap): StringObject {
  const obj: StringObject = {} as StringObject

  for (const [key, value] of map.entries()) {
    obj[key] = value
  }

  return obj
}

export function center_pad(text: string, width: number, pad_char = SPACE): string {
  if (text.length >= width) {
    return text
  }

  const total_pad = width - text.length
  const left_pad = Math.floor(total_pad / 2)
  const right_pad = total_pad - left_pad

  return pad_char.repeat(left_pad) + text + pad_char.repeat(right_pad)
}
