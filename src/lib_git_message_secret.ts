import * as r from "magic-regexp"

import {ansi_yellow} from "./lib_ansi.js"
import {PLUS, SLASH} from "./lib_char_punctuation.js"
import type {GitMessagePromptInputs} from "./lib_git_message_prompt.js"
import {text_split_lines} from "./lib_text.js"
import {tui_confirm} from "./lib_tui_confirm.js"
import {tui_quote_smart_single} from "./lib_tui_quote.js"

const magic_letters = r.oneOrMore(r.letter)
const magic_word = r.oneOrMore(r.anyOf(r.letter, r.digit, r.exactly(SLASH), r.exactly(PLUS)))

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

export async function git_message_secret_check({inputs}: {inputs: GitMessagePromptInputs}): Promise<void> {
  const lines = text_split_lines(inputs.diff)

  for (const line of lines) {
    if (is_not_secret_line(line)) {
      continue
    }

    const words = line.match(regexp_words_global)

    if (!words) {
      continue
    }

    for (const word of words) {
      if (word.length < 20) {
        continue
      }

      if (word.length <= 43 && regexp_letters_exactly.test(word)) {
        continue
      }

      const is_secret = await tui_confirm({
        question: `Is ${tui_quote_smart_single(word)} a secret?`,
        default: false,
        style_message: ansi_yellow,
      })

      if (is_secret) {
        throw new Error(`Secret detected: ${tui_quote_smart_single(word)}`)
      }
    }
  }
}
