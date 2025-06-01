import {abort_with_error} from "./lib_abort.js"
import {LF} from "./lib_char_control.js"
import {EMPTY} from "./lib_char_empty.js"
import {ASTERISK, DASH, SPACE} from "./lib_char_punctuation.js"
import {git_message_display} from "./lib_git_message_ui.js"
import {tell_warning} from "./lib_tell.js"

export default {}

const DEFAULT_MIN_LENGTH = 40
const DEFAULT_MAX_LENGTH = 4000

type GitMessageValidateSucceeded = {
  valid: true
  reason?: never
}

type GitMessageValidateFailed = {
  valid: false
  reason: string
}

export type GitMessageValidateResult = GitMessageValidateSucceeded | GitMessageValidateFailed

export function git_message_validate_get_result(git_message: string): GitMessageValidateResult {
  const min_length = DEFAULT_MIN_LENGTH
  const max_length = DEFAULT_MAX_LENGTH

  // Check for empty message
  if (!git_message || git_message.trim() === EMPTY) {
    return {
      valid: false,
      reason: "message is empty",
    }
  }

  // Check if message is too short
  if (git_message.length < min_length) {
    return {
      valid: false,
      reason: `too short (minimum ${min_length} characters)`,
    }
  }

  // Check if message is too long
  if (git_message.length > max_length) {
    return {
      valid: false,
      reason: `too long (maximum ${max_length} characters)`,
    }
  }

  // Check that there is at least one bullet point
  const lines = git_message.trim().split(LF)

  if (lines.length < 3) {
    return {
      valid: false,
      reason: "need at least 3 lines",
    }
  }

  // Check for missing blank line after summary
  if (lines[1] && lines[1].trim() !== EMPTY) {
    return {
      valid: false,
      reason: "missing blank line after summary line",
    }
  }

  // Check for bullet points
  for (const line of lines.slice(2)) {
    if (!line.startsWith(DASH + SPACE) && !line.startsWith(ASTERISK + SPACE)) {
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

export function git_message_validate_check(git_message: string): void {
  const validation_result = git_message_validate_get_result(git_message)

  if (!validation_result.valid) {
    git_message_display({git_message, teller: tell_warning})

    abort_with_error(`Generated commit message failed validation: ${validation_result.reason}`)
  }
}
