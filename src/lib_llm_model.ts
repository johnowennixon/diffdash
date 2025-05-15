import * as lib_abort from "./lib_abort.js"
import {COMMA} from "./lib_char.js"
import * as lib_llm_provider from "./lib_llm_provider.js"
import type {LlmProvider} from "./lib_llm_provider.js"

export default {}

export interface LlmModelDetail {
  llm_model_name: string
  llm_provider: LlmProvider | null
  llm_model_code_direct: string | null
  llm_model_code_openrouter: string | null
  cents_input: number
  cents_output: number
  has_structured_json: boolean
}

export interface LlmModelAccess {
  llm_model_code: string
  llm_provider: LlmProvider
  llm_api_key: string
}

export function get_choices(llm_model_details: Array<LlmModelDetail>): Array<string> {
  return llm_model_details.map((model) => model.llm_model_name)
}

export function find_model({
  llm_model_details,
  llm_model_name,
}: {llm_model_details: Array<LlmModelDetail>; llm_model_name: string}): LlmModelDetail {
  for (const detail of llm_model_details) {
    if (detail.llm_model_name === llm_model_name) {
      return detail
    }
  }

  lib_abort.with_error(`Unknown model: ${llm_model_name}`)
}

export function is_model_available({
  llm_model_details,
  llm_model_name,
  llm_excludes,
}: {llm_model_details: Array<LlmModelDetail>; llm_model_name: string; llm_excludes?: string}): boolean {
  if (llm_excludes) {
    const llm_excludes_array = llm_excludes.split(COMMA).map((exclude) => exclude.trim())

    for (const llm_exclude of llm_excludes_array) {
      if (llm_model_name.includes(llm_exclude)) {
        return false
      }
    }
  }

  const detail = find_model({llm_model_details, llm_model_name})

  const {llm_provider, llm_model_code_direct, llm_model_code_openrouter} = detail

  if (llm_model_code_direct !== null && llm_provider !== null) {
    if (lib_llm_provider.get_llm_api_key(llm_provider)) {
      return true
    }
  }

  if (llm_model_code_openrouter !== null) {
    if (lib_llm_provider.get_llm_api_key("openrouter")) {
      return true
    }
  }

  return false
}

export function get_model_access({
  llm_model_details,
  llm_model_name,
  llm_router,
}: {llm_model_details: Array<LlmModelDetail>; llm_model_name: string; llm_router: boolean}): LlmModelAccess {
  const detail = find_model({llm_model_details, llm_model_name})

  const {llm_provider, llm_model_code_direct, llm_model_code_openrouter} = detail

  if (!llm_router) {
    if (llm_model_code_direct !== null && llm_provider !== null) {
      const llm_api_key = lib_llm_provider.get_llm_api_key(llm_provider)
      if (llm_api_key) {
        return {llm_model_code: llm_model_code_direct, llm_provider, llm_api_key}
      }
    }
  }

  if (llm_model_code_openrouter !== null) {
    const llm_api_key = lib_llm_provider.get_llm_api_key("openrouter")
    if (llm_api_key) {
      return {llm_model_code: llm_model_code_openrouter, llm_provider: "openrouter", llm_api_key}
    }
  }

  if (llm_model_code_direct !== null && llm_provider !== null) {
    const llm_api_key = lib_llm_provider.get_llm_api_key(llm_provider)
    if (llm_api_key) {
      return {llm_model_code: llm_model_code_direct, llm_provider, llm_api_key}
    }
  }

  const env_openrouter = lib_llm_provider.get_llm_api_key_env("openrouter")

  if (llm_provider !== null) {
    const env_provider = lib_llm_provider.get_llm_api_key_env(llm_provider)
    lib_abort.with_error(`Please set environment variable ${env_openrouter} or ${env_provider}`)
  }

  lib_abort.with_error(`Please set environment variable ${env_openrouter}`)
}
