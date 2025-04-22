import {createAnthropic} from "@ai-sdk/anthropic"
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import {createOpenAI} from "@ai-sdk/openai"
import type {LanguageModelV1} from "ai"
import {generateText} from "ai"

import {EMPTY} from "./lib_char.js"
import * as lib_debug from "./lib_debug.js"
import type {LlmProvider} from "./lib_llm_config.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export interface LlmResponse {
  text: string
  success: boolean
  error_message?: string
}

const PROVIDER_MAP: Record<LlmProvider, (model: string) => LanguageModelV1> = {
  anthropic: (model: string) => createAnthropic({apiKey: process.env["ANTHROPIC_API_KEY"] || ""})(model),
  google: (model: string) => createGoogleGenerativeAI({apiKey: process.env["GOOGLE_API_KEY"] || ""})(model),
  openai: (model: string) => createOpenAI({apiKey: process.env["OPENAI_API_KEY"] || ""})(model),
}

export interface CallLlmParams {
  provider: LlmProvider
  model: string
  system_prompt: string
  user_prompt: string
}

export async function call_llm(params: CallLlmParams): Promise<LlmResponse> {
  const {provider, model, system_prompt, user_prompt} = params

  try {
    if (lib_debug.channels.llm_inputs) {
      lib_debug.string_block({content: system_prompt, title: "LLM SYSTEM PROMPT"})
      lib_debug.string_block({content: user_prompt, title: "LLM USER PROMPT"})
    }

    // Check if we have the API key
    switch (provider) {
      case "openai": {
        if (!process.env["OPENAI_API_KEY"]) {
          throw new Error("OPENAI_API_KEY environment variable not set")
        }
        break
      }
      case "anthropic": {
        if (!process.env["ANTHROPIC_API_KEY"]) {
          throw new Error("ANTHROPIC_API_KEY environment variable not set")
        }
        break
      }
      case "google": {
        if (!process.env["GOOGLE_API_KEY"]) {
          throw new Error("GOOGLE_API_KEY environment variable not set")
        }
        break
      }
    }

    const provider_fn = PROVIDER_MAP[provider]
    const model_instance = provider_fn(model)

    const result = await generateText({
      model: model_instance,
      system: system_prompt,
      prompt: user_prompt,
    })

    const response_text = result.text

    if (lib_debug.channels.llm_outputs) {
      lib_debug.string_block({content: response_text, title: "LLM RESPONSE"})
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
