import type {LlmModelDetail} from "./lib_llm_model.js"
import * as lib_llm_model from "./lib_llm_model.js"
import * as lib_llm_provider from "./lib_llm_provider.js"
import type {LlmProvider} from "./lib_llm_provider.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export interface LlmConfig {
  llm_model_name: string
  llm_model_detail: LlmModelDetail
  llm_model_code: string
  llm_provider: LlmProvider
  llm_api_key: string
}

export function get_llm_config({
  llm_model_details,
  llm_model_name,
  llm_router,
}: {llm_model_details: Array<LlmModelDetail>; llm_model_name: string; llm_router: boolean}): LlmConfig {
  const llm_model_detail = lib_llm_model.find_model({llm_model_details, llm_model_name})

  const access = lib_llm_model.get_model_access({llm_model_details, llm_model_name, llm_router})

  const {llm_model_code, llm_provider, llm_api_key} = access

  return {llm_model_name, llm_model_detail, llm_model_code, llm_provider, llm_api_key}
}

export function all_llm_configs({
  llm_model_details,
  llm_router,
  llm_excludes,
}: {llm_model_details: Array<LlmModelDetail>; llm_router: boolean; llm_excludes?: string}): Array<LlmConfig> {
  const choices = lib_llm_model.get_choices(llm_model_details)

  const available = choices.filter((llm_model_name) =>
    lib_llm_model.is_model_available({llm_model_details, llm_model_name, llm_excludes}),
  )

  return available.map((llm_model_name) => get_llm_config({llm_model_details, llm_model_name, llm_router}))
}

export function get_llm_model_via(llm_config: LlmConfig): string {
  const {llm_model_name, llm_provider} = llm_config

  return `${llm_model_name} (${lib_llm_provider.get_llm_provider_via(llm_provider)})`
}

export function show_llm_config(llm_config: LlmConfig): void {
  const model_via = get_llm_model_via(llm_config)

  lib_tell.info(`Using LLM ${model_via}`)
}
