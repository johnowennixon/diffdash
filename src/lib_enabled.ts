import {DIGIT_0, DIGIT_1} from "./lib_char.js"

export default {}

export function enabled_from_string(value: string | undefined | null, options?: {default?: boolean}): boolean {
  const fallback = options?.default ?? false

  if (value === undefined || value === null) {
    return fallback
  }

  if (value === DIGIT_0) {
    return false
  }
  if (value === DIGIT_1) {
    return true
  }

  const upper = value.toUpperCase()

  if (upper === "FALSE") {
    return false
  }
  if (upper === "TRUE") {
    return true
  }

  if (upper === "DISABLED") {
    return false
  }
  if (upper === "ENABLED") {
    return true
  }

  return fallback
}

export function enabled_from_env(key: string, options?: {default?: boolean}): boolean {
  return enabled_from_string(process.env[key], options)
}
