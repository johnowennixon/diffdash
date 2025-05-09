import {ASTERISK, DASH, EMPTY, LF, SPACE} from "./lib_char.js"

export default {}

const DEFAULT_MIN_LENGTH = 40
const DEFAULT_MAX_LENGTH = 4000

type GitMessageValidationSucceeded = {
  valid: true
  reason?: never
}

type GitMessageValidationFailed = {
  valid: false
  reason: string
}

export type GitMessageValidationResult = GitMessageValidationSucceeded | GitMessageValidationFailed

export function validate_message(message: string): GitMessageValidationResult {
  const min_length = DEFAULT_MIN_LENGTH
  const max_length = DEFAULT_MAX_LENGTH

  // Check for empty message
  if (!message || message.trim() === EMPTY) {
    return {
      valid: false,
      reason: "message is empty",
    }
  }

  // Check if message is too short
  if (message.length < min_length) {
    return {
      valid: false,
      reason: `too short (minimum ${min_length} characters)`,
    }
  }

  // Check if message is too long
  if (message.length > max_length) {
    return {
      valid: false,
      reason: `too long (maximum ${max_length} characters)`,
    }
  }

  // Check for missing blank line after summary
  const lines = message.trim().split(LF)

  if (lines.length < 3) {
    return {
      valid: false,
      reason: "need at least 3 lines",
    }
  }

  // Check for missing blank line after summary
  if (lines[1] && lines[1] !== EMPTY) {
    return {
      valid: false,
      reason: "missing blank line after summary line",
    }
  }

  // Check for bullet points
  for (const line of lines.slice(2)) {
    if (!line.startsWith(DASH + SPACE) || !line.startsWith(ASTERISK + SPACE)) {
      return {
        valid: false,
        reason: "bullet points are malformed",
      }
    }
  }

  // Valid
  return {
    valid: true,
  }
}
