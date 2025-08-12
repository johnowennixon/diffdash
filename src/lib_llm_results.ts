import {QUESTION, SPACE} from "./lib_char_punctuation.js"
import type {LlmChatGenerateTextResult} from "./lib_llm_chat.js"
import {tell_action, tell_info, tell_warning} from "./lib_tell.js"
import {tui_justify_left} from "./lib_tui_justify.js"
import {tui_none_blank} from "./lib_tui_none.js"
import {tui_number_plain} from "./lib_tui_number.js"

export function llm_results_summary(all_results: Array<LlmChatGenerateTextResult>): void {
  tell_action("Showing summary of responses ...")

  all_results = all_results.toSorted((a, b) => a.seconds - b.seconds)

  const max_length_model = Math.max(...all_results.map((result) => result.llm_config.llm_model_name.length))

  for (const result of all_results) {
    const {llm_config, seconds, error_text} = result

    if (error_text === null) {
      continue
    }

    const {llm_model_name} = llm_config

    const tui_model = tui_justify_left(max_length_model, llm_model_name)
    const tui_seconds = tui_number_plain({num: seconds, justify_left: 3})

    tell_warning(`${tui_model}  seconds=${tui_seconds}  ${error_text}`)
  }

  for (const result of all_results) {
    const {llm_config, seconds, error_text} = result

    if (error_text !== null) {
      continue
    }

    const {llm_model_name, llm_model_detail} = llm_config

    const {default_reasoning} = llm_model_detail

    const {outputs} = result

    const {total_usage, provider_metadata} = outputs

    const openrouter_provider = provider_metadata?.["openrouter"]?.["provider"] as string | undefined

    const tui_model = tui_justify_left(max_length_model, llm_model_name)
    const tui_seconds = tui_number_plain({num: seconds, justify_left: 3})
    const tui_input = tui_number_plain({num: total_usage.inputTokens, justify_left: 5})
    const tui_output = tui_number_plain({num: total_usage.outputTokens, justify_left: 5})
    const tui_reasoning = tui_number_plain({num: total_usage.reasoningTokens, justify_left: 5, none: QUESTION})
    const tui_provider = tui_none_blank(openrouter_provider)

    const segments = []

    segments.push(tui_model)
    segments.push(`seconds=${tui_seconds}`)
    segments.push(`input=${tui_input}`)
    segments.push(`output=${tui_output}`)
    if (default_reasoning || total_usage.reasoningTokens !== undefined) {
      segments.push(`reasoning=${tui_reasoning}`)
    }
    if (openrouter_provider) {
      segments.push(`provider=${tui_provider}`)
    }

    const message = segments.join(SPACE + SPACE)

    tell_info(message)
  }
}
