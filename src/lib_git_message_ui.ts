import * as lib_debug from "./lib_debug.js"

export default {}

export function display_message(text: string): void {
  lib_debug.string_block({content: text})
}
