import {EMPTY} from "./lib_char.js"
import * as lib_env from "./lib_env.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export type LlmProvider = "anthropic" | "google" | "openai" | "openrouter"

export const LLM_PROVIDER_CHOICES: Array<LlmProvider> = ["anthropic", "google", "openai", "openrouter"]

export interface LlmConfig {
  llm_provider: LlmProvider
  llm_model: string
  llm_api_key: string
}

export function show_llm_config({llm_config}: {llm_config: LlmConfig}): void {
  lib_tell.info(`Using LLM ${llm_config.llm_model} from ${llm_config.llm_provider}`)
}

export function default_llm_model({llm_provider}: {llm_provider: LlmProvider}): string | undefined {
  if (llm_provider === "openai") {
    return "gpt-4.1-mini"
  }
  if (llm_provider === "anthropic") {
    return "claude-3.5-haiku-latest"
  }
  if (llm_provider === "google") {
    return "gemini-2.0-flash"
  }
  if (llm_provider === "openrouter") {
    return "google/gemini-2.5-flash-preview"
  }

  return undefined
}

export function get_llm_api_key({llm_provider}: {llm_provider: LlmProvider}): string {
  if (llm_provider === "openai") {
    return lib_env.get_abort("OPENAI_API_KEY")
  }
  if (llm_provider === "anthropic") {
    return lib_env.get_abort("ANTHROPIC_API_KEY")
  }
  if (llm_provider === "google") {
    return lib_env.get_abort("GEMINI_API_KEY")
  }
  if (llm_provider === "openrouter") {
    return lib_env.get_abort("OPENROUTER_API_KEY")
  }

  return EMPTY
}
