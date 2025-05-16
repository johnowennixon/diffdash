import type {LlmModelDetail} from "./lib_llm_model.js"

export default {}

const DETAILS: Array<LlmModelDetail> = [
  {
    llm_model_name: "gpt-4.1-mini",
    llm_provider: "openai",
    llm_model_code_direct: "gpt-4.1-mini",
    llm_model_code_openrouter: "openai/gpt-4.1-mini",
    cents_input: 40,
    cents_output: 160,
    has_structured_json: true,
  },
  {
    llm_model_name: "claude-3.5-haiku",
    llm_provider: "anthropic",
    llm_model_code_direct: "claude-3-5-haiku-latest",
    llm_model_code_openrouter: "anthropic/claude-3.5-haiku",
    cents_input: 80,
    cents_output: 400,
    has_structured_json: true,
  },
  {
    llm_model_name: "deepseek-v3",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "deepseek/deepseek-chat-v3-0324",
    cents_input: 30,
    cents_output: 88,
    has_structured_json: true,
  },
  {
    llm_model_name: "mistral-medium-3",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "mistralai/mistral-medium-3",
    cents_input: 40,
    cents_output: 200,
    has_structured_json: true,
  },
  {
    llm_model_name: "gemini-2.0-flash",
    llm_provider: "google",
    llm_model_code_direct: "gemini-2.0-flash",
    llm_model_code_openrouter: "google/gemini-2.0-flash-001",
    cents_input: 10,
    cents_output: 40,
    has_structured_json: true,
  },
  {
    llm_model_name: "gemini-2.5-flash-preview",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "google/gemini-2.5-flash-preview",
    cents_input: 15,
    cents_output: 60,
    has_structured_json: true,
  },
  {
    llm_model_name: "qwen3",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "qwen/qwen3-235b-a22b",
    cents_input: 14,
    cents_output: 200,
    has_structured_json: true,
  },
  {
    llm_model_name: "grok-3-mini",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "x-ai/grok-3-mini-beta",
    cents_input: 30,
    cents_output: 50,
    has_structured_json: true,
  },
  {
    llm_model_name: "glm-4-32b",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "thudm/glm-4-32b",
    cents_input: 24,
    cents_output: 24,
    has_structured_json: false,
  },
]

export function get_details(): Array<LlmModelDetail> {
  return DETAILS
}

export function get_default_model_name(): string {
  // Not type-checked but must be one of the above models
  return "gpt-4.1-mini"
}

export function get_fallback_model_name(): string {
  // Not type-checked but must be one of the above models
  return "claude-3.5-haiku"
}
