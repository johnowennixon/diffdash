import {generateText} from "ai"

import * as lib_debug from "./lib_debug.js"
import * as lib_env from "./lib_env.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_provider from "./lib_llm_provider.js"
import * as lib_parse_number from "./lib_parse_number.js"
import * as lib_tell from "./lib_tell.js"
import * as lib_tui_block from "./lib_tui_block.js"

export default {}

export async function call_llm({
  llm_config,
  user_prompt,
  system_prompt,
}: {llm_config: LlmConfig; user_prompt: string; system_prompt: string}): Promise<string> {
  const {llm_provider, llm_model_code, llm_api_key} = llm_config

  if (lib_debug.channels.llm_inputs) {
    lib_tui_block.string_block({teller: lib_tell.debug, content: system_prompt, title: "LLM SYSTEM PROMPT"})
    lib_tui_block.string_block({teller: lib_tell.debug, content: user_prompt, title: "LLM USER PROMPT"})
  }

  const ai_sdk_language_model = lib_llm_provider.get_ai_sdk_language_model({
    llm_model_code,
    llm_provider,
    llm_api_key,
  })

  const max_tokens = lib_parse_number.parse_int_or_undefined(lib_env.get_empty("LIB_LLM_CHAT_MAX_TOKENS"))
  const temperature = lib_parse_number.parse_float_or_undefined(lib_env.get_empty("LIB_LLM_CHAT_TEMPERATURE"))
  const timeout = Number.parseInt(lib_env.get_substitute("LIB_LLM_CHAT_TIMEOUT", "30"))

  // This is liable to throw an error
  const llm_result = await generateText({
    model: ai_sdk_language_model,
    system: system_prompt,
    prompt: user_prompt,
    maxTokens: max_tokens,
    temperature,
    abortSignal: AbortSignal.timeout(timeout * 1000),
  })

  lib_debug.inspect_when(lib_debug.channels.llm_results, llm_result, "llm_result")

  const response_text = llm_result.text

  if (lib_debug.channels.llm_outputs) {
    lib_tui_block.string_block({teller: lib_tell.debug, content: response_text, title: "LLM RESPONSE"})
  }

  return response_text
}
