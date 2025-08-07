import {createAnthropic} from "@ai-sdk/anthropic"
import {createDeepSeek} from "@ai-sdk/deepseek"
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import {createOpenAI} from "@ai-sdk/openai"
import {createOpenRouter} from "@openrouter/ai-sdk-provider"
import type {LanguageModel} from "ai"

import {abort_with_error} from "./lib_abort.js"
import {assert_type_string} from "./lib_assert_type.js"
import {AT_SIGN} from "./lib_char_punctuation.js"
import {env_get} from "./lib_env.js"

export type LlmApiCode = "anthropic" | "deepseek" | "google" | "openai" | "openrouter"

export function llm_api_get_via(llm_api_code: LlmApiCode): string {
  switch (llm_api_code) {
    case "anthropic":
    case "deepseek":
    case "google":
    case "openai":
      return "direct"

    case "openrouter":
      return "via OpenRouter"

    default:
      abort_with_error("Unknown LLM API")
  }
}

export function llm_api_get_api_key_env(llm_api_code: LlmApiCode): string {
  switch (llm_api_code) {
    case "anthropic":
      return "ANTHROPIC_API_KEY"
    case "deepseek":
      return "DEEPSEEK_API_KEY"
    case "google":
      return "GEMINI_API_KEY"
    case "openai":
      return "OPENAI_API_KEY"
    case "openrouter":
      return "OPENROUTER_API_KEY"
    default:
      abort_with_error("Unknown LLM API")
  }
}

export function llm_api_get_api_key(llm_api_code: LlmApiCode): string | null {
  const env = llm_api_get_api_key_env(llm_api_code)

  return env_get(env)
}

// eslint-disable-next-line sonarjs/function-return-type
export function llm_api_get_ai_sdk_language_model({
  llm_model_code,
  llm_api_code,
  llm_api_key,
}: {
  llm_model_code: string
  llm_api_code: LlmApiCode
  llm_api_key: string
}): LanguageModel {
  switch (llm_api_code) {
    case "anthropic":
      return createAnthropic({apiKey: llm_api_key})(llm_model_code)
    case "deepseek":
      return createDeepSeek({apiKey: llm_api_key})(llm_model_code)
    case "google":
      return createGoogleGenerativeAI({apiKey: llm_api_key})(llm_model_code)
    case "openai":
      return createOpenAI({apiKey: llm_api_key})(llm_model_code)

    case "openrouter": {
      const openrouter = createOpenRouter({apiKey: llm_api_key})

      if (llm_model_code.includes(AT_SIGN)) {
        const splits = llm_model_code.split(AT_SIGN)
        const model_id = assert_type_string(splits[0])
        const provider = assert_type_string(splits[1])

        return openrouter(model_id, {
          extraBody: {
            provider: {
              only: [provider],
            },
          },
        })
      }

      return openrouter(llm_model_code)
    }
    default:
      abort_with_error("Unknown LLM API")
  }
}
