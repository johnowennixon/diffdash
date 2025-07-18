import JSON5 from "json5"

export function json5_parse(text: string): unknown {
  return JSON5.parse(text)
}
