import {encoding_for_model} from "tiktoken"

import type {LlmConfig} from "./lib_llm_config.js"

export default {}

export function count_tokens_estimated({llm_config, text}: {llm_config: LlmConfig; text: string}): number {
  const {llm_model_detail} = llm_config

  const {llm_model_code_direct} = llm_model_detail

  switch (llm_model_code_direct) {
    case "gpt-4.1-mini":
    case "gpt-4.1-nano":
    case "gpt-4o-mini":
      return encoding_for_model(llm_model_code_direct).encode(text).length

    default:
      return Math.round(text.length / 3)
  }
}
