import {DOLLAR} from "./lib_char_punctuation.js"
import type {LlmModelDetail} from "./lib_llm_model.js"
import {stdio_write_stdout_linefeed} from "./lib_stdio_write.js"
import {tell_info, tell_warning} from "./lib_tell.js"
import type {HorizontalAlignment} from "./lib_tui_table.js"
import {LEFT, RIGHT, TuiTable} from "./lib_tui_table.js"

export function llm_list_models({llm_model_details}: {llm_model_details: Array<LlmModelDetail>}): void {
  const headings = ["NAME", "API", "CONTEXT", "INPUT", "OUTPUT", "REASONING"]
  const alignments: Array<HorizontalAlignment> = [LEFT, LEFT, RIGHT, RIGHT, RIGHT, LEFT]

  const table = new TuiTable({headings, alignments, compact: true})

  for (const detail of llm_model_details) {
    const {llm_model_name, llm_api_code, context_window, cents_input, cents_output, default_reasoning} = detail

    const tui_name = llm_model_name
    const tui_api = llm_api_code
    const tui_context = context_window.toString()
    const tui_input = DOLLAR + (cents_input / 100).toFixed(2)
    const tui_output = DOLLAR + (cents_output / 100).toFixed(2)
    const tui_reasoning = default_reasoning ? "True" : "False"

    const row = [tui_name, tui_api, tui_context, tui_input, tui_output, tui_reasoning]

    table.push(row)
  }

  stdio_write_stdout_linefeed(table.toString())

  tell_info(`This is a total of ${llm_model_details.length} models.`)
  tell_info("Prices are per million tokens.")
  tell_warning("Prices are best effort and are liable to change - always double-check with your LLM API provider.")
}
