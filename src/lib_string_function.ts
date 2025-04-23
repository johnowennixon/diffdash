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
