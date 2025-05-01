import * as lib_tell from "./lib_tell.js"
import * as lib_tui_block from "./lib_tui_block.js"

export default {}

export function display_message(text: string): void {
  lib_tui_block.string_block({teller: lib_tell.normal, content: text})
}
