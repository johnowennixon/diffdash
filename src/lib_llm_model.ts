import * as lib_abort from "./lib_abort.js"
import type {LlmProvider} from "./lib_llm_provider.js"

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
    llm_model_name: "claude-sonnet-4",
    llm_provider: "anthropic",
    llm_model_code_direct: "claude-sonnet-4",
    llm_model_code_openrouter: "anthropic/claude-sonnet-3",
    context_window: 200_000,
    cents_input: 300,
    cents_output: 1500,
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
    llm_provider: null,
    llm_model_code_direct: "gemini-2.5-flash-preview-05-20",
    llm_model_code_openrouter: "google/gemini-2.5-flash-preview",
    context_window: 1_048_576,
    cents_input: 15,
    cents_output: 60,
    has_structured_json: true,
  },
  {
    llm_model_name: "glm-4-32b-free",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "thudm/glm-4-32b:free",
    context_window: 32_768,
    cents_input: 0,
    cents_output: 0,
    has_structured_json: false,
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
