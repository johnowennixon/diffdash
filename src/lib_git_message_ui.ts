import type {Teller} from "./lib_tell.js"
import * as lib_tui_block from "./lib_tui_block.js"

export default {}

export function display_message({git_message, teller}: {git_message: string; teller: Teller}): void {
  lib_tui_block.string_block({teller, content: git_message})
}
