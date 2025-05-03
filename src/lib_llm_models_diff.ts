/* eslint-disable @stylistic/key-spacing */
/* eslint-disable @stylistic/no-multi-spaces */

import * as lib_abort from "./lib_abort.js"
import type {LlmModelDetails} from "./lib_llm_config.js"

export default {}

// biome-ignore format: keep on one line
const MODELS = {
  "claude-3.5-haiku":         {llm_model_code: "claude-3-5-haiku-latest",            llm_provider: "anthropic",  cents_input: 80},
  "deepseek-v3":              {llm_model_code: "deepseek/deepseek-chat-v3-0324",     llm_provider: "openrouter", cents_input: 27},
  "gemini-2.0-flash":         {llm_model_code: "gemini-2.0-flash",                   llm_provider: "google",     cents_input: 10},
  "gemini-2.5-flash-preview": {llm_model_code: "google/gemini-2.5-flash-preview",    llm_provider: "openrouter", cents_input: 15},
  "glm-4-32b":                {llm_model_code: "thudm/glm-4-32b",                    llm_provider: "openrouter", cents_input: 24},
  "gpt-4.1-mini":             {llm_model_code: "gpt-4.1-mini",                       llm_provider: "openai",     cents_input: 40},
  "grok-3-mini":              {llm_model_code: "x-ai/grok-3-mini-beta",              llm_provider: "openrouter", cents_input: 30},
  "mercury-coder-small":      {llm_model_code: "inception/mercury-coder-small-beta", llm_provider: "openrouter", cents_input: 25},
  "qwen3":                    {llm_model_code: "qwen/qwen3-235b-a22b",               llm_provider: "openrouter", cents_input: 20},
} as const

export type LlmModelsDiff = keyof typeof MODELS

const MODEL_CHOICES = Object.keys(MODELS)

const MODEL_DEFAULT: LlmModelsDiff = "gpt-4.1-mini"

export function get_choices(): Array<string> {
  return MODEL_CHOICES
}

export function get_default(): LlmModelsDiff {
  return MODEL_DEFAULT
}

export function get_model_details(llm_model_name: string): LlmModelDetails {
  if (!MODEL_CHOICES.includes(llm_model_name)) {
    lib_abort.with_error("Unknown LLM model name")
  }

  return MODELS[llm_model_name as LlmModelsDiff]
}
