import type {ToolSet} from "ai"
import {generateObject, generateText} from "ai"
import type {ZodType} from "zod"

import {debug_channels, debug_inspect_when} from "./lib_debug.js"
import {Duration} from "./lib_duration.js"
import {env_get_empty, env_get_substitute} from "./lib_env.js"
import {error_get_text} from "./lib_error.js"
import {llm_api_get_ai_sdk_language_model} from "./lib_llm_api.js"
import type {LlmConfig} from "./lib_llm_config.js"
import {parse_float_or_undefined, parse_int, parse_int_or_undefined} from "./lib_parse_number.js"
import {tell_debug} from "./lib_tell.js"
import {tui_block_string} from "./lib_tui_block.js"

type LlmChatParameters = {
  max_tokens: number | undefined
  temperature: number | undefined
  timeout: number
}

function llm_chat_get_parameters(): LlmChatParameters {
  return {
    max_tokens: parse_int_or_undefined(env_get_empty("lib_llm_chat_max_tokens")),
    temperature: parse_float_or_undefined(env_get_substitute("lib_llm_chat_temperature", "0.6")),
    timeout: parse_int(env_get_substitute("lib_llm_chat_timeout", "60")),
  }
}

function llm_chat_debug_prompts({
  llm_model_name,
  system_prompt,
  user_prompt,
}: {
  llm_model_name: string
  system_prompt: string | undefined
  user_prompt: string
}): void {
  if (debug_channels.llm_prompts) {
    const teller = tell_debug

    if (system_prompt) {
      tui_block_string({teller, title: `LLM system prompt (for ${llm_model_name}):`, content: system_prompt})
    }
    tui_block_string({teller, title: `LLM user prompt (for ${llm_model_name}):`, content: user_prompt})
  }
}

export async function llm_chat_generate_text({
  llm_config,
  headers,
  system_prompt,
  user_prompt,
  tools,
  max_steps,
  min_steps,
}: {
  llm_config: LlmConfig
  headers?: Record<string, string | undefined>
  system_prompt?: string | undefined
  user_prompt: string
  tools?: ToolSet
  max_steps?: number
  min_steps?: number
}): Promise<string> {
  const {llm_model_name, llm_api_code, llm_model_code, llm_api_key} = llm_config

  llm_chat_debug_prompts({system_prompt, user_prompt, llm_model_name})

  const ai_sdk_language_model = llm_api_get_ai_sdk_language_model({
    llm_model_code,
    llm_api_code,
    llm_api_key,
  })

  const {max_tokens, temperature, timeout} = llm_chat_get_parameters()

  const llm_inputs = {
    model: ai_sdk_language_model,
    system: system_prompt,
    prompt: user_prompt,
    tools,
    headers,
    maxSteps: max_steps,
    maxTokens: max_tokens,
    temperature,
    abortSignal: AbortSignal.timeout(timeout * 1000),
  }

  debug_inspect_when(debug_channels.llm_inputs, llm_inputs, `LLM inputs object (for ${llm_model_name})`)

  // This is liable to throw an error
  const llm_outputs = await generateText(llm_inputs)

  debug_inspect_when(debug_channels.llm_outputs, llm_outputs, `LLM outputs object (for ${llm_model_name})`)

  if (min_steps !== undefined && llm_outputs.steps.length < min_steps) {
    throw new Error("Too few steps taken")
  }

  if (max_steps !== undefined && llm_outputs.steps.length === max_steps) {
    throw new Error("Too many steps taken")
  }

  return llm_outputs.text
}

type LlmChatGenerateSucceeded = {
  llm_config: LlmConfig
  seconds: number
  llm_response_text: string
  error_text: null
}

type LlmChatGenerateFailed = {
  llm_config: LlmConfig
  seconds: number
  llm_response_text: null
  error_text: string
}

export type LlmChatGenerateResult = LlmChatGenerateSucceeded | LlmChatGenerateFailed

export async function llm_chat_generate_result({
  llm_config,
  system_prompt,
  user_prompt,
}: {
  llm_config: LlmConfig
  system_prompt?: string | undefined
  user_prompt: string
}): Promise<LlmChatGenerateResult> {
  const duration = new Duration()
  duration.start()

  try {
    const llm_response_text = await llm_chat_generate_text({llm_config, system_prompt, user_prompt})

    duration.stop()
    const seconds = duration.seconds_rounded()

    return {llm_config, seconds, llm_response_text, error_text: null}
  } catch (error) {
    duration.stop()
    const seconds = duration.seconds_rounded()

    const error_text = error_get_text(error)
    return {llm_config, seconds, llm_response_text: null, error_text}
  }
}

export async function llm_chat_generate_object<T>({
  llm_config,
  user_prompt,
  system_prompt,
  schema,
}: {
  llm_config: LlmConfig
  user_prompt: string
  system_prompt: string | undefined
  schema: ZodType<T>
}): Promise<T> {
  const {llm_model_name, llm_api_code, llm_model_code, llm_api_key} = llm_config

  llm_chat_debug_prompts({system_prompt, user_prompt, llm_model_name})

  const ai_sdk_language_model = llm_api_get_ai_sdk_language_model({
    llm_model_code,
    llm_api_code,
    llm_api_key,
  })

  const {max_tokens, temperature, timeout} = llm_chat_get_parameters()

  const llm_inputs = {
    model: ai_sdk_language_model,
    system: system_prompt,
    prompt: user_prompt,
    output: "object" as const,
    schema,
    maxTokens: max_tokens,
    temperature,
    abortSignal: AbortSignal.timeout(timeout * 1000),
  }

  debug_inspect_when(debug_channels.llm_inputs, llm_inputs, `LLM inputs object (for ${llm_model_name})`)

  // This is liable to throw an error
  const llm_outputs = await generateObject(llm_inputs)

  debug_inspect_when(debug_channels.llm_outputs, llm_outputs, `LLM outputs object (for ${llm_model_name})`)

  return llm_outputs.object
}
