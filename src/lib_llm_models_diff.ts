import type {LlmModelDetail} from "./lib_llm_model.js"

export default {}

const DETAILS: Array<LlmModelDetail> = [
  {
    llm_model_name: "gpt-4.1-mini",
    llm_provider: "openai",
    llm_model_code_direct: "gpt-4.1-mini",
    llm_model_code_openrouter: "openai/gpt-4.1-mini",
    cents_input: 40,
  },
  {
    llm_model_name: "claude-3.5-haiku",
    llm_provider: "anthropic",
    llm_model_code_direct: "claude-3-5-haiku-latest",
    llm_model_code_openrouter: "anthropic/claude-3.5-haiku",
    cents_input: 80,
  },
  {
    llm_model_name: "gemini-2.0-flash",
    llm_provider: "google",
    llm_model_code_direct: "gemini-2.0-flash",
    llm_model_code_openrouter: "google/gemini-2.0-flash-001",
    cents_input: 10,
  },
  {
    llm_model_name: "gemini-2.5-flash-preview",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "google/gemini-2.5-flash-preview",
    cents_input: 15,
  },
  {
    llm_model_name: "deepseek-v3-free",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "deepseek/deepseek-chat-v3-0324:free",
    cents_input: 0,
  },
  {
    llm_model_name: "deepseek-r1-free",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "deepseek/deepseek-r1:free",
    cents_input: 0,
  },
  {
    llm_model_name: "glm-4-32b-free",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "thudm/glm-4-32b:free",
    cents_input: 0,
  },
  {
    llm_model_name: "grok-3-mini",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "x-ai/grok-3-mini-beta",
    cents_input: 30,
  },
  {
    llm_model_name: "mercury-coder-small",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "inception/mercury-coder-small-beta",
    cents_input: 25,
  },
  {
    llm_model_name: "qwen3",
    llm_provider: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "qwen/qwen3-235b-a22b",
    cents_input: 20,
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
