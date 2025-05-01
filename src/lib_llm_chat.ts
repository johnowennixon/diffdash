import {generateText} from "ai"

import {EMPTY} from "./lib_char.js"
import * as lib_debug from "./lib_debug.js"
import * as lib_llm_config from "./lib_llm_config.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_tell from "./lib_tell.js"
import * as lib_tui_block from "./lib_tui_block.js"

export default {}

export interface LlmResponse {
  text: string
  success: boolean
  error_message?: string
}

export async function call_llm({
  llm_config,
  user_prompt,
  system_prompt,
}: {llm_config: LlmConfig; user_prompt: string; system_prompt: string}): Promise<LlmResponse> {
  const {llm_provider, llm_model_code, llm_api_key} = llm_config

  try {
    if (lib_debug.channels.llm_inputs) {
      lib_tui_block.string_block({teller: lib_tell.debug, content: system_prompt, title: "LLM SYSTEM PROMPT"})
      lib_tui_block.string_block({teller: lib_tell.debug, content: user_prompt, title: "LLM USER PROMPT"})
    }

    const ai_sdk_language_model = lib_llm_config.get_ai_sdk_language_model({llm_model_code, llm_provider, llm_api_key})

    const result = await generateText({
      model: ai_sdk_language_model,
      system: system_prompt,
      prompt: user_prompt,
    })

    const response_text = result.text

    if (lib_debug.channels.llm_outputs) {
      lib_tui_block.string_block({teller: lib_tell.debug, content: response_text, title: "LLM RESPONSE"})
    }

    return {
      text: response_text,
      success: true,
    }
  } catch (error) {
    const error_message = `AI SDK threw error: ${error instanceof Error ? error.message : String(error)}`

    lib_tell.error(error_message)

    return {
      text: EMPTY,
      success: false,
      error_message,
    }
  }
}
