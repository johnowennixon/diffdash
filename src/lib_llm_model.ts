import * as lib_abort from "./lib_abort.js"
import {DOLLAR} from "./lib_char.js"
import {CliTable} from "./lib_cli_table.js"
import type {LlmProvider} from "./lib_llm_provider.js"
import * as lib_stdio from "./lib_stdio.js"
import * as lib_tui_justify from "./lib_tui_justify.js"

export default {}

export interface LlmModelDetail {
  llm_model_name: string
  llm_provider: LlmProvider | null
  llm_model_code_direct: string | null
  llm_model_code_openrouter: string | null
  context_window: number
  cents_input: number
  cents_output: number
  has_structured_json: boolean
}

const MODEL_DETAILS = [
  {
    llm_model_name: "claude-3.5-haiku",
    llm_provider: "anthropic",
    llm_model_code_direct: "claude-3-5-haiku-latest",
    llm_model_code_openrouter: "anthropic/claude-3.5-haiku",
    context_window: 200_000,
    cents_input: 80,
    cents_output: 400,
    has_structured_json: true,
  },
  {
    llm_model_name: "claude-3.7-sonnet",
    llm_provider: "anthropic",
    llm_model_code_direct: "claude-3.7-sonnet",
    llm_model_code_openrouter: "claude-3.7-sonnet",
    context_window: 200_000,
    cents_input: 300,
    cents_output: 1500,
    has_structured_json: true,
  },
  {
    llm_model_name: "claude-sonnet-4",
    llm_provider: "anthropic",
    llm_model_code_direct: null,
    llm_model_code_openrouter: "anthropic/claude-sonnet-4",
    context_window: 200_000,
    cents_input: 300,
    cents_output: 1500,
    has_structured_json: true,
  },
  {
    llm_model_name: "codex-mini",
    llm_provider: "openai",
    llm_model_code_direct: "codex-mini-latest",
    llm_model_code_openrouter: "openai/codex-mini",
    context_window: 200_000,
    cents_input: 150,
    cents_output: 600,
    has_structured_json: true,
  },
  {
    llm_model_name: "deepseek-v3",
    llm_provider: "deepseek",
    llm_model_code_direct: "deepseek-chat",
    llm_model_code_openrouter: "deepseek/deepseek-chat-v3-0324",
    context_window: 64_000,
    cents_input: 30,
    cents_output: 88,
    has_structured_json: true,
  },
  {
    llm_model_name: "deepseek-r1",
    llm_provider: "deepseek",
    llm_model_code_direct: "deepseek-reasoner",
    llm_model_code_openrouter: "deepseek/deepseek-r1",
    context_window: 163_840,
    cents_input: 50,
    cents_output: 218,
    has_structured_json: true,
  },
  {
    llm_model_name: "devstral-small",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "mistralai/devstral-small",
    context_window: 128_000,
    cents_input: 7,
    cents_output: 10,
    has_structured_json: true,
  },
  {
    llm_model_name: "gemini-2.0-flash",
    llm_provider: "google",
    llm_model_code_direct: "gemini-2.0-flash",
    llm_model_code_openrouter: "google/gemini-2.0-flash-001",
    context_window: 1_048_576,
    cents_input: 10,
    cents_output: 40,
    has_structured_json: true,
  },
  {
    llm_model_name: "gemini-2.5-flash-preview",
    llm_provider: "google",
    llm_model_code_direct: "gemini-2.5-flash-preview-05-20",
    llm_model_code_openrouter: "google/gemini-2.5-flash-preview",
    context_window: 1_048_576,
    cents_input: 15,
    cents_output: 60,
    has_structured_json: true,
  },
  {
    llm_model_name: "gemini-2.5-pro-preview",
    llm_provider: "google",
    llm_model_code_direct: "gemini-2.5-pro-preview-05-20",
    llm_model_code_openrouter: "google/gemini-2.5-pro-preview-03-25",
    context_window: 1_048_576,
    cents_input: 15,
    cents_output: 60,
    has_structured_json: true,
  },
  {
    llm_model_name: "glm-4-32b",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "thudm/glm-4-32b",
    context_window: 32_000,
    cents_input: 24,
    cents_output: 24,
    has_structured_json: false,
  },
  {
    llm_model_name: "gpt-4.1",
    llm_provider: "openai",
    llm_model_code_direct: "gpt-4.1",
    llm_model_code_openrouter: "openai/gpt-4.1",
    context_window: 1_047_576,
    cents_input: 200,
    cents_output: 800,
    has_structured_json: true,
  },
  {
    llm_model_name: "gpt-4.1-mini",
    llm_provider: "openai",
    llm_model_code_direct: "gpt-4.1-mini",
    llm_model_code_openrouter: "openai/gpt-4.1-mini",
    context_window: 1_047_576,
    cents_input: 40,
    cents_output: 160,
    has_structured_json: true,
  },
  {
    llm_model_name: "gpt-4.1-nano",
    llm_provider: "openai",
    llm_model_code_direct: "gpt-4.1-nano",
    llm_model_code_openrouter: "openai/gpt-4.1-nano",
    context_window: 1_047_576,
    cents_input: 10,
    cents_output: 40,
    has_structured_json: true,
  },
  {
    llm_model_name: "gpt-4o",
    llm_provider: "openai",
    llm_model_code_direct: "gpt-4o-mini",
    llm_model_code_openrouter: "openai/gpt-4o-mini",
    context_window: 128_000,
    cents_input: 250,
    cents_output: 1000,
    has_structured_json: true,
  },
  {
    llm_model_name: "gpt-4o-mini",
    llm_provider: "openai",
    llm_model_code_direct: "gpt-4o-mini",
    llm_model_code_openrouter: "openai/gpt-4o-mini",
    context_window: 128_000,
    cents_input: 15,
    cents_output: 60,
    has_structured_json: true,
  },
  {
    llm_model_name: "grok-3",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "x-ai/grok-3-beta",
    context_window: 131_072,
    cents_input: 300,
    cents_output: 1500,
    has_structured_json: true,
  },
  {
    llm_model_name: "grok-3-mini",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "x-ai/grok-3-mini-beta",
    context_window: 131_072,
    cents_input: 30,
    cents_output: 50,
    has_structured_json: true,
  },
  {
    llm_model_name: "llama-4-maverick",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "meta-llama/llama-4-maverick",
    context_window: 1_048_576,
    cents_input: 16,
    cents_output: 60,
    has_structured_json: true,
  },
  {
    llm_model_name: "llama-4-scout",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "meta-llama/llama-4-scout",
    context_window: 1_048_576,
    cents_input: 8,
    cents_output: 30,
    has_structured_json: true,
  },
  {
    llm_model_name: "mercury-coder-small",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "inception/mercury-coder-small-beta",
    context_window: 32_000,
    cents_input: 25,
    cents_output: 100,
    has_structured_json: false,
  },
  {
    llm_model_name: "mistral-medium-3",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "mistralai/mistral-medium-3",
    context_window: 131_072,
    cents_input: 40,
    cents_output: 200,
    has_structured_json: true,
  },
  {
    llm_model_name: "o3",
    llm_provider: "openai",
    llm_model_code_direct: "o3",
    llm_model_code_openrouter: "openai/o3",
    context_window: 200_000,
    cents_input: 1000,
    cents_output: 4000,
    has_structured_json: true,
  },
  {
    llm_model_name: "o4-mini",
    llm_provider: "openai",
    llm_model_code_direct: "o4-mini",
    llm_model_code_openrouter: "openai/o4-mini",
    context_window: 200_000,
    cents_input: 110,
    cents_output: 440,
    has_structured_json: true,
  },
  {
    llm_model_name: "qwen3-30b-a3b",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "qwen/qwen3-30b-a3b",
    context_window: 40_960,
    cents_input: 8,
    cents_output: 29,
    has_structured_json: true,
  },
  {
    llm_model_name: "qwen3-32b",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "qwen/qwen3-32b",
    context_window: 40_960,
    cents_input: 10,
    cents_output: 30,
    has_structured_json: true,
  },
  {
    llm_model_name: "qwen3-235b-a22b",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "qwen/qwen3-235b-a22b",
    context_window: 32_000,
    cents_input: 14,
    cents_output: 200,
    has_structured_json: true,
  },
] as const satisfies Array<LlmModelDetail>

export type LlmModelName = (typeof MODEL_DETAILS)[number]["llm_model_name"]

export function get_model_details({llm_model_names}: {llm_model_names: Array<LlmModelName>}): Array<LlmModelDetail> {
  return MODEL_DETAILS.filter((detail) => llm_model_names.includes(detail.llm_model_name))
}

export function get_model_choices(llm_model_details: Array<LlmModelDetail>): Array<string> {
  return llm_model_details.map((model) => model.llm_model_name)
}

export function find_model_detail({
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

export function display_models({llm_model_details}: {llm_model_details: Array<LlmModelDetail>}): void {
  const headings = ["NAME", "CONTEXT", "INPUT", "OUTPUT"]

  const table = new CliTable({headings})

  for (const detail of llm_model_details) {
    const {llm_model_name, context_window, cents_input, cents_output} = detail

    const tui_name = llm_model_name
    const tui_context = lib_tui_justify.justify_right(7, context_window.toString())
    const tui_input = lib_tui_justify.justify_right(6, DOLLAR + (cents_input / 100).toFixed(2))
    const tui_output = lib_tui_justify.justify_right(6, DOLLAR + (cents_output / 100).toFixed(2))

    const row = [tui_name, tui_context, tui_input, tui_output]

    table.push(row)
  }

  lib_stdio.write_stdout_linefeed(table.toString())
}
