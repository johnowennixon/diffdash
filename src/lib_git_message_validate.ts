import {EMPTY, LF} from "./lib_char.js"

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
      reason: "Commit message is empty",
    }
  }

  // Check if message is too short
  if (message.length < min_length) {
    return {
      valid: false,
      reason: `Commit message is too short (minimum ${min_length} characters)`,
    }
  }

  // Check if message is too long
  if (message.length > max_length) {
    return {
      valid: false,
      reason: `Commit message is too long (maximum ${max_length} characters)`,
    }
  }

  // Check for missing blank line after summary
  const lines = message.split(LF)

  if (lines.length < 3) {
    return {
      valid: false,
      reason: "Commit message needs to be at least 3 lines",
    }
  }

  // Check for missing blank line after summary
  if (lines[1] && lines[1] !== EMPTY) {
    return {
      valid: false,
      reason: "Missing blank line after summary",
    }
  }

  // Valid
  return {
    valid: true,
  }
}

/**
 * Legacy validation function for backward compatibility
 */
export interface GitMessageValidation {
  is_valid: boolean
  message: string
  original: string
  replacement?: string
}

export function validate_git_message(message: string): GitMessageValidation {
  const result = validate_message(message)

  return {
    is_valid: result.valid,
    message: result.reason || "Valid commit message",
    original: message,
  }
}
