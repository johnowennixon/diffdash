import * as lib_debug from "./lib_debug.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_tokens from "./lib_llm_tokens.js"
import type {Teller} from "./lib_tell.js"
import * as lib_tell from "./lib_tell.js"
import * as lib_tui_block from "./lib_tui_block.js"

export default {}

export function display_message({message, teller}: {message: string; teller: Teller}): void {
  lib_tui_block.string_block({teller, content: message})
}

export function debug_token_usage({name, llm_config, text}: {name: string; llm_config: LlmConfig; text: string}): void {
  if (lib_debug.channels.llm_tokens) {
    const {llm_model_name} = llm_config

    const length = text.length
    const tokens = lib_llm_tokens.count_tokens_estimated({llm_config, text})
    const ratio = Math.round((length / tokens) * 100) / 100

    lib_tell.debug(`${name}: length=${length}, tokens=${tokens}, ratio=${ratio}, model=${llm_model_name}`)
  }
}
