import {generateObject, generateText} from "ai"
import type {ToolSet} from "ai"
import type {ZodType} from "zod"

import {debug_channels, debug_inspect_when} from "./lib_debug.js"
import {env_get_empty, env_get_substitute} from "./lib_env.js"
import type {LlmConfig} from "./lib_llm_config.js"
import {llm_provider_get_ai_sdk_language_model} from "./lib_llm_provider.js"
import {parse_float_or_undefined, parse_int, parse_int_or_undefined} from "./lib_parse_number.js"

export default {}

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

export async function llm_chat_generate_text({
  llm_config,
  system_prompt,
  user_prompt,
  tools,
  max_steps,
  min_steps,
}: {
  llm_config: LlmConfig
  system_prompt: string
  user_prompt: string
  tools?: ToolSet
  max_steps?: number
  min_steps?: number
}): Promise<string> {
  const {llm_model_name, llm_provider, llm_model_code, llm_api_key} = llm_config

  const ai_sdk_language_model = llm_provider_get_ai_sdk_language_model({
    llm_model_code,
    llm_provider,
    llm_api_key,
  })

  const {max_tokens, temperature, timeout} = llm_chat_get_parameters()

  const llm_inputs = {
    model: ai_sdk_language_model,
    system: system_prompt,
    prompt: user_prompt,
    tools,
    maxSteps: max_steps,
    maxTokens: max_tokens,
    temperature,
    abortSignal: AbortSignal.timeout(timeout * 1000),
  }

  debug_inspect_when(debug_channels.llm_inputs, llm_inputs, `llm_inputs (for ${llm_model_name})`)

  // This is liable to throw an error
  const llm_outputs = await generateText(llm_inputs)

  debug_inspect_when(debug_channels.llm_outputs, llm_outputs, `llm_outputs (for ${llm_model_name})`)

  if (min_steps !== undefined && llm_outputs.steps.length < min_steps) {
    throw new Error("Too few steps taken")
  }

  if (max_steps !== undefined && llm_outputs.steps.length === max_steps) {
    throw new Error("Too many steps taken")
  }

  return llm_outputs.text
}

export async function llm_chat_generate_object<T>({
  llm_config,
  user_prompt,
  system_prompt,
  schema,
}: {llm_config: LlmConfig; user_prompt: string; system_prompt: string; schema: ZodType<T>}): Promise<T> {
  const {llm_model_name, llm_provider, llm_model_code, llm_api_key} = llm_config

  const ai_sdk_language_model = llm_provider_get_ai_sdk_language_model({
    llm_model_code,
    llm_provider,
    llm_api_key,
  })

  const {max_tokens, temperature, timeout} = llm_chat_get_parameters()

  const llm_inputs = {
    model: ai_sdk_language_model,
    system: system_prompt,
    prompt: user_prompt,
    schema,
    maxTokens: max_tokens,
    temperature,
    abortSignal: AbortSignal.timeout(timeout * 1000),
  }

  debug_inspect_when(debug_channels.llm_inputs, llm_inputs, `llm_inputs (for ${llm_model_name})`)

  // This is liable to throw an error
  const llm_outputs = await generateObject<T>(llm_inputs)

  debug_inspect_when(debug_channels.llm_outputs, llm_outputs, `llm_outputs (for ${llm_model_name})`)

  return llm_outputs.object
}
