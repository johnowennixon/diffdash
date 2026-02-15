import {abort_with_error} from "./lib_abort.js"
import {tui_quote_smart_single as qss} from "./lib_tui_quote.js"

export const LANGUAGE_CODE_ENGLISH = "en"

export type LanguageDetail = {
  code: string
  name: string
}

export const LANGUAGE_DETAILS = [
  {code: "af", name: "Afrikaans"},
  {code: "bg", name: "Bulgarian"},
  {code: "bn", name: "Bengali"},
  {code: "ca", name: "Catalan"},
  {code: "cs", name: "Czech"},
  {code: "da", name: "Danish"},
  {code: "de", name: "German"},
  {code: "el", name: "Greek"},
  {code: "en", name: "English"},
  {code: "es", name: "Spanish"},
  {code: "et", name: "Estonian"},
  {code: "fi", name: "Finnish"},
  {code: "fr", name: "French"},
  {code: "hi", name: "Hindi"},
  {code: "hr", name: "Croatian"},
  {code: "hu", name: "Hungarian"},
  {code: "id", name: "Indonesian"},
  {code: "it", name: "Italian"},
  {code: "ja", name: "Japanese"},
  {code: "ko", name: "Korean"},
  {code: "lt", name: "Lithuanian"},
  {code: "lv", name: "Latvian"},
  {code: "ms", name: "Malay"},
  {code: "nl", name: "Dutch"},
  {code: "no", name: "Norwegian"},
  {code: "pl", name: "Polish"},
  {code: "pt", name: "Portuguese"},
  {code: "ro", name: "Romanian"},
  {code: "ru", name: "Russian"},
  {code: "sk", name: "Slovak"},
  {code: "sl", name: "Slovenian"},
  {code: "sr", name: "Serbian"},
  {code: "sv", name: "Swedish"},
  {code: "sw", name: "Swahili"},
  {code: "ta", name: "Tamil"},
  {code: "te", name: "Telugu"},
  {code: "th", name: "Thai"},
  {code: "tr", name: "Turkish"},
  {code: "uk", name: "Ukrainian"},
  {code: "vi", name: "Vietnamese"},
  {code: "zh-CN", name: "Chinese (Simplified)"},
  {code: "zh-HK", name: "Chinese (Traditional)"},
  {code: "zh-SG", name: "Chinese (Simplified)"},
  {code: "zh-TW", name: "Chinese (Traditional)"},
] as const satisfies Array<LanguageDetail>

export type Language = (typeof LANGUAGE_DETAILS)[number]
export type LanguageCode = Language["code"]
export type LanguageName = Language["name"]

export function language_get_code_choices(): Array<string> {
  return LANGUAGE_DETAILS.map((language) => language.code)
}

export function language_get_name_from_code(code: string): LanguageName {
  const language_entry = LANGUAGE_DETAILS.find((language) => language.code === code)

  if (!language_entry) {
    abort_with_error(`Unknown language code: ${qss(code)}`)
  }

  return language_entry.name
}
