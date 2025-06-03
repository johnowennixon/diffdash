import {env_get_substitute} from "./lib_env.js"
import {llm_model_get_choices, llm_model_get_details} from "./lib_llm_model.js"
import type {LlmModelName} from "./lib_llm_model.js"

const model_name_default: LlmModelName = "gpt-4.1-mini"
const model_name_fallback: LlmModelName = "claude-3.5-haiku"
const model_name_options: Array<LlmModelName> = [
  "claude-3.5-haiku",
  "deepseek-v3",
  "deepseek-r1",
  "devstral-small",
  "gemini-2.0-flash",
  "gemini-2.5-flash-preview",
  "gpt-4.1-mini", // the best
  "gpt-4.1-nano",
  "gpt-4o-mini",
  "grok-3-mini",
  "llama-4-maverick",
  "mistral-medium-3",
  "qwen3-235b-a22b",
]

export const diffdash_llm_model_details = llm_model_get_details({llm_model_names: model_name_options})
export const diffdash_llm_model_choices = llm_model_get_choices(diffdash_llm_model_details)
export const diffdash_llm_model_default = env_get_substitute("DIFFDASH_LLM_MODEL", model_name_default)
export const diffdash_llm_model_fallback = model_name_fallback
