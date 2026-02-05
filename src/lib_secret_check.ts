import {anyOf, createRegExp, digit, exactly, global, letter, oneOrMore, wordChar} from "magic-regexp"

import {ansi_yellow} from "./lib_ansi.js"
import {DASH} from "./lib_char_punctuation.js"
import {text_split_lines} from "./lib_text.js"
import {tui_confirm} from "./lib_tui_confirm.js"
import {tui_quote_smart_single as qss} from "./lib_tui_quote.js"

const regexp_word_global = createRegExp(oneOrMore(anyOf(wordChar, exactly(DASH))), [global])

const regexp_segment_global = createRegExp(oneOrMore(anyOf(letter, digit)), [global])

const regexp_identifier_exactly = createRegExp(
  anyOf(
    // Only letters (no digits)
    oneOrMore(letter),
    // Digits at the end
    oneOrMore(letter).and(oneOrMore(digit)),
    // Digits in the middle (letters before and after)
    oneOrMore(letter)
      .and(oneOrMore(digit))
      .and(oneOrMore(letter)),
    // Only digits (no letters)
    oneOrMore(digit),
  )
    .at.lineStart()
    .at.lineEnd(),
)

function is_secret_line(line: string): boolean {
  if (line.endsWith(" # secret") || line.endsWith(" // secret")) {
    return true
  }

  return false
}

const NOT_SECRET_LINE_INCLUDES: Array<string> = ["http://", "https://"]

function is_not_secret_line(line: string): boolean {
  if (line.endsWith(" not secret")) {
    return true
  }

  for (const not_secret_line_include of NOT_SECRET_LINE_INCLUDES) {
    if (line.includes(not_secret_line_include)) {
      return true
    }
  }

  return false
}

const SECRET_WORD_REGEXPS: Array<RegExp> = [
  /^ghp_[A-Za-z0-9]{30}/, // GitHub Personal Access Token
  /^glpat-[A-Za-z0-9]{20}/, // GitLab Personal Access Token
  /^sk-[A-Za-z0-9-]{30}/, // Secret Key
  /^sk_[A-Za-z0-9]{30}/, // Secret Key
  /^sk_test_[A-Za-z0-9]{30}/, // Secret Key (test)
  /^whsec_[A-Za-z0-9]{30}/, // WebHook Secret key
  /^xox[a-z]-[A-Za-z0-9-]{27}/, // Slack Access Token
]

function is_secret_word(word: string): boolean {
  for (const secret_word_regexp of SECRET_WORD_REGEXPS) {
    if (secret_word_regexp.test(word)) {
      return true
    }
  }

  return false
}

async function is_secret_segment(
  segment: string,
  not_secret_segments: Set<string>,
  interactive: boolean,
): Promise<boolean> {
  if (not_secret_segments.has(segment)) {
    return false
  }

  if (regexp_identifier_exactly.test(segment)) {
    return false
  }

  if (segment.length < 20) {
    return false
  }

  if (interactive) {
    const confirmed_is_secret = await tui_confirm({
      question: `Is ${qss(segment)} a secret?`,
      default: false,
      style_message: ansi_yellow,
    })

    if (!confirmed_is_secret) {
      not_secret_segments.add(segment)
      return false
    }
  }

  return true
}

export async function secret_check({text, interactive}: {text: string; interactive: boolean}): Promise<void> {
  const not_secret_segments: Set<string> = new Set()

  const lines = text_split_lines(text)

  for (const line of lines.toReversed()) {
    if (is_secret_line(line)) {
      throw new Error(`Secret detected: ${qss(line.trim())}`)
    }

    const words = line.match(regexp_word_global)
    const segments = line.match(regexp_segment_global)

    if (!words || !segments) {
      continue
    }

    if (is_not_secret_line(line)) {
      for (const segment of segments) {
        not_secret_segments.add(segment)
      }
      continue
    }

    for (const word of words) {
      if (is_secret_word(word)) {
        throw new Error(`Secret detected: ${qss(word)}`)
      }
    }

    for (const segment of segments) {
      if (await is_secret_segment(segment, not_secret_segments, interactive)) {
        throw new Error(`Secret detected: ${qss(segment)}`)
      }
    }
  }
}
