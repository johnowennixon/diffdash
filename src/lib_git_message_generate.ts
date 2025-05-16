import * as lib_git_message_prompt from "./lib_git_message_prompt.js"
import type {GitMessagePromptInputs} from "./lib_git_message_prompt.js"
import * as lib_git_message_schema from "./lib_git_message_schema.js"
import * as lib_llm_chat from "./lib_llm_chat.js"
import type {LlmConfig} from "./lib_llm_config.js"

export default {}

export interface GitMessageGenerateParams {
  llm_config: LlmConfig
  diffstat: string
  diff: string
}

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
  const {has_structured_json} = llm_config.llm_model_detail

  const system_prompt = lib_git_message_prompt.get_system_prompt({has_structured_json})

  const user_prompt = lib_git_message_prompt.get_user_prompt({has_structured_json, inputs})

  const llm_response_text = has_structured_json
    ? await generate_message_structured({llm_config, system_prompt, user_prompt})
    : await generate_message_unstructured({llm_config, system_prompt, user_prompt})

  return llm_response_text
}
