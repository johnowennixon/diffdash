import {abort_with_error} from "./lib_abort.js"
import {COMMA} from "./lib_char_punctuation.js"
import type {LlmApiCode} from "./lib_llm_api.js"
import {llm_api_get_api_key, llm_api_get_api_key_env} from "./lib_llm_api.js"
import type {LlmModelDetail} from "./lib_llm_model.js"
import {llm_model_find_detail} from "./lib_llm_model.js"

export type LlmAccess = {
  llm_model_code: string
  llm_api_code: LlmApiCode
  llm_api_key: string
}

export function llm_access_available({
  llm_model_details,
  llm_model_name,
  llm_include,
  llm_excludes,
}: {
  llm_model_details: Array<LlmModelDetail>
  llm_model_name: string
  llm_include?: string
  llm_excludes?: string
}): boolean {
  const detail = llm_model_find_detail({llm_model_details, llm_model_name})

  const {llm_api_code} = detail

  if (llm_api_get_api_key(llm_api_code) === null) {
    return false
  }

  if (llm_include) {
    if (!(llm_model_name.includes(llm_include) || llm_include === llm_api_code)) {
      return false
    }
  }

  if (llm_excludes) {
    const llm_excludes_array = llm_excludes.split(COMMA).map((exclude) => exclude.trim())

    for (const llm_exclude of llm_excludes_array) {
      if (llm_model_name.includes(llm_exclude)) {
        return false
      }
    }
  }

  return true
}

export function llm_access_get({
  llm_model_details,
  llm_model_name,
}: {
  llm_model_details: Array<LlmModelDetail>
  llm_model_name: string
}): LlmAccess {
  const detail = llm_model_find_detail({llm_model_details, llm_model_name})

  const {llm_api_code, llm_model_code} = detail

  const llm_api_key = llm_api_get_api_key(llm_api_code)

  if (!llm_api_key) {
    const env_name = llm_api_get_api_key_env(llm_api_code)
    abort_with_error(`Please set environment variable ${env_name}`)
  }

  return {llm_model_code, llm_api_code, llm_api_key}
}
