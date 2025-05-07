import {generateText} from "ai"

import * as lib_debug from "./lib_debug.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_provider from "./lib_llm_provider.js"
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

  // This is liable to throw an error
  const result = await generateText({
    model: ai_sdk_language_model,
    system: system_prompt,
    prompt: user_prompt,
    abortSignal: AbortSignal.timeout(30_000), // Set timeout to 30 seconds
  })

  const response_text = result.text

  if (lib_debug.channels.llm_outputs) {
    lib_tui_block.string_block({teller: lib_tell.debug, content: response_text, title: "LLM RESPONSE"})
  }

  return response_text
}
