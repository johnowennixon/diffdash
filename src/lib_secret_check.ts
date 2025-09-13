import {anyOf, createRegExp, digit, global, letter, oneOrMore} from "magic-regexp"

import {ansi_yellow} from "./lib_ansi.js"
import {text_split_lines} from "./lib_text.js"
import {tui_confirm} from "./lib_tui_confirm.js"
import {tui_quote_smart_single} from "./lib_tui_quote.js"

const regexp_secret_global = createRegExp(oneOrMore(anyOf(letter, digit)), [global])

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

const NOT_SECRET_LINE_INCLUDES = ["http://", "https://"]

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

export async function secret_check({text, interactive}: {text: string; interactive: boolean}): Promise<void> {
  const not_secret_words: Set<string> = new Set()

  const lines = text_split_lines(text)

  for (const line of lines.toReversed()) {
    const words = line.match(regexp_secret_global)

    if (!words) {
      continue
    }

    if (is_not_secret_line(line)) {
      for (const word of words) {
        not_secret_words.add(word)
      }
      continue
    }

    if (line.endsWith(" # secret") || line.endsWith(" // secret")) {
      throw new Error(`Secret detected: ${tui_quote_smart_single(line.trim())}`)
    }

    for (const word of words) {
      if (not_secret_words.has(word)) {
        continue
      }

      if (regexp_identifier_exactly.test(word)) {
        continue
      }

      if (word.length < 20) {
        continue
      }

      if (interactive) {
        const confirmed_is_secret = await tui_confirm({
          question: `Is ${tui_quote_smart_single(word)} a secret?`,
          default: false,
          style_message: ansi_yellow,
        })

        if (!confirmed_is_secret) {
          not_secret_words.add(word)
          continue
        }
      }

      throw new Error(`Secret detected: ${tui_quote_smart_single(word)}`)
    }
  }
}
