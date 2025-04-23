import {EMPTY} from "./lib_char.js"
import * as lib_env from "./lib_env.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export type LlmProvider = "anthropic" | "google" | "openai"

export const LLM_PROVIDER_CHOICES: Array<LlmProvider> = ["anthropic", "google", "openai"]

export interface LlmConfig {
  llm_provider: LlmProvider
  llm_model: string
  llm_api_key: string
}

export function show_llm_config({llm_config, verbose}: {llm_config: LlmConfig; verbose: boolean}): void {
  if (verbose) {
    lib_tell.info(`Using LLM provider: ${llm_config.llm_provider}`)
    lib_tell.info(`Using LLM model:    ${llm_config.llm_model}`)
  }
}

export function default_llm_model({llm_provider}: {llm_provider: LlmProvider}): string | undefined {
  if (llm_provider === "openai") {
    return "gpt-4.1-mini"
  }
  if (llm_provider === "anthropic") {
    return "claude-3.5-haiku"
  }
  if (llm_provider === "google") {
    return "gemini-2.0-flash"
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

  return EMPTY
}
