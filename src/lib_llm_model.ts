import {abort_with_error} from "./lib_abort.js"
import type {LlmApiCode} from "./lib_llm_api.js"

export type LlmModelDetail = {
  llm_model_name: string
  llm_api_code: LlmApiCode | null
  llm_model_code_direct: string | null
  llm_model_code_openrouter: string | null
  context_window: number
  cents_input: number
  cents_output: number
  default_reasoning: boolean
  has_structured_json: boolean
}

const LLM_MODEL_DETAILS = [
  {
    llm_model_name: "claude-3.5-haiku",
    llm_api_code: "anthropic",
    llm_model_code_direct: "claude-3-5-haiku-latest",

    llm_model_code_openrouter: "anthropic/claude-3.5-haiku",
    context_window: 200_000,
    cents_input: 80,
    cents_output: 400,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "claude-3.7-sonnet",
    llm_api_code: "anthropic",
    llm_model_code_direct: "claude-3-7-sonnet-20250219",

    llm_model_code_openrouter: "anthropic/claude-3.7-sonnet",
    context_window: 200_000,
    cents_input: 300,
    cents_output: 1500,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "claude-sonnet-4",
    llm_api_code: "anthropic",
    llm_model_code_direct: "claude-sonnet-4-0",

    llm_model_code_openrouter: "anthropic/claude-sonnet-4",
    context_window: 200_000,
    cents_input: 300,
    cents_output: 1500,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "codestral-2508",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "mistralai/codestral-2508",
    context_window: 256_000,
    cents_input: 30,
    cents_output: 90,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "deepseek-v3",
    llm_api_code: "deepseek",
    llm_model_code_direct: "deepseek-chat",

    llm_model_code_openrouter: "deepseek/deepseek-chat-v3-0324",
    context_window: 64_000,
    cents_input: 27,
    cents_output: 110,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "deepseek-r1",
    llm_api_code: "deepseek",
    llm_model_code_direct: "deepseek-reasoner",

    llm_model_code_openrouter: "deepseek/deepseek-r1-0528",
    context_window: 163_840,
    cents_input: 55,
    cents_output: 219,
    default_reasoning: true,
    has_structured_json: true,
  },
  {
    llm_model_name: "devstral-medium",
    llm_api_code: null,
    llm_model_code_direct: "devstral-medium-latest",

    llm_model_code_openrouter: "mistralai/devstral-medium",
    context_window: 128_000,
    cents_input: 40,
    cents_output: 200,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "devstral-small",
    llm_api_code: null,
    llm_model_code_direct: "devstral-small-latest",
    llm_model_code_openrouter: "mistralai/devstral-small",
    context_window: 128_000,
    cents_input: 10,
    cents_output: 30,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "gemini-2.0-flash",
    llm_api_code: "google",
    llm_model_code_direct: "gemini-2.0-flash",
    llm_model_code_openrouter: "google/gemini-2.0-flash-001",
    context_window: 1_048_576,
    cents_input: 10,
    cents_output: 40,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "gemini-2.5-flash",
    llm_api_code: "google",
    llm_model_code_direct: "gemini-2.5-flash",
    llm_model_code_openrouter: "google/gemini-2.5-flash",
    context_window: 1_048_576,
    cents_input: 30,
    cents_output: 250,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "gemini-2.5-pro",
    llm_api_code: "google",
    llm_model_code_direct: "gemini-2.5-pro",
    llm_model_code_openrouter: "google/gemini-2.5-pro",
    context_window: 1_048_576,
    cents_input: 125,
    cents_output: 1000,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "glm-4-32b",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "z-ai/glm-4-32b",
    context_window: 128_000,
    cents_input: 10,
    cents_output: 10,
    default_reasoning: false,
    has_structured_json: false,
  },
  {
    llm_model_name: "glm-4.5@z-ai",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "z-ai/glm-4.5@z-ai/fp8",
    context_window: 128_000,
    cents_input: 60,
    cents_output: 220,
    default_reasoning: true, // we need to confirm
    has_structured_json: false,
  },
  {
    llm_model_name: "gpt-4.1",
    llm_api_code: "openai",
    llm_model_code_direct: "gpt-4.1",
    llm_model_code_openrouter: "openai/gpt-4.1",
    context_window: 1_047_576,
    cents_input: 200,
    cents_output: 800,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "gpt-4.1-mini",
    llm_api_code: "openai",
    llm_model_code_direct: "gpt-4.1-mini",
    llm_model_code_openrouter: "openai/gpt-4.1-mini",
    context_window: 1_047_576,
    cents_input: 40,
    cents_output: 160,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "gpt-4.1-nano",
    llm_api_code: "openai",
    llm_model_code_direct: "gpt-4.1-nano",
    llm_model_code_openrouter: "openai/gpt-4.1-nano",
    context_window: 1_047_576,
    cents_input: 10,
    cents_output: 40,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "gpt-4o",
    llm_api_code: "openai",
    llm_model_code_direct: "gpt-4o-2024-11-20",
    llm_model_code_openrouter: "openai/gpt-4o-2024-11-20",
    context_window: 128_000,
    cents_input: 250,
    cents_output: 1000,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "gpt-4o-mini",
    llm_api_code: "openai",
    llm_model_code_direct: "gpt-4o-mini",
    llm_model_code_openrouter: "openai/gpt-4o-mini-2024-07-18",
    context_window: 128_000,
    cents_input: 15,
    cents_output: 60,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "grok-3",
    llm_api_code: null,
    llm_model_code_direct: "grok-3",
    llm_model_code_openrouter: "x-ai/grok-3",
    context_window: 131_072,
    cents_input: 300,
    cents_output: 1500,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "grok-3-mini",
    llm_api_code: null,
    llm_model_code_direct: "grok-3-mini",
    llm_model_code_openrouter: "x-ai/grok-3-mini",
    context_window: 131_072,
    cents_input: 30,
    cents_output: 50,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "grok-4",
    llm_api_code: null,
    llm_model_code_direct: "grok-4",
    llm_model_code_openrouter: "x-ai/grok-4",
    context_window: 256_000,
    cents_input: 300,
    cents_output: 1500,
    default_reasoning: true,
    has_structured_json: true,
  },
  {
    llm_model_name: "kimi-k2@groq",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "moonshotai/kimi-k2@groq",
    context_window: 131_072,
    cents_input: 100,
    cents_output: 300,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "kimi-k2@moonshotai",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "moonshotai/kimi-k2@moonshotai",
    context_window: 131_072,
    cents_input: 60,
    cents_output: 250,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "llama-4-maverick",
    llm_api_code: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "meta-llama/llama-4-maverick",
    context_window: 1_048_576,
    cents_input: 15,
    cents_output: 60,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "llama-4-scout",
    llm_api_code: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "meta-llama/llama-4-scout",
    context_window: 1_048_576,
    cents_input: 14,
    cents_output: 58,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "mercury",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "inception/mercury",
    context_window: 32_000,
    cents_input: 25,
    cents_output: 100,
    default_reasoning: false,
    has_structured_json: false,
  },
  {
    llm_model_name: "mercury-coder",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "inception/mercury-coder-small-beta",
    context_window: 32_000,
    cents_input: 25,
    cents_output: 100,
    default_reasoning: false,
    has_structured_json: false,
  },
  {
    llm_model_name: "mistral-medium-3",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "mistralai/mistral-medium-3",
    context_window: 131_072,
    cents_input: 40,
    cents_output: 200,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "o3",
    llm_api_code: "openai",
    llm_model_code_direct: "o3", // Your organization needs to be verified
    llm_model_code_openrouter: "openai/o3", // You need your own OpenAI key
    context_window: 200_000,
    cents_input: 200,
    cents_output: 800,
    default_reasoning: true,
    has_structured_json: true,
  },
  {
    llm_model_name: "o3-pro",
    llm_api_code: "openai",
    llm_model_code_direct: "o3-pro", // Your organization needs to be verified
    llm_model_code_openrouter: "openai/o3-pro", // You need your own OpenAI key
    context_window: 200_000,
    cents_input: 2000,
    cents_output: 8000,
    default_reasoning: true,
    has_structured_json: true,
  },
  {
    llm_model_name: "o4-mini",
    llm_api_code: "openai",
    llm_model_code_direct: "o4-mini",
    llm_model_code_openrouter: "openai/o4-mini",
    context_window: 200_000,
    cents_input: 110,
    cents_output: 440,
    default_reasoning: true,
    has_structured_json: true,
  },
  {
    llm_model_name: "qwen3-235b-a22b",
    llm_api_code: null,
    llm_model_code_direct: null,
    llm_model_code_openrouter: "qwen/qwen3-235b-a22b",
    context_window: 40_000,
    cents_input: 20,
    cents_output: 60,
    default_reasoning: true,
    has_structured_json: true,
  },
  {
    llm_model_name: "qwen3-235b-a22b-2507",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "qwen/qwen3-235b-a22b-07-25",
    context_window: 262_144,
    cents_input: 12,
    cents_output: 59,
    default_reasoning: true,
    has_structured_json: true,
  },
  {
    llm_model_name: "qwen3-coder@alibaba",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "qwen/qwen3-coder@alibaba/opensource",
    context_window: 262_144,
    cents_input: 150,
    cents_output: 750,
    default_reasoning: false,
    has_structured_json: true,
  },
  {
    llm_model_name: "qwen3-coder@cerebras",
    llm_api_code: null,
    llm_model_code_direct: null,

    llm_model_code_openrouter: "qwen/qwen3-coder@cerebras/fp8",
    context_window: 131_072,
    cents_input: 200,
    cents_output: 200,
    default_reasoning: false,
    has_structured_json: true,
  },
] as const satisfies Array<LlmModelDetail>

export type LlmModelName = (typeof LLM_MODEL_DETAILS)[number]["llm_model_name"]

export function llm_model_get_details({
  llm_model_names,
}: {
  llm_model_names: Array<LlmModelName>
}): Array<LlmModelDetail> {
  return LLM_MODEL_DETAILS.filter((detail) => llm_model_names.includes(detail.llm_model_name))
}

export function llm_model_get_choices({llm_model_details}: {llm_model_details: Array<LlmModelDetail>}): Array<string> {
  return llm_model_details.map((model) => model.llm_model_name)
}

export function llm_model_find_detail({
  llm_model_details,
  llm_model_name,
}: {
  llm_model_details: Array<LlmModelDetail>
  llm_model_name: string
}): LlmModelDetail {
  for (const detail of llm_model_details) {
    if (detail.llm_model_name === llm_model_name) {
      return detail
    }
  }

  abort_with_error(`Unknown model: ${llm_model_name}`)
}
