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

export type LlmModelFull = {
  llm_provider: LlmProvider | null
  llm_model_code_direct: string | null
  llm_model_code_openrouter: string | null
  cents_input: number
}

export interface LlmModelAccess {
  llm_model_code: string
  llm_provider: LlmProvider
}

export interface LlmConfig {
  llm_model_name: string
  llm_model_code: string
  llm_provider: LlmProvider
  llm_api_key: string
}

export type LlmGetAccess = (llm_model_name: string) => LlmModelAccess

export function get_llm_provider_via(llm_provider: LlmProvider): string {
  switch (llm_provider) {
    case "openrouter":
      return "via OpenRouter"

    case "anthropic":
    case "google":
    case "openai":
      return "direct"

    default:
      lib_abort.with_error("Unknown LLM provider")
  }
}

export function get_llm_api_key_env(llm_provider: LlmProvider): string {
  switch (llm_provider) {
    case "anthropic":
      return "ANTHROPIC_API_KEY"
    case "google":
      return "GEMINI_API_KEY"
    case "openai":
      return "OPENAI_API_KEY"
    case "openrouter":
      return "OPENROUTER_API_KEY"
    default:
      lib_abort.with_error("Unknown LLM provider")
  }
}

export function get_llm_api_key(llm_provider: LlmProvider): string | null {
  const env = get_llm_api_key_env(llm_provider)

  return lib_env.get(env)
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

export function get_llm_config(llm_model_name: string, get_details: LlmGetAccess): LlmConfig {
  const llm_model_details = get_details(llm_model_name)
  const llm_model_code = llm_model_details.llm_model_code
  const llm_provider = llm_model_details.llm_provider
  const llm_api_key = get_llm_api_key(llm_provider)

  if (llm_api_key === null) {
    lib_abort.with_error("Please set an environment variable for the LLM API key")
  }

  return {
    llm_model_name,
    llm_model_code,
    llm_provider,
    llm_api_key,
  }
}

export function get_llm_model_via(llm_config: LlmConfig): string {
  const {llm_model_name, llm_provider} = llm_config

  return `${llm_model_name} (${get_llm_provider_via(llm_provider)})`
}

export function show_llm_config(llm_config: LlmConfig): void {
  const model_via = get_llm_model_via(llm_config)

  lib_tell.info(`Using LLM ${model_via}`)
}
