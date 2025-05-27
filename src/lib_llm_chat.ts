import {generateObject, generateText} from "ai"
import type {ToolSet} from "ai"
import type {ZodType} from "zod"

import * as lib_debug from "./lib_debug.js"
import * as lib_env from "./lib_env.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_provider from "./lib_llm_provider.js"
import * as lib_parse_number from "./lib_parse_number.js"

export default {}

function get_llm_parameters(): {max_tokens: number | undefined; temperature: number | undefined; timeout: number} {
  return {
    max_tokens: lib_parse_number.parse_int_or_undefined(lib_env.get_empty("lib_llm_chat_max_tokens")),
    temperature: lib_parse_number.parse_float_or_undefined(lib_env.get_substitute("lib_llm_chat_temperature", "0.5")),
    timeout: Number.parseInt(lib_env.get_substitute("lib_llm_chat_timeout", "30")),
  }
}

export async function llm_generate_text({
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

  const ai_sdk_language_model = lib_llm_provider.get_ai_sdk_language_model({
    llm_model_code,
    llm_provider,
    llm_api_key,
  })

  const {max_tokens, temperature, timeout} = get_llm_parameters()

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

  lib_debug.inspect_when(lib_debug.channels.llm_inputs, llm_inputs, `llm_inputs (for ${llm_model_name})`)

  // This is liable to throw an error
  const llm_outputs = await generateText(llm_inputs)

  lib_debug.inspect_when(lib_debug.channels.llm_outputs, llm_outputs, `llm_outputs (for ${llm_model_name})`)

  if (min_steps !== undefined && llm_outputs.steps.length < min_steps) {
    throw new Error("Too few steps taken")
  }

  if (max_steps !== undefined && llm_outputs.steps.length === max_steps) {
    throw new Error("Too many steps taken")
  }

  return llm_outputs.text
}

export async function llm_generate_object<T>({
  llm_config,
  user_prompt,
  system_prompt,
  schema,
}: {llm_config: LlmConfig; user_prompt: string; system_prompt: string; schema: ZodType<T>}): Promise<T> {
  const {llm_model_name, llm_provider, llm_model_code, llm_api_key} = llm_config

  const ai_sdk_language_model = lib_llm_provider.get_ai_sdk_language_model({
    llm_model_code,
    llm_provider,
    llm_api_key,
  })

  const {max_tokens, temperature, timeout} = get_llm_parameters()

  const llm_inputs = {
    model: ai_sdk_language_model,
    system: system_prompt,
    prompt: user_prompt,
    schema,
    maxTokens: max_tokens,
    temperature,
    abortSignal: AbortSignal.timeout(timeout * 1000),
  }

  lib_debug.inspect_when(lib_debug.channels.llm_inputs, llm_inputs, `llm_inputs (for ${llm_model_name})`)

  // This is liable to throw an error
  const llm_outputs = await generateObject<T>(llm_inputs)

  lib_debug.inspect_when(lib_debug.channels.llm_outputs, llm_outputs, `llm_outputs (for ${llm_model_name})`)

  return llm_outputs.object
}
