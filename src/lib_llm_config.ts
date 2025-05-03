import {createAnthropic} from "@ai-sdk/anthropic"
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import {createOpenAI} from "@ai-sdk/openai"
import {createOpenRouter} from "@openrouter/ai-sdk-provider"
import type {LanguageModelV1} from "ai"

import * as lib_abort from "./lib_abort.js"
import * as lib_env from "./lib_env.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export type LlmProvider = "anthropic" | "google" | "openai" | "openrouter"

export interface LlmConfig {
  llm_model_name: string
  llm_model_code: string
  llm_provider: LlmProvider
  llm_api_key: string
}

export interface LlmModelDetails {
  llm_model_code: string
  llm_provider: LlmProvider
  cents_input: number
}

export type LlmGetDetails = (llm_model_name: string) => LlmModelDetails

export function get_llm_api_key(llm_provider: LlmProvider): string {
  switch (llm_provider) {
    case "anthropic":
      return lib_env.get_abort("ANTHROPIC_API_KEY")
    case "google":
      return lib_env.get_abort("GEMINI_API_KEY")
    case "openai":
      return lib_env.get_abort("OPENAI_API_KEY")
    case "openrouter":
      return lib_env.get_abort("OPENROUTER_API_KEY")
    default:
      lib_abort.with_error("Unknown LLM provider")
  }
}

export function get_ai_sdk_language_model({
  llm_model_code,
  llm_provider,
  llm_api_key,
}: {llm_model_code: string; llm_provider: LlmProvider; llm_api_key: string}): LanguageModelV1 {
  switch (llm_provider) {
    case "anthropic":
      return createAnthropic({apiKey: llm_api_key})(llm_model_code)
    case "google":
      return createGoogleGenerativeAI({apiKey: llm_api_key})(llm_model_code)
    case "openai":
      return createOpenAI({apiKey: llm_api_key})(llm_model_code)
    case "openrouter":
      return createOpenRouter({apiKey: llm_api_key})(llm_model_code)
    default:
      lib_abort.with_error("Unknown LLM provider")
  }
}

export function get_llm_config(llm_model: string, get_details: LlmGetDetails): LlmConfig {
  const llm_model_name = llm_model
  const llm_model_details = get_details(llm_model_name)
  const llm_model_code = llm_model_details.llm_model_code
  const llm_provider = llm_model_details.llm_provider
  const llm_api_key = get_llm_api_key(llm_provider)

  return {
    llm_model_name,
    llm_model_code,
    llm_provider,
    llm_api_key,
  }
}

export function show_llm_config({llm_config}: {llm_config: LlmConfig}): void {
  lib_tell.info(`Using LLM ${llm_config.llm_model_name} via ${llm_config.llm_provider}`)
}
