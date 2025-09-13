import * as r from "magic-regexp"

import {ansi_yellow} from "./lib_ansi.js"
import {text_split_lines} from "./lib_text.js"
import {tui_confirm} from "./lib_tui_confirm.js"
import {tui_quote_smart_single} from "./lib_tui_quote.js"

const magic_letters = r.oneOrMore(r.anyOf(r.letter))
const magic_word = r.oneOrMore(r.anyOf(r.letter, r.digit))

const regexp_letters_exactly = r.createRegExp(magic_letters.at.lineStart().at.lineEnd())
const regexp_words_global = r.createRegExp(magic_word, [r.global])

const non_secrets = ["http://", "https://"]

function is_not_secret_line(line: string): boolean {
  if (line.endsWith(" not secret")) {
    return true
  }

  for (const non_secret of non_secrets) {
    if (line.includes(non_secret)) {
      return true
    }
  }

  return false
}

export async function secret_check({text, interactive}: {text: string; interactive: boolean}): Promise<void> {
  const not_secret_words: Set<string> = new Set()

  const lines = text_split_lines(text)

  for (const line of lines.toReversed()) {
    const words = line.match(regexp_words_global)

    if (!words) {
      continue
    }

    if (is_not_secret_line(line)) {
      for (const word of words) {
        not_secret_words.add(word)
      }
      continue
    }

    for (const word of words) {
      if (not_secret_words.has(word)) {
        continue
      }

      if (word.length < 20) {
        continue
      }

      if (word.length <= 43 && regexp_letters_exactly.test(word)) {
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
