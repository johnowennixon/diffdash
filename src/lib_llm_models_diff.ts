import * as lib_abort from "./lib_abort.js"
import * as lib_llm_config from "./lib_llm_config.js"
import type {LlmConfig, LlmModelAccess, LlmModelFull} from "./lib_llm_config.js"

export default {}

const MODELS = {
  "claude-3.5-haiku": {
    llm_provider: "anthropic",
    llm_model_code_direct: "claude-3-5-haiku-latest",
    llm_model_code_openrouter: "anthropic/claude-3.5-haiku",
    cents_input: 80,
  },
  "deepseek-v3": {
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "deepseek/deepseek-chat-v3-0324",
    cents_input: 27,
  },
  "gemini-2.0-flash": {
    llm_provider: "google",
    llm_model_code_direct: "gemini-2.0-flash",
    llm_model_code_openrouter: "google/gemini-2.0-flash-001",
    cents_input: 10,
  },
  "gemini-2.5-flash-preview": {
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "google/gemini-2.5-flash-preview",
    cents_input: 15,
  },
  "glm-4-32b": {
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "thudm/glm-4-32b",
    cents_input: 24,
  },
  "gpt-4.1-mini": {
    llm_provider: "openai",
    llm_model_code_direct: "gpt-4.1-mini",
    llm_model_code_openrouter: "openai/gpt-4.1-mini",
    cents_input: 40,
  },
  "grok-3-mini": {
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "x-ai/grok-3-mini-beta",
    cents_input: 30,
  },
  "mercury-coder-small": {
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "inception/mercury-coder-small-beta",
    cents_input: 25,
  },
  "qwen3": {
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "qwen/qwen3-235b-a22b",
    cents_input: 20,
  },
} as const

export type LlmModelsDiff = keyof typeof MODELS

const MODEL_CHOICES = Object.keys(MODELS)

const MODEL_DEFAULT = "gpt-4.1-mini"

export function get_choices(): Array<string> {
  return MODEL_CHOICES
}

export function get_default(): string {
  return MODEL_DEFAULT
}

export function get_model_access(llm_model: string): LlmModelAccess {
  const choices = Object.keys(MODELS)

  if (!choices.includes(llm_model)) {
    lib_abort.with_error("Unknown LLM model name")
  }

  const llm_model_name = llm_model as LlmModelsDiff

  const full = MODELS[llm_model_name] as LlmModelFull

  const {llm_provider, llm_model_code_direct, llm_model_code_openrouter} = full

  if (llm_model_code_direct !== null && llm_provider !== null) {
    if (lib_llm_config.get_llm_api_key(llm_provider) !== null) {
      return {llm_model_code: llm_model_code_direct, llm_provider}
    }
  }

  if (llm_model_code_openrouter !== null) {
    if (lib_llm_config.get_llm_api_key("openrouter") !== null) {
      return {llm_model_code: llm_model_code_openrouter, llm_provider: "openrouter"}
    }
  }

  const env_openrouter = lib_llm_config.get_llm_api_key_env("openrouter")

  if (llm_provider !== null) {
    const env_provider = lib_llm_config.get_llm_api_key_env(llm_provider)
    lib_abort.with_error(`Please set environment variable ${env_openrouter} or ${env_provider}`)
  }

  lib_abort.with_error(`Please set environment variable ${env_openrouter}`)
}

export function is_model_available(llm_model: string): boolean {
  const choices = Object.keys(MODELS)

  if (!choices.includes(llm_model)) {
    return false
  }

  const llm_model_name = llm_model as LlmModelsDiff

  const {llm_provider, llm_model_code_direct, llm_model_code_openrouter} = MODELS[llm_model_name]

  if (llm_model_code_direct !== null) {
    if (lib_llm_config.get_llm_api_key(llm_provider) !== null) {
      return true
    }
  }

  // eslint-disable-next-line sonarjs/different-types-comparison
  if (llm_model_code_openrouter !== null) {
    if (lib_llm_config.get_llm_api_key("openrouter") !== null) {
      return true
    }
  }

  return false
}

export function all_llm_configs(): Array<LlmConfig> {
  const available = MODEL_CHOICES.filter(is_model_available)

  return available.map((llm_model_name) => lib_llm_config.get_llm_config(llm_model_name, get_model_access))
}
