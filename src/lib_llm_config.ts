import type {LlmModelDetail} from "./lib_llm_model.js"
import * as lib_llm_model from "./lib_llm_model.js"
import * as lib_llm_provider from "./lib_llm_provider.js"
import type {LlmProvider} from "./lib_llm_provider.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export interface LlmConfig {
  llm_model_name: string
  llm_model_code: string
  llm_provider: LlmProvider
  llm_api_key: string
}

export function get_llm_config(details: Array<LlmModelDetail>, llm_model_name: string): LlmConfig {
  const access = lib_llm_model.get_model_access(details, llm_model_name)

  const llm_model_code = access.llm_model_code
  const llm_provider = access.llm_provider
  const llm_api_key = access.llm_api_key

  return {
    llm_model_name,
    llm_model_code,
    llm_provider,
    llm_api_key,
  }
}

export function all_llm_configs(details: Array<LlmModelDetail>): Array<LlmConfig> {
  const choices = lib_llm_model.get_choices(details)
  const available = choices.filter((llm_model_name) => lib_llm_model.is_model_available(details, llm_model_name))

  return available.map((llm_model_name) => get_llm_config(details, llm_model_name))
}

export function get_llm_model_via(llm_config: LlmConfig): string {
  const {llm_model_name, llm_provider} = llm_config

  return `${llm_model_name} (${lib_llm_provider.get_llm_provider_via(llm_provider)})`
}

export function show_llm_config(llm_config: LlmConfig): void {
  const model_via = get_llm_model_via(llm_config)

  lib_tell.info(`Using LLM ${model_via}`)
}
