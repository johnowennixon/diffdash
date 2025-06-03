import {abort_with_error} from "./lib_abort.js"
import {EMPTY} from "./lib_char_empty.js"

export const DOT_ENV = ".env"

export type EnvRecord = Record<string, string>

export function env_get(key: string): string | null {
  return process.env[key] ?? null
}

export function env_get_substitute(key: string, substitute: string): string {
  return env_get(key) ?? substitute
}

export function env_get_empty(key: string): string {
  return env_get_substitute(key, EMPTY)
}

export function env_get_abort(key: string): string {
  return env_get(key) ?? abort_with_error(`Unable to find environment key: ${key}`)
}

export function env_set(key: string, value: string): void {
  process.env[key] = value
}
