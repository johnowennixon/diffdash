import {DIGIT_1} from "./lib_char.js"

export default {}

export function from_string(value: string | undefined | null): boolean {
  if (value === undefined || value === null) {
    return false
  }

  if (value === DIGIT_1) {
    return true
  }

  const upper = value.toUpperCase()

  if (upper === "TRUE") {
    return true
  }

  if (upper === "ENABLED") {
    return true
  }

  return false
}

export function from_env(key: string): boolean {
  return from_string(process.env[key])
}
