import {env_get} from "./lib_env.js"
import {llm_access_available, llm_access_get} from "./lib_llm_access.js"
import type {LlmApiCode} from "./lib_llm_api.js"
import type {LlmModelDetail} from "./lib_llm_model.js"
import {llm_model_find_detail, llm_model_get_choices} from "./lib_llm_model.js"
import {parse_int_or_undefined} from "./lib_parse_number.js"

export type LlmConfig = {
  llm_model_name: string
  llm_model_detail: LlmModelDetail
  llm_model_code: string
  llm_api_code: LlmApiCode
  llm_api_key: string
  effective_context_window: number
}

export function llm_config_get({
  llm_model_details,
  llm_model_name,
}: {
  llm_model_details: Array<LlmModelDetail>
  llm_model_name: string
}): LlmConfig {
  const llm_model_detail = llm_model_find_detail({llm_model_details, llm_model_name})

  const access = llm_access_get({llm_model_details, llm_model_name})

  const {llm_model_code, llm_api_code, llm_api_key} = access

  let effective_context_window = llm_model_detail.context_window

  const env_context_window = parse_int_or_undefined(env_get("LLM_CONFIG_CONTEXT_WINDOW"))
  if (env_context_window) {
    effective_context_window = Math.min(effective_context_window, env_context_window)
  }

  return {llm_model_name, llm_model_detail, llm_model_code, llm_api_code, llm_api_key, effective_context_window}
}

export function llm_config_get_all({
  llm_model_details,
  llm_include,
  llm_excludes,
}: {
  llm_model_details: Array<LlmModelDetail>
  llm_include?: string
  llm_excludes?: string
}): Array<LlmConfig> {
  const choices = llm_model_get_choices({llm_model_details})

  const available = choices.filter((llm_model_name) =>
    llm_access_available({llm_model_details, llm_model_name, llm_include, llm_excludes}),
  )

  return available.map((llm_model_name) => llm_config_get({llm_model_details, llm_model_name}))
}
