import {llm_access_available, llm_access_get} from "./lib_llm_access.js"
import type {LlmApiCode} from "./lib_llm_api.js"
import {llm_api_get_via} from "./lib_llm_api.js"
import type {LlmModelDetail} from "./lib_llm_model.js"
import {llm_model_find_detail, llm_model_get_choices} from "./lib_llm_model.js"
import {tell_info} from "./lib_tell.js"

export type LlmConfig = {
  llm_model_name: string
  llm_model_detail: LlmModelDetail
  llm_model_code: string
  llm_api_code: LlmApiCode
  llm_api_key: string
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

  return {llm_model_name, llm_model_detail, llm_model_code, llm_api_code, llm_api_key}
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

export function llm_config_get_model_via({llm_config}: {llm_config: LlmConfig}): string {
  const {llm_model_name, llm_api_code} = llm_config

  return `${llm_model_name} (${llm_api_get_via(llm_api_code)})`
}

export function llm_config_show({llm_config}: {llm_config: LlmConfig}): void {
  const model_via = llm_config_get_model_via({llm_config})

  tell_info(`Using LLM ${model_via}`)
}
