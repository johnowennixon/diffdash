import {llm_access_available, llm_access_get} from "./lib_llm_access.js"
import type {LlmModelDetail} from "./lib_llm_model.js"
import {llm_model_find_detail, llm_model_get_choices} from "./lib_llm_model.js"
import type {LlmProvider} from "./lib_llm_provider.js"
import {llm_provider_get_via} from "./lib_llm_provider.js"
import {tell_info} from "./lib_tell.js"

export default {}

export interface LlmConfig {
  llm_model_name: string
  llm_model_detail: LlmModelDetail
  llm_model_code: string
  llm_provider: LlmProvider
  llm_api_key: string
}

export function llm_config_get({
  llm_model_details,
  llm_model_name,
  llm_router,
}: {llm_model_details: Array<LlmModelDetail>; llm_model_name: string; llm_router: boolean}): LlmConfig {
  const llm_model_detail = llm_model_find_detail({llm_model_details, llm_model_name})

  const access = llm_access_get({llm_model_details, llm_model_name, llm_router})

  const {llm_model_code, llm_provider, llm_api_key} = access

  return {llm_model_name, llm_model_detail, llm_model_code, llm_provider, llm_api_key}
}

export function llm_config_get_all({
  llm_model_details,
  llm_router,
  llm_excludes,
}: {llm_model_details: Array<LlmModelDetail>; llm_router: boolean; llm_excludes?: string}): Array<LlmConfig> {
  const choices = llm_model_get_choices(llm_model_details)

  const available = choices.filter((llm_model_name) =>
    llm_access_available({llm_model_details, llm_model_name, llm_excludes}),
  )

  return available.map((llm_model_name) => llm_config_get({llm_model_details, llm_model_name, llm_router}))
}

export function llm_config_get_model_via(llm_config: LlmConfig): string {
  const {llm_model_name, llm_provider} = llm_config

  return `${llm_model_name} (${llm_provider_get_via(llm_provider)})`
}

export function llm_config_show(llm_config: LlmConfig): void {
  const model_via = llm_config_get_model_via(llm_config)

  tell_info(`Using LLM ${model_via}`)
}
