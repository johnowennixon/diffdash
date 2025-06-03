import type {TellSync} from "./lib_tell.js"
import {tui_block_string} from "./lib_tui_block.js"

export function git_message_display({git_message, teller}: {git_message: string; teller: TellSync}): void {
  tui_block_string({teller, content: git_message})
}
