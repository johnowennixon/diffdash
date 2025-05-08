import * as lib_abort from "./lib_abort.js"
import * as lib_git_message_prompt from "./lib_git_message_prompt.js"
import * as lib_git_message_validate from "./lib_git_message_validate.js"
import * as lib_llm_chat from "./lib_llm_chat.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_config from "./lib_llm_config.js"

export default {}

export interface GitMessageGenerateDetails {
  llm_config: LlmConfig
  diffstat: string
  diff: string
}

export interface GitMessageGenerateResult {
  llm_config: LlmConfig
  llm_response: string
}

export async function generate_message(details: GitMessageGenerateDetails): Promise<GitMessageGenerateResult> {
  const {llm_config, diffstat, diff} = details

  // Create the system prompts
  const system_prompt = lib_git_message_prompt.get_system_prompt()

  // Create the user prompt
  const user_prompt = lib_git_message_prompt.get_user_prompt({diffstat, diff})

  // Try calling the LLM API to generate a message
  try {
    const llm_response = await lib_llm_chat.call_llm({llm_config, system_prompt, user_prompt})

    // Validate the generated message
    const validation_result = lib_git_message_validate.validate_message(llm_response)

    if (!validation_result.valid) {
      lib_abort.with_error(`Generated commit message failed validation: ${validation_result.reason}`)
    }

    // Return the result
    return {
      llm_config,
      llm_response,
    }
  } catch {
    lib_abort.with_error(
      `Failed to generate a commit message using LLM ${lib_llm_config.get_llm_model_via(llm_config)}`,
    )
  }
}
