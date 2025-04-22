import * as lib_abort from "./lib_abort.js"
import {EMPTY} from "./lib_char.js"

export default {}

export type EnvRecord = Record<string, string>

export function get(key: string): string | null {
  return process.env[key] ?? null
}

export function get_substitute(key: string, substitute: string): string {
  return get(key) ?? substitute
}

export function get_empty(key: string): string {
  return get_substitute(key, EMPTY)
}

export function get_string(key: string): string | undefined {
  return process.env[key]
}

export function get_abort(key: string): string {
  return get(key) ?? lib_abort.abort(`Unable to find environment key: ${key}`)
}

export function set(key: string, value: string): void {
  process.env[key] = value
}
