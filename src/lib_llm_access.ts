import {abort_with_error} from "./lib_abort.js"
import {COMMA} from "./lib_char_punctuation.js"
import type {LlmModelDetail} from "./lib_llm_model.js"
import {llm_model_find_detail} from "./lib_llm_model.js"
import type {LlmProvider} from "./lib_llm_provider.js"
import {llm_provider_get_api_key, llm_provider_get_api_key_env} from "./lib_llm_provider.js"

export type LlmAccess = {
  llm_model_code: string
  llm_provider: LlmProvider
  llm_api_key: string
}

export function llm_access_available({
  llm_model_details,
  llm_model_name,
  llm_excludes,
}: {
  llm_model_details: Array<LlmModelDetail>
  llm_model_name: string
  llm_excludes?: string
}): boolean {
  if (llm_excludes) {
    const llm_excludes_array = llm_excludes.split(COMMA).map((exclude) => exclude.trim())

    for (const llm_exclude of llm_excludes_array) {
      if (llm_model_name.includes(llm_exclude)) {
        return false
      }
    }
  }

  const detail = llm_model_find_detail({llm_model_details, llm_model_name})

  const {llm_provider, llm_model_code_direct, llm_model_code_requesty, llm_model_code_openrouter} = detail

  if (llm_model_code_direct !== null && llm_provider !== null) {
    if (llm_provider_get_api_key(llm_provider)) {
      return true
    }
  }

  if (llm_model_code_requesty !== null) {
    if (llm_provider_get_api_key("requesty")) {
      return true
    }
  }

  if (llm_model_code_openrouter !== null) {
    if (llm_provider_get_api_key("openrouter")) {
      return true
    }
  }

  return false
}

export function llm_access_get({
  llm_model_details,
  llm_model_name,
  llm_router,
}: {
  llm_model_details: Array<LlmModelDetail>
  llm_model_name: string
  llm_router: boolean
}): LlmAccess {
  const detail = llm_model_find_detail({llm_model_details, llm_model_name})

  const {llm_provider, llm_model_code_direct, llm_model_code_requesty, llm_model_code_openrouter} = detail

  if (!llm_router) {
    if (llm_model_code_direct !== null && llm_provider !== null) {
      const llm_api_key = llm_provider_get_api_key(llm_provider)
      if (llm_api_key) {
        return {llm_model_code: llm_model_code_direct, llm_provider, llm_api_key}
      }
    }
  }

  if (llm_model_code_requesty !== null) {
    const llm_api_key = llm_provider_get_api_key("requesty")
    if (llm_api_key) {
      return {llm_model_code: llm_model_code_requesty, llm_provider: "requesty", llm_api_key}
    }
  }

  if (llm_model_code_openrouter !== null) {
    const llm_api_key = llm_provider_get_api_key("openrouter")
    if (llm_api_key) {
      return {llm_model_code: llm_model_code_openrouter, llm_provider: "openrouter", llm_api_key}
    }
  }

  if (llm_model_code_direct !== null && llm_provider !== null) {
    const llm_api_key = llm_provider_get_api_key(llm_provider)
    if (llm_api_key) {
      return {llm_model_code: llm_model_code_direct, llm_provider, llm_api_key}
    }
  }

  const env_requesty = llm_provider_get_api_key_env("requesty")
  const env_openrouter = llm_provider_get_api_key_env("openrouter")

  if (llm_provider !== null) {
    const env_provider = llm_provider_get_api_key_env(llm_provider)
    abort_with_error(`Please set environment variable ${env_requesty}, ${env_openrouter} or ${env_provider}`)
  }

  abort_with_error(`Please set environment variable ${env_requesty} or ${env_openrouter}`)
}
