import type {AnthropicProviderOptions} from "@ai-sdk/anthropic"
import type {GoogleGenerativeAIProviderOptions} from "@ai-sdk/google"
import type {OpenAIChatLanguageModelOptions} from "@ai-sdk/openai"
import type {OpenRouterChatSettings} from "@openrouter/ai-sdk-provider/internal"

import {abort_with_error} from "./lib_abort.js"
import {enabled_from_env} from "./lib_enabled.js"
import type {LlmApiCode} from "./lib_llm_api.js"

function context_window_openai({tier1, unrestricted}: {tier1: number; unrestricted: number}): number {
  return enabled_from_env("LLM_MODEL_OPENAI_UNRESTRICTED") ? unrestricted : tier1
}

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

function provider_options_google({thinking_level}: {thinking_level: "high" | "low"}): ProviderOptions | undefined {
  return {
    google: {
      thinkingConfig: {
        thinkingLevel: thinking_level,
      },
    } satisfies GoogleGenerativeAIProviderOptions,
  }
}

function provider_options_openai({
  reasoning_effort,
}: {
  reasoning_effort: "minimal" | "low" | "medium" | "high"
}): ProviderOptions {
  return {
    openai: {
      reasoningEffort: reasoning_effort,
    } satisfies OpenAIChatLanguageModelOptions,
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
  max_output_tokens: number
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
    max_output_tokens: 8192,
    cents_input: 80,
    cents_output: 400,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: false}),
  },
  {
    llm_model_name: "claude-haiku-4.5",
    llm_model_code: "claude-haiku-4-5",
    llm_api_code: "anthropic",
    context_window: 200_000,
    max_output_tokens: 64_000,
    cents_input: 100,
    cents_output: 500,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: false}),
  },
  {
    llm_model_name: "claude-opus-4.5",
    llm_model_code: "claude-opus-4-5",
    llm_api_code: "anthropic",
    context_window: 200_000,
    max_output_tokens: 64_000,
    cents_input: 300, // for input tokens <= 200K
    cents_output: 1500, // for input tokens <= 200K
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: false}),
  },
  {
    llm_model_name: "claude-opus-4.5-thinking",
    llm_model_code: "claude-opus-4-5",
    llm_api_code: "anthropic",
    context_window: 200_000,
    max_output_tokens: 64_000 - 1024,
    cents_input: 300, // for input tokens <= 200K
    cents_output: 1500, // for input tokens <= 200K
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: true}),
  },
  {
    llm_model_name: "claude-opus-4.6",
    llm_model_code: "claude-opus-4-6",
    llm_api_code: "anthropic",
    context_window: 200_000,
    max_output_tokens: 64_000,
    cents_input: 300, // for input tokens <= 200K
    cents_output: 1500, // for input tokens <= 200K
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: false}),
  },
  {
    llm_model_name: "claude-opus-4.6-thinking",
    llm_model_code: "claude-opus-4-6",
    llm_api_code: "anthropic",
    context_window: 200_000,
    max_output_tokens: 64_000 - 1024,
    cents_input: 300, // for input tokens <= 200K
    cents_output: 1500, // for input tokens <= 200K
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: true}),
  },
  {
    llm_model_name: "claude-sonnet-4",
    llm_model_code: "claude-sonnet-4-0",
    llm_api_code: "anthropic",
    context_window: 200_000,
    max_output_tokens: 64_000,
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
    max_output_tokens: 62_976, // = 64000 - 1024 used for reasoning
    cents_input: 300,
    cents_output: 1500,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: true}),
  },
  {
    llm_model_name: "claude-sonnet-4.5",
    llm_model_code: "claude-sonnet-4-5",
    llm_api_code: "anthropic",
    context_window: 200_000, // 1_000_000 available with context-1m beta header
    max_output_tokens: 64_000,
    cents_input: 300, // for input tokens <= 200K
    cents_output: 1500, // for input tokens <= 200K
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: false}),
  },
  {
    llm_model_name: "claude-sonnet-4.5-thinking",
    llm_model_code: "claude-sonnet-4-5",
    llm_api_code: "anthropic",
    context_window: 200_000, // 1_000_000 available with context-1m beta header
    max_output_tokens: 62_976, // = 64000 - 1024 used for reasoning
    cents_input: 300, // for input tokens <= 200K
    cents_output: 1500, // for input tokens <= 200K
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_anthropic({thinking: true}),
  },
  {
    llm_model_name: "deepseek-chat",
    llm_model_code: "deepseek-chat",
    llm_api_code: "deepseek",
    context_window: 128_000,
    max_output_tokens: 8192,
    cents_input: 56,
    cents_output: 168,
    default_reasoning: false,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "deepseek-reasoner",
    llm_model_code: "deepseek-reasoner",
    llm_api_code: "deepseek",
    context_window: 128_000,
    max_output_tokens: 65_536,
    cents_input: 56,
    cents_output: 168,
    default_reasoning: true,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "devstral-medium",
    llm_model_code: "mistralai/devstral-medium",
    llm_api_code: "openrouter",
    context_window: 128_000,
    max_output_tokens: 128_000,
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
    max_output_tokens: 128_000,
    cents_input: 10,
    cents_output: 30,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "mistral"}),
  },
  {
    llm_model_name: "gemini-2.5-flash",
    llm_model_code: "gemini-2.5-flash",
    llm_api_code: "google",
    context_window: 1_048_576,
    max_output_tokens: 65_536,
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
    max_output_tokens: 65_536,
    cents_input: 125,
    cents_output: 1000,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "gemini-3-flash-preview-high",
    llm_model_code: "gemini-3-flash-preview",
    llm_api_code: "google",
    context_window: 1_048_576,
    max_output_tokens: 65_536,
    cents_input: 50,
    cents_output: 300,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_google({thinking_level: "high"}),
  },
  {
    llm_model_name: "gemini-3-flash-preview-low",
    llm_model_code: "gemini-3-flash-preview",
    llm_api_code: "google",
    context_window: 1_048_576,
    max_output_tokens: 65_536,
    cents_input: 50,
    cents_output: 300,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_google({thinking_level: "low"}),
  },
  {
    llm_model_name: "gemini-3-pro-preview-high",
    llm_model_code: "gemini-3-pro-preview",
    llm_api_code: "google",
    context_window: 1_048_576,
    max_output_tokens: 65_536,
    cents_input: 200,
    cents_output: 1200,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_google({thinking_level: "high"}),
  },
  {
    llm_model_name: "gemini-3-pro-preview-low",
    llm_model_code: "gemini-3-pro-preview",
    llm_api_code: "google",
    context_window: 1_048_576,
    max_output_tokens: 65_536,
    cents_input: 200,
    cents_output: 1200,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_google({thinking_level: "low"}),
  },
  {
    llm_model_name: "glm-4.7@z-ai",
    llm_model_code: "z-ai/glm-4.7",
    llm_api_code: "openrouter",
    context_window: 200_000,
    max_output_tokens: 131_072,
    cents_input: 60,
    cents_output: 220,
    default_reasoning: true,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "z-ai"}),
  },
  {
    llm_model_name: "glm-4.7-flash@z-ai",
    llm_model_code: "z-ai/glm-4.7-flash",
    llm_api_code: "openrouter",
    context_window: 200_000,
    max_output_tokens: 131_072,
    cents_input: 7,
    cents_output: 40,
    default_reasoning: true,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "z-ai"}),
  },
  {
    llm_model_name: "gpt-4.1",
    llm_model_code: "gpt-4.1",
    llm_api_code: "openai",
    context_window: context_window_openai({tier1: 200_000, unrestricted: 1_000_000}),
    max_output_tokens: 32_768,
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
    context_window: context_window_openai({tier1: 400_000, unrestricted: 1_000_000}),
    max_output_tokens: 32_768,
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
    context_window: context_window_openai({tier1: 400_000, unrestricted: 1_000_000}),
    max_output_tokens: 32_768,
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
    context_window: context_window_openai({tier1: 30_000, unrestricted: 272_000}),
    max_output_tokens: 128_000,
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
    context_window: context_window_openai({tier1: 30_000, unrestricted: 272_000}),
    max_output_tokens: 128_000,
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
    context_window: context_window_openai({tier1: 200_000, unrestricted: 272_000}),
    max_output_tokens: 128_000,
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
    context_window: context_window_openai({tier1: 200_000, unrestricted: 272_000}),
    max_output_tokens: 128_000,
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
    context_window: context_window_openai({tier1: 200_000, unrestricted: 272_000}),
    max_output_tokens: 128_000,
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
    context_window: context_window_openai({tier1: 200_000, unrestricted: 272_000}),
    max_output_tokens: 128_000,
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
    context_window: context_window_openai({tier1: 200_000, unrestricted: 272_000}),
    max_output_tokens: 128_000,
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
    context_window: context_window_openai({tier1: 200_000, unrestricted: 272_000}),
    max_output_tokens: 128_000,
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
    context_window: context_window_openai({tier1: 200_000, unrestricted: 272_000}),
    max_output_tokens: 128_000,
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
    max_output_tokens: 32_768,
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
    max_output_tokens: 65_536,
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
    max_output_tokens: 131_072,
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
    max_output_tokens: 131_072,
    cents_input: 30,
    cents_output: 50,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "grok-4",
    llm_model_code: "x-ai/grok-4",
    llm_api_code: "openrouter",
    context_window: 256_000,
    max_output_tokens: 256_000,
    cents_input: 300,
    cents_output: 1500,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "grok-4-fast",
    llm_model_code: "x-ai/grok-4-fast",
    llm_api_code: "openrouter",
    context_window: 2_000_000,
    max_output_tokens: 30_000,
    cents_input: 20, // for input tokens <= 128K
    cents_output: 50, // for input tokens <= 128K
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "grok-code-fast-1",
    llm_model_code: "x-ai/grok-code-fast-1",
    llm_api_code: "openrouter",
    context_window: 256_000,
    max_output_tokens: 10_000,
    cents_input: 20,
    cents_output: 150,
    default_reasoning: true,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "kimi-k2-0711@moonshotai",
    llm_model_code: "moonshotai/kimi-k2",
    llm_api_code: "openrouter",
    context_window: 131_072,
    max_output_tokens: 131_072,
    cents_input: 60,
    cents_output: 250,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "moonshotai"}),
  },
  {
    llm_model_name: "kimi-k2-0905@groq",
    llm_model_code: "moonshotai/kimi-k2-0905",
    llm_api_code: "openrouter",
    context_window: 262_144,
    max_output_tokens: 16_384,
    cents_input: 100,
    cents_output: 300,
    default_reasoning: false,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "groq"}),
  },
  {
    llm_model_name: "kimi-k2.5",
    llm_model_code: "moonshotai/kimi-k2.5",
    llm_api_code: "openrouter",
    context_window: 131_072,
    max_output_tokens: 131_072,
    cents_input: 60,
    cents_output: 300,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "moonshotai"}),
  },
  {
    llm_model_name: "llama-4-maverick@groq",
    llm_model_code: "meta-llama/llama-4-maverick",
    llm_api_code: "openrouter",
    context_window: 131_072,
    max_output_tokens: 8192,
    cents_input: 20,
    cents_output: 60,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "groq"}),
  },
  {
    llm_model_name: "llama-4-scout@groq",
    llm_model_code: "meta-llama/llama-4-scout",
    llm_api_code: "openrouter",
    context_window: 131_072,
    max_output_tokens: 8192,
    cents_input: 11,
    cents_output: 34,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "groq"}),
  },
  {
    llm_model_name: "longcat-flash",
    llm_model_code: "meituan/longcat-flash-chat",
    llm_api_code: "openrouter",
    context_window: 131_072,
    max_output_tokens: 131_072,
    cents_input: 15,
    cents_output: 75,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "mercury",
    llm_model_code: "inception/mercury",
    llm_api_code: "openrouter",
    context_window: 128_000,
    max_output_tokens: 16_384,
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
    context_window: 128_000,
    max_output_tokens: 16_384,
    cents_input: 25,
    cents_output: 100,
    default_reasoning: false,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: undefined,
  },
  {
    llm_model_name: "minimax-m2.1",
    llm_model_code: "minimax/minimax-m2.1",
    llm_api_code: "openrouter",
    context_window: 204_800,
    max_output_tokens: 131_072,
    cents_input: 30,
    cents_output: 120,
    default_reasoning: false,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "minimax"}),
  },
  {
    llm_model_name: "minimax-m2.5",
    llm_model_code: "minimax/minimax-m2.5",
    llm_api_code: "openrouter",
    context_window: 204_800,
    max_output_tokens: 131_072,
    cents_input: 30,
    cents_output: 120,
    default_reasoning: false,
    has_structured_json: false,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "minimax"}),
  },
  {
    llm_model_name: "mistral-medium-3.1",
    llm_model_code: "mistralai/mistral-medium-3.1",
    llm_api_code: "openrouter",
    context_window: 131_072,
    max_output_tokens: 131_072,
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
    context_window: 131_072,
    max_output_tokens: 131_072,
    cents_input: 60,
    cents_output: 120,
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "cerebras"}),
  },
  {
    llm_model_name: "qwen3-coder@alibaba",
    llm_model_code: "qwen/qwen3-coder",
    llm_api_code: "openrouter",
    context_window: 262_144,
    max_output_tokens: 65_536,
    cents_input: 150, // for input tokens <= 128K
    cents_output: 750, // for input tokens <= 128K
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "alibaba/opensource"}),
  },
  {
    llm_model_name: "qwen-plus@alibaba",
    llm_model_code: "qwen/qwen-plus-2025-07-28",
    llm_api_code: "openrouter",
    context_window: 1_000_000,
    max_output_tokens: 32_768,
    cents_input: 40, // for input tokens <= 256K
    cents_output: 120, // for input tokens <= 256K
    default_reasoning: false,
    has_structured_json: true,
    recommended_temperature: undefined,
    provider_options: provider_options_openrouter({only: "alibaba"}),
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
