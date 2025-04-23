import * as lib_tui_block from "./lib_tui_block.js"

export default {}

export function display_message(text: string): void {
  lib_tui_block.string_block({content: text})
}
