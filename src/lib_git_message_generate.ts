import * as lib_git_message_prompt from "./lib_git_message_prompt.js"
import type {GitMessagePromptInputs} from "./lib_git_message_prompt.js"
import * as lib_git_message_schema from "./lib_git_message_schema.js"
import * as lib_git_message_ui from "./lib_git_message_ui.js"
import * as lib_llm_chat from "./lib_llm_chat.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_tokens from "./lib_llm_tokens.js"

export default {}

async function generate_message_unstructured({
  llm_config,
  system_prompt,
  user_prompt,
}: {llm_config: LlmConfig; system_prompt: string; user_prompt: string}): Promise<string> {
  const llm_response_text = await lib_llm_chat.llm_generate_text({llm_config, system_prompt, user_prompt})

  return llm_response_text
}

async function generate_message_structured({
  llm_config,
  system_prompt,
  user_prompt,
}: {llm_config: LlmConfig; system_prompt: string; user_prompt: string}): Promise<string> {
  const schema = lib_git_message_schema.git_commit_message_schema

  const llm_response_structured = await lib_llm_chat.llm_generate_object({
    llm_config,
    system_prompt,
    user_prompt,
    schema,
  })

  const llm_response_text = lib_git_message_schema.format_git_commit_message(llm_response_structured)

  return llm_response_text
}

export async function generate_message({
  llm_config,
  inputs,
}: {llm_config: LlmConfig; inputs: GitMessagePromptInputs}): Promise<string> {
  const {context_window, has_structured_json} = llm_config.llm_model_detail

  const system_prompt = lib_git_message_prompt.get_system_prompt({has_structured_json})

  // Estimate remaining prompt length
  const user_tokens = context_window - lib_llm_tokens.count_tokens_estimated({llm_config, text: system_prompt}) - 1000
  const user_length = user_tokens * 3

  const user_prompt = lib_git_message_prompt.get_user_prompt({has_structured_json, inputs, max_length: user_length})

  lib_git_message_ui.debug_token_usage({name: "Inputs", llm_config, text: system_prompt + user_prompt})

  const llm_response_text = has_structured_json
    ? await generate_message_structured({llm_config, system_prompt, user_prompt})
    : await generate_message_unstructured({llm_config, system_prompt, user_prompt})

  lib_git_message_ui.debug_token_usage({name: "Outputs", llm_config, text: llm_response_text})

  return llm_response_text
}
