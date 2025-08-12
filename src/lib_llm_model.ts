import type {AnthropicProviderOptions} from "@ai-sdk/anthropic"
import type {OpenAIProviderOptions} from "@ai-sdk/openai/internal"
import type {OpenRouterChatSettings} from "@openrouter/ai-sdk-provider/internal"

import {abort_with_error} from "./lib_abort.js"
import type {LlmApiCode} from "./lib_llm_api.js"

type JSONValue = null | string | number | boolean | JSONObject | JSONArray
type JSONArray = Array<JSONValue>
type JSONObject = {
  [key: string]: JSONValue
}

type ProviderOptions = Record<string, Record<string, JSONValue>>

function provider_options_anthropic({thinking}: {thinking: boolean}): ProviderOptions | undefined {
  return thinking
    ? {
        anthropic: {
          thinking: {
            type: "enabled",
            budgetTokens: 1024,
          },
        } satisfies AnthropicProviderOptions,
      }
    : undefined
}

function provider_options_openai({
  reasoning_effort,
}: {
  reasoning_effort: "minimal" | "low" | "medium" | "high"
}): ProviderOptions {
  return {
    openai: {
      reasoningEffort: reasoning_effort,
    } satisfies OpenAIProviderOptions,
  }
}

function provider_options_openrouter({only}: {only: string}): ProviderOptions {
  return {
    openrouter: {
      provider: {
        only: [only],
      },
    } satisfies OpenRouterChatSettings,
  }
}

export type LlmModelDetail = {
  llm_model_name: string
  llm_model_code: string
  llm_api_code: LlmApiCode
  context_window: number
  cents_input: number
  cents_output: number
  default_reasoning: boolean
  has_structured_json: boolean
  recommended_temperature: number | undefined
  provider_options: ProviderOptions | undefined
}

export const LLM_MODEL_DETAILS = [
  {
    llm_model_name: "claude-3.5-haiku",
    llm_model_code: "claude-3-5-haiku-latest",
    llm_api_code: "anthropic",
    context_window: 200_000,
    cents_input: 80,
    cents_output: 400,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: false}),
  },
  {
    llm_model_name: "claude-3.7-sonnet",
    llm_model_code: "claude-3-7-sonnet-latest",
    llm_api_code: "anthropic",
    context_window: 200_000,
    cents_input: 300,
    cents_output: 1500,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: false}),
  },
  {
    llm_model_name: "claude-sonnet-4",
    llm_model_code: "claude-sonnet-4-0",
    llm_api_code: "anthropic",
    context_window: 200_000,
    cents_input: 300,
    cents_output: 1500,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: false}),
  },
  {
    llm_model_name: "claude-sonnet-4-thinking",
    llm_model_code: "claude-sonnet-4-0",
    llm_api_code: "anthropic",
    context_window: 200_000,
    cents_input: 300,
    cents_output: 1500,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: true}),
  },
  {
    llm_model_name: "codestral-2508",
    llm_model_code: "mistralai/codestral-2508",
    llm_api_code: "openrouter",
    context_window: 256_000,
    cents_input: 30,
    cents_output: 90,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "mistral"}),
  },
  {
    llm_model_name: "deepseek-chat",
    llm_model_code: "deepseek-chat",
    llm_api_code: "deepseek",
    context_window: 64_000,
    cents_input: 27,
    cents_output: 110,
    default_reasoning: false,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "deepseek-reasoner",
    llm_model_code: "deepseek-reasoner",
    llm_api_code: "deepseek",
    context_window: 163_840,
    cents_input: 55,
    cents_output: 219,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "devstral-medium",
    llm_model_code: "mistralai/devstral-medium",
    llm_api_code: "openrouter",
    context_window: 128_000,
    cents_input: 40,
    cents_output: 200,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "mistral"}),
  },
  {
    llm_model_name: "devstral-small",
    llm_model_code: "mistralai/devstral-small",
    llm_api_code: "openrouter",
    context_window: 128_000,
    cents_input: 10,
    cents_output: 30,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "mistral"}),
  },
  {
    llm_model_name: "gemini-2.0-flash",
    llm_model_code: "gemini-2.0-flash",
    llm_api_code: "google",
    context_window: 1_048_576,
    cents_input: 10,
    cents_output: 40,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "gemini-2.5-flash",
    llm_model_code: "gemini-2.5-flash",
    llm_api_code: "google",
    context_window: 1_048_576,
    cents_input: 30,
    cents_output: 250,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "gemini-2.5-pro",
    llm_model_code: "gemini-2.5-pro",
    llm_api_code: "google",
    context_window: 1_048_576,
    cents_input: 125,
    cents_output: 1000,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "glm-4-32b@z-ai",
    llm_model_code: "z-ai/glm-4-32b",
    llm_api_code: "openrouter",
    context_window: 128_000,
    cents_input: 10,
    cents_output: 10,
    default_reasoning: false,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "z-ai"}),
  },
  {
    llm_model_name: "glm-4.5@z-ai",
    llm_model_code: "z-ai/glm-4.5",
    llm_api_code: "openrouter",
    context_window: 128_000,
    cents_input: 60,
    cents_output: 220,
    default_reasoning: true,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "z-ai/fp8"}),
  },
  {
    llm_model_name: "glm-4.5-air@z-ai",
    llm_model_code: "z-ai/glm-4.5-air",
    llm_api_code: "openrouter",
    context_window: 128_000,
    cents_input: 20,
    cents_output: 110,
    default_reasoning: true,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "z-ai/fp8"}),
  },
  {
    llm_model_name: "gpt-4.1",
    llm_model_code: "gpt-4.1",
    llm_api_code: "openai",
    context_window: 1_047_576,
    cents_input: 200,
    cents_output: 800,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: 0.6,
    provider_options: undefined,
  },
  {
    llm_model_name: "gpt-4.1-mini",
    llm_model_code: "gpt-4.1-mini",
    llm_api_code: "openai",
    context_window: 1_047_576,
    cents_input: 40,
    cents_output: 160,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: 0.6,
    provider_options: undefined,
  },
  {
    llm_model_name: "gpt-4.1-nano",
    llm_model_code: "gpt-4.1-nano",
    llm_api_code: "openai",
    context_window: 1_047_576,
    cents_input: 10,
    cents_output: 40,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: 0.6,
    provider_options: undefined,
  },
  {
    llm_model_name: "gpt-5",
    llm_model_code: "gpt-5",
    llm_api_code: "openai",
    context_window: 400_000,
    cents_input: 125,
    cents_output: 1000,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "gpt-5-minimal",
    llm_model_code: "gpt-5",
    llm_api_code: "openai",
    context_window: 400_000,
    cents_input: 125,
    cents_output: 1000,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openai({reasoning_effort: "minimal"}),
  },
  {
    llm_model_name: "gpt-5-mini",
    llm_model_code: "gpt-5-mini",
    llm_api_code: "openai",
    context_window: 400_000,
    cents_input: 25,
    cents_output: 200,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "gpt-5-mini-high",
    llm_model_code: "gpt-5-mini",
    llm_api_code: "openai",
    context_window: 400_000,
    cents_input: 25,
    cents_output: 200,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openai({reasoning_effort: "high"}),
  },
  {
    llm_model_name: "gpt-5-mini-low",
    llm_model_code: "gpt-5-mini",
    llm_api_code: "openai",
    context_window: 400_000,
    cents_input: 25,
    cents_output: 200,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openai({reasoning_effort: "low"}),
  },
  {
    llm_model_name: "gpt-5-mini-medium",
    llm_model_code: "gpt-5-mini",
    llm_api_code: "openai",
    context_window: 400_000,
    cents_input: 25,
    cents_output: 200,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openai({reasoning_effort: "medium"}),
  },
  {
    llm_model_name: "gpt-5-mini-minimal",
    llm_model_code: "gpt-5-mini",
    llm_api_code: "openai",
    context_window: 400_000,
    cents_input: 25,
    cents_output: 200,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openai({reasoning_effort: "minimal"}),
  },
  {
    llm_model_name: "gpt-5-nano",
    llm_model_code: "gpt-5-nano",
    llm_api_code: "openai",
    context_window: 400_000,
    cents_input: 5,
    cents_output: 40,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "gpt-5-nano-minimal",
    llm_model_code: "gpt-5-nano",
    llm_api_code: "openai",
    context_window: 400_000,
    cents_input: 5,
    cents_output: 40,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openai({reasoning_effort: "minimal"}),
  },
  {
    llm_model_name: "gpt-oss-120b@cerebras",
    llm_model_code: "openai/gpt-oss-120b",
    llm_api_code: "openrouter",
    context_window: 131_072,
    cents_input: 25,
    cents_output: 69,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "cerebras"}),
  },
  {
    llm_model_name: "gpt-oss-120b@groq",
    llm_model_code: "openai/gpt-oss-120b",
    llm_api_code: "openrouter",
    context_window: 131_072,
    cents_input: 15,
    cents_output: 75,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "groq"}),
  },
  {
    llm_model_name: "grok-3",
    llm_model_code: "x-ai/grok-3",
    llm_api_code: "openrouter",
    context_window: 131_072,
    cents_input: 300,
    cents_output: 1500,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "grok-3-mini",
    llm_model_code: "x-ai/grok-3-mini",
    llm_api_code: "openrouter",
    context_window: 131_072,
    cents_input: 30,
    cents_output: 50,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  // {
  //   llm_model_name: "grok-4",
  //   llm_model_code: "x-ai/grok-4", // BYOK required
  //   llm_api_code: "openrouter",
  //   context_window: 256_000,
  //   cents_input: 300,
  //   cents_output: 1500,
  //   default_reasoning: true,
  //   has_structured_json: true,
  //   recommended_temperature: undefined,
  //   provider_options: undefined,
  // },
  {
    llm_model_name: "kimi-k2@groq",
    llm_model_code: "moonshotai/kimi-k2",
    llm_api_code: "openrouter",
    context_window: 131_072,
    cents_input: 100,
    cents_output: 300,
    default_reasoning: false,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "groq"}),
  },
  {
    llm_model_name: "kimi-k2@moonshotai",
    llm_model_code: "moonshotai/kimi-k2",
    llm_api_code: "openrouter",
    context_window: 131_072,
    cents_input: 60,
    cents_output: 250,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "moonshotai"}),
  },
  {
    llm_model_name: "llama-4-maverick@cerebras",
    llm_model_code: "meta-llama/llama-4-maverick",
    llm_api_code: "openrouter",
    context_window: 32_000,
    cents_input: 20,
    cents_output: 60,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "cerebras"}),
  },
  {
    llm_model_name: "llama-4-scout@cerebras",
    llm_model_code: "meta-llama/llama-4-scout",
    llm_api_code: "openrouter",
    context_window: 32_000,
    cents_input: 65,
    cents_output: 85,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "cerebras"}),
  },
  {
    llm_model_name: "mercury",
    llm_model_code: "inception/mercury",
    llm_api_code: "openrouter",
    context_window: 32_000,
    cents_input: 25,
    cents_output: 100,
    default_reasoning: false,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "mercury-coder",
    llm_model_code: "inception/mercury-coder-small-beta",
    llm_api_code: "openrouter",
    context_window: 32_000,
    cents_input: 25,
    cents_output: 100,
    default_reasoning: false,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "mistral-medium-3",
    llm_model_code: "mistralai/mistral-medium-3",
    llm_api_code: "openrouter",
    context_window: 131_072,
    cents_input: 40,
    cents_output: 200,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "mistral"}),
  },
  {
    llm_model_name: "qwen3-235b-a22b-2507-instruct@cerebras",
    llm_model_code: "qwen/qwen3-235b-a22b-2507",
    llm_api_code: "openrouter",
    context_window: 262_144,
    cents_input: 60,
    cents_output: 120,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "cerebras"}),
  },
  {
    llm_model_name: "qwen3-235b-a22b-2507-thinking@cerebras",
    llm_model_code: "qwen/qwen3-235b-a22b-thinking-2507",
    llm_api_code: "openrouter",
    context_window: 262_144,
    cents_input: 60,
    cents_output: 120,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "cerebras"}),
  },
  {
    llm_model_name: "qwen3-coder@alibaba",
    llm_model_code: "qwen/qwen3-coder",
    llm_api_code: "openrouter",
    context_window: 262_144,
    cents_input: 150,
    cents_output: 750,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "alibaba/opensource"}),
  },
  {
    llm_model_name: "qwen3-coder@cerebras",
    llm_model_code: "qwen/qwen3-coder",
    llm_api_code: "openrouter",
    context_window: 131_072,
    cents_input: 200,
    cents_output: 200,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "cerebras"}),
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
