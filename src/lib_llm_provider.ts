import {createAnthropic} from "@ai-sdk/anthropic"
import {createDeepSeek} from "@ai-sdk/deepseek"
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import {createOpenAI} from "@ai-sdk/openai"
import {createOpenRouter} from "@openrouter/ai-sdk-provider"
import type {LanguageModelV1} from "ai"

import * as lib_abort from "./lib_abort.js"
import * as lib_env from "./lib_env.js"

export default {}

export type LlmProvider = "anthropic" | "deepseek" | "google" | "openai" | "openrouter"

export function get_llm_provider_via(llm_provider: LlmProvider): string {
  switch (llm_provider) {
    case "openrouter":
      return "via OpenRouter"

    case "anthropic":
    case "deepseek":
    case "google":
    case "openai":
      return "direct"

    default:
      lib_abort.abort_with_error("Unknown LLM provider")
  }
}

export function get_llm_api_key_env(llm_provider: LlmProvider): string {
  switch (llm_provider) {
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
      lib_abort.abort_with_error("Unknown LLM provider")
  }
}

export function get_llm_api_key(llm_provider: LlmProvider): string | null {
  const env = get_llm_api_key_env(llm_provider)

  return lib_env.env_get(env)
}

export function get_ai_sdk_language_model({
  llm_model_code,
  llm_provider,
  llm_api_key,
}: {llm_model_code: string; llm_provider: LlmProvider; llm_api_key: string}): LanguageModelV1 {
  switch (llm_provider) {
    case "anthropic":
      return createAnthropic({apiKey: llm_api_key})(llm_model_code)
    case "deepseek":
      return createDeepSeek({apiKey: llm_api_key})(llm_model_code)
    case "google":
      return createGoogleGenerativeAI({apiKey: llm_api_key})(llm_model_code)
    case "openai":
      return createOpenAI({apiKey: llm_api_key})(llm_model_code)
    case "openrouter":
      return createOpenRouter({apiKey: llm_api_key})(llm_model_code)
    default:
      lib_abort.abort_with_error("Unknown LLM provider")
  }
}
