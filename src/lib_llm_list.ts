import {DOLLAR} from "./lib_char.js"
import {CliTable} from "./lib_cli_table.js"
import type {LlmModelDetail} from "./lib_llm_model.js"
import * as lib_stdio from "./lib_stdio.js"
import * as lib_tui_justify from "./lib_tui_justify.js"

export default {}

export function llm_list_models({llm_model_details}: {llm_model_details: Array<LlmModelDetail>}): void {
  const headings = ["NAME", "CONTEXT", "INPUT", "OUTPUT"]

  const table = new CliTable({headings})

  for (const detail of llm_model_details) {
    const {llm_model_name, context_window, cents_input, cents_output} = detail

    const tui_name = llm_model_name
    const tui_context = lib_tui_justify.tui_justify_right(7, context_window.toString())
    const tui_input = lib_tui_justify.tui_justify_right(6, DOLLAR + (cents_input / 100).toFixed(2))
    const tui_output = lib_tui_justify.tui_justify_right(6, DOLLAR + (cents_output / 100).toFixed(2))

    const row = [tui_name, tui_context, tui_input, tui_output]

    table.push(row)
  }

  lib_stdio.write_stdout_linefeed(table.toString())
}
