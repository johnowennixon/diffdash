import type {LlmModelDetail} from "./lib_llm_model.js"

export default {}

const DETAILS = [
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
    llm_model_name: "deepseek-v3",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "deepseek/deepseek-chat-v3-0324",
    context_window: 64_000,
    cents_input: 30,
    cents_output: 88,
    has_structured_json: true,
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
    llm_model_name: "qwen3",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "qwen/qwen3-235b-a22b",
    context_window: 32_000,
    cents_input: 14,
    cents_output: 200,
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
] as const satisfies Array<LlmModelDetail>

type LlmModelNamesDiff = (typeof DETAILS)[number]["llm_model_name"]

export function get_details(): Array<LlmModelDetail> {
  return DETAILS
}

export function get_default_model_name(): LlmModelNamesDiff {
  return "gpt-4.1-mini"
}

export function get_fallback_model_name(): LlmModelNamesDiff {
  return "claude-3.5-haiku"
}
