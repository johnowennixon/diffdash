import {env_get_substitute} from "./lib_env.js"
import type {LlmModelName} from "./lib_llm_model.js"
import {llm_model_get_choices, llm_model_get_details} from "./lib_llm_model.js"

const model_name_default: LlmModelName = "gpt-4.1-mini"
const model_name_options: Array<LlmModelName> = [
  "claude-3.5-haiku", // fallback
  "deepseek-chat",
  "gemini-2.5-flash",
  "gemini-3-flash-preview-low",
  "gpt-4.1-mini", // the best
  "gpt-4.1-nano",
  "gpt-5-mini",
  "gpt-5-mini-minimal", // fallback
  "gpt-5-nano",
  "gpt-5-nano-minimal",
  "grok-code-fast-1",
]

export const diffdash_llm_model_details = llm_model_get_details({llm_model_names: model_name_options})
export const diffdash_llm_model_choices = llm_model_get_choices({llm_model_details: diffdash_llm_model_details})
export const diffdash_llm_model_default = env_get_substitute("DIFFDASH_LLM_MODEL", model_name_default)
