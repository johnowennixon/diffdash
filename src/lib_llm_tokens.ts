import {debug_channels} from "./lib_debug.js"
import type {LlmConfig} from "./lib_llm_config.js"
import {tell_debug} from "./lib_tell.js"

export function llm_tokens_estimate_tokens_from_length({length}: {llm_config: LlmConfig; length: number}): number {
  return Math.round(length / 1.4)
}

export function llm_tokens_estimate_length_from_tokens({tokens}: {llm_config: LlmConfig; tokens: number}): number {
  return Math.round(tokens * 1.4)
}

export function llm_tokens_debug_usage({
  name,
  llm_config,
  text,
}: {
  name: string
  llm_config: LlmConfig
  text: string
}): void {
  if (debug_channels.llm_tokens) {
    const {llm_model_name} = llm_config

    const length = text.length
    const tokens = llm_tokens_estimate_tokens_from_length({llm_config, length})
    const ratio = Math.round((length / tokens) * 100) / 100

    tell_debug(`${name}: length=${length}, tokens=${tokens}, ratio=${ratio}, model=${llm_model_name}`)
  }
}
