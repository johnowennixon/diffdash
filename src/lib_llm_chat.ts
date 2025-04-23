import {createAnthropic} from "@ai-sdk/anthropic"
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import {createOpenAI} from "@ai-sdk/openai"
import {createOpenRouter} from "@openrouter/ai-sdk-provider"
import type {LanguageModelV1} from "ai"
import {generateText} from "ai"

import {EMPTY} from "./lib_char.js"
import * as lib_debug from "./lib_debug.js"
import type {LlmConfig, LlmProvider} from "./lib_llm_config.js"
import * as lib_tell from "./lib_tell.js"
import * as lib_tui_block from "./lib_tui_block.js"

export default {}

export interface LlmResponse {
  text: string
  success: boolean
  error_message?: string
}

const PROVIDER_MAP: Record<LlmProvider, (model: string, llm_api_key: string) => LanguageModelV1> = {
  anthropic: (model: string, llm_api_key: string) => createAnthropic({apiKey: llm_api_key})(model),
  google: (model: string, llm_api_key: string) => createGoogleGenerativeAI({apiKey: llm_api_key})(model),
  openai: (model: string, llm_api_key: string) => createOpenAI({apiKey: llm_api_key})(model),
  openrouter: (model: string, llm_api_key: string) => createOpenRouter({apiKey: llm_api_key}).chat(model),
}

export async function call_llm({
  llm_config,
  user_prompt,
  system_prompt,
}: {llm_config: LlmConfig; user_prompt: string; system_prompt: string}): Promise<LlmResponse> {
  const {llm_provider, llm_model, llm_api_key} = llm_config

  try {
    if (lib_debug.channels.llm_inputs) {
      lib_tui_block.string_block({content: system_prompt, title: "LLM SYSTEM PROMPT"})
      lib_tui_block.string_block({content: user_prompt, title: "LLM USER PROMPT"})
    }

    const provider_fn = PROVIDER_MAP[llm_provider]

    const model = provider_fn(llm_model, llm_api_key)

    const result = await generateText({
      model,
      system: system_prompt,
      prompt: user_prompt,
    })

    const response_text = result.text

    if (lib_debug.channels.llm_outputs) {
      lib_tui_block.string_block({content: response_text, title: "LLM RESPONSE"})
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
