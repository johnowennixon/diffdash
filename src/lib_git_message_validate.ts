import {EMPTY} from "./lib_char.js"

export default {}

const DEFAULT_MIN_LENGTH = 10
const DEFAULT_MAX_LENGTH = 4000

export interface MessageValidationOptions {
  min_length?: number
  max_length?: number
}

export interface MessageValidationResult {
  valid: boolean
  reason?: string
  suggested_fix?: string
}

/**
 * Validate a commit message
 */
export function validate_message(message: string, options?: MessageValidationOptions): MessageValidationResult {
  const min_length = options?.min_length ?? DEFAULT_MIN_LENGTH
  const max_length = options?.max_length ?? DEFAULT_MAX_LENGTH

  // Check for empty message
  if (!message || message.trim() === EMPTY) {
    return {
      valid: false,
      reason: "Empty commit message",
    }
  }

  // Check if message is too short
  if (message.trim().length < min_length) {
    return {
      valid: false,
      reason: `Commit message is too short (minimum ${min_length} characters)`,
      suggested_fix: "Update with changes from staging area",
    }
  }

  // Check if message is too long
  if (message.length > max_length) {
    return {
      valid: false,
      reason: `Commit message is too long (maximum ${max_length} characters)`,
      suggested_fix: message.slice(0, max_length),
    }
  }

  // Check for formatting issues (e.g., missing summary line or empty line after summary)
  const lines = message.trim().split("\n")
  if (lines.length > 1 && lines[1] && lines[1].trim() !== EMPTY) {
    // There should be a blank line after the summary
    const first_line = lines[0] || ""
    const rest = lines.slice(1).join("\n")
    return {
      valid: false,
      reason: "Missing blank line after summary",
      suggested_fix: `${first_line}\n\n${rest}`,
    }
  }

  // The message is valid
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
  replacement: string | undefined
}

export function validate_git_message(message: string): GitMessageValidation {
  const result = validate_message(message)

  return {
    is_valid: result.valid,
    message: result.reason || "Valid commit message",
    original: message,
    replacement: result.suggested_fix,
  }
}
