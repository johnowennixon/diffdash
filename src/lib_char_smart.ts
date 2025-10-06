import {QUOTE_DOUBLE, QUOTE_SINGLE} from "./lib_char_punctuation.js"

export const LEFT_DOUBLE_QUOTATION_MARK = "“"
export const LEFT_SINGLE_QUOTATION_MARK = "‘"
export const RIGHT_DOUBLE_QUOTATION_MARK = "”"
export const RIGHT_SINGLE_QUOTATION_MARK = "’"

export function char_smart_remove(text: string): string {
  return text
    .replaceAll(LEFT_DOUBLE_QUOTATION_MARK, QUOTE_DOUBLE)
    .replaceAll(LEFT_SINGLE_QUOTATION_MARK, QUOTE_SINGLE)
    .replaceAll(RIGHT_DOUBLE_QUOTATION_MARK, QUOTE_DOUBLE)
    .replaceAll(RIGHT_SINGLE_QUOTATION_MARK, QUOTE_SINGLE)
}
