import {Duration} from "./lib_duration.js"
import {error_get_text} from "./lib_error.js"
import type {GitMessagePromptInputs} from "./lib_git_message_prompt.js"
import {git_message_get_system_prompt, git_message_get_user_prompt} from "./lib_git_message_prompt.js"
import {git_message_schema, git_message_schema_format} from "./lib_git_message_schema.js"
import type {LlmChatGenerateTextOutputs, LlmChatGenerateTextResult} from "./lib_llm_chat.js"
import {llm_chat_generate_object, llm_chat_generate_text} from "./lib_llm_chat.js"
import type {LlmConfig} from "./lib_llm_config.js"
import {llm_tokens_count_estimated, llm_tokens_debug_usage} from "./lib_llm_tokens.js"

async function git_message_generate_unstructured({
  llm_config,
  system_prompt,
  user_prompt,
}: {
  llm_config: LlmConfig
  system_prompt: string
  user_prompt: string
}): Promise<LlmChatGenerateTextOutputs> {
  const outputs = await llm_chat_generate_text({llm_config, system_prompt, user_prompt})

  return outputs
}

async function git_message_generate_structured({
  llm_config,
  system_prompt,
  user_prompt,
}: {
  llm_config: LlmConfig
  system_prompt: string
  user_prompt: string
}): Promise<LlmChatGenerateTextOutputs> {
  const schema = git_message_schema

  const {generated_object, total_usage, provider_metadata} = await llm_chat_generate_object({
    llm_config,
    system_prompt,
    user_prompt,
    schema,
  })

  const generated_text = git_message_schema_format(generated_object)

  return {generated_text, reasoning_text: undefined, total_usage, provider_metadata}
}

export async function git_message_generate_string({
  llm_config,
  inputs,
}: {
  llm_config: LlmConfig
  inputs: GitMessagePromptInputs
}): Promise<LlmChatGenerateTextOutputs> {
  const {effective_context_window} = llm_config
  const {has_structured_json} = llm_config.llm_model_detail

  const system_prompt = git_message_get_system_prompt({has_structured_json, inputs})

  const user_tokens = effective_context_window - llm_tokens_count_estimated({llm_config, text: system_prompt}) - 1000
  const user_length = Math.floor(user_tokens * 3)

  const user_prompt = git_message_get_user_prompt({
    has_structured_json,
    inputs,
    max_length: user_length,
  })

  llm_tokens_debug_usage({name: "Inputs", llm_config, text: system_prompt + user_prompt})

  const outputs = has_structured_json
    ? await git_message_generate_structured({llm_config, system_prompt, user_prompt})
    : await git_message_generate_unstructured({llm_config, system_prompt, user_prompt})

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
    const outputs = await git_message_generate_string({llm_config, inputs})

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
