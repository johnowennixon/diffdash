import * as lib_abort from "./lib_abort.js"
import * as lib_llm_provider from "./lib_llm_provider.js"
import type {LlmProvider} from "./lib_llm_provider.js"

export default {}

export interface LlmModelDetail {
  llm_model_name: string
  llm_provider: LlmProvider | null
  llm_model_code_direct: string | null
  llm_model_code_openrouter: string | null
  cents_input: number
}

export interface LlmModelAccess {
  llm_model_code: string
  llm_provider: LlmProvider
  llm_api_key: string
}

export function get_choices(details: Array<LlmModelDetail>): Array<string> {
  return details.map((model) => model.llm_model_name)
}

export function find_model(details: Array<LlmModelDetail>, llm_model_name: string): LlmModelDetail {
  for (const detail of details) {
    if (detail.llm_model_name === llm_model_name) {
      return detail
    }
  }

  lib_abort.with_error(`Unknown model: ${llm_model_name}`)
}

export function is_model_available(details: Array<LlmModelDetail>, llm_model_name: string): boolean {
  const detail = find_model(details, llm_model_name)

  const {llm_provider, llm_model_code_direct, llm_model_code_openrouter} = detail

  if (llm_model_code_direct !== null && llm_provider !== null) {
    if (lib_llm_provider.get_llm_api_key(llm_provider) !== null) {
      return true
    }
  }

  if (llm_model_code_openrouter !== null) {
    if (lib_llm_provider.get_llm_api_key("openrouter") !== null) {
      return true
    }
  }

  return false
}

export function get_model_access(details: Array<LlmModelDetail>, llm_model_name: string): LlmModelAccess {
  const detail = find_model(details, llm_model_name)

  const {llm_provider, llm_model_code_direct, llm_model_code_openrouter} = detail

  if (llm_model_code_direct !== null && llm_provider !== null) {
    const llm_api_key = lib_llm_provider.get_llm_api_key(llm_provider)
    if (llm_api_key !== null) {
      return {llm_model_code: llm_model_code_direct, llm_provider, llm_api_key}
    }
  }

  if (llm_model_code_openrouter !== null) {
    const llm_api_key = lib_llm_provider.get_llm_api_key("openrouter")
    if (llm_api_key !== null) {
      return {llm_model_code: llm_model_code_openrouter, llm_provider: "openrouter", llm_api_key}
    }
  }

  const env_openrouter = lib_llm_provider.get_llm_api_key_env("openrouter")

  if (llm_provider !== null) {
    const env_provider = lib_llm_provider.get_llm_api_key_env(llm_provider)
    lib_abort.with_error(`Please set environment variable ${env_openrouter} or ${env_provider}`)
  }

  lib_abort.with_error(`Please set environment variable ${env_openrouter}`)
}
