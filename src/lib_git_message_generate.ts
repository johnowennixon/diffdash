import {Duration} from "./lib_duration.js"
import {error_get_text} from "./lib_error.js"
import type {GitMessagePromptInputs} from "./lib_git_message_prompt.js"
import {git_message_prompt_get_system, git_message_prompt_get_user} from "./lib_git_message_prompt.js"
import {git_message_schema, git_message_schema_format} from "./lib_git_message_schema.js"
import type {LlmChatGenerateTextOutputs, LlmChatGenerateTextResult} from "./lib_llm_chat.js"
import {llm_chat_generate_object, llm_chat_generate_text} from "./lib_llm_chat.js"
import type {LlmConfig} from "./lib_llm_config.js"
import {
  llm_tokens_debug_usage,
  llm_tokens_estimate_length_from_tokens,
  llm_tokens_estimate_tokens_from_length,
} from "./lib_llm_tokens.js"

async function git_message_generate_unstructured({
  llm_config,
  system_prompt,
  user_prompt,
  max_output_tokens,
}: {
  llm_config: LlmConfig
  system_prompt: string
  user_prompt: string
  max_output_tokens: number
}): Promise<LlmChatGenerateTextOutputs> {
  const outputs = await llm_chat_generate_text({llm_config, system_prompt, user_prompt, max_output_tokens})

  return outputs
}

async function git_message_generate_structured({
  llm_config,
  system_prompt,
  user_prompt,
  max_output_tokens,
}: {
  llm_config: LlmConfig
  system_prompt: string
  user_prompt: string
  max_output_tokens: number
}): Promise<LlmChatGenerateTextOutputs> {
  const schema = git_message_schema

  const {generated_object, total_usage, provider_metadata} = await llm_chat_generate_object({
    llm_config,
    system_prompt,
    user_prompt,
    max_output_tokens,
    schema,
  })

  const generated_text = git_message_schema_format(generated_object)

  return {generated_text, reasoning_text: undefined, total_usage, provider_metadata}
}

async function git_message_generate_outputs({
  llm_config,
  inputs,
}: {
  llm_config: LlmConfig
  inputs: GitMessagePromptInputs
}): Promise<LlmChatGenerateTextOutputs> {
  const {effective_context_window} = llm_config
  const {has_structured_json} = llm_config.llm_model_detail

  const system_prompt = git_message_prompt_get_system({has_structured_json, inputs})

  const user_tokens =
    effective_context_window - llm_tokens_estimate_tokens_from_length({llm_config, length: system_prompt.length}) - 1000

  const user_length = llm_tokens_estimate_length_from_tokens({llm_config, tokens: user_tokens})

  const user_prompt = git_message_prompt_get_user({
    has_structured_json,
    inputs,
    max_length: user_length,
  })

  const max_output_tokens = 8192 // This is the maximum for some models

  llm_tokens_debug_usage({name: "Inputs", llm_config, text: system_prompt + user_prompt})

  const outputs = has_structured_json
    ? await git_message_generate_structured({llm_config, system_prompt, user_prompt, max_output_tokens})
    : await git_message_generate_unstructured({llm_config, system_prompt, user_prompt, max_output_tokens})

  llm_tokens_debug_usage({name: "Outputs", llm_config, text: outputs.generated_text})

  return outputs
}

export type GitMessageGenerateResult = LlmChatGenerateTextResult

export async function git_message_generate_result({
  llm_config,
  inputs,
}: {
  llm_config: LlmConfig
  inputs: GitMessagePromptInputs
}): Promise<GitMessageGenerateResult> {
  const duration = new Duration()
  duration.start()

  try {
    const outputs = await git_message_generate_outputs({llm_config, inputs})

    duration.stop()
    const seconds = duration.seconds_rounded()

    return {llm_config, seconds, error_text: null, outputs}
  } catch (error) {
    duration.stop()
    const seconds = duration.seconds_rounded()

    const error_text = error_get_text(error)
    return {llm_config, seconds, error_text, outputs: null}
  }
}
