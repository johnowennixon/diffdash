import * as lib_abort from "./lib_abort.js"
import type {DiffDashConfig} from "./lib_diffdash_config.js"
import * as lib_diffdash_footer from "./lib_diffdash_footer.js"
import * as lib_git_message_generate from "./lib_git_message_generate.js"
import * as lib_git_message_ui from "./lib_git_message_ui.js"
import * as lib_git_message_validate from "./lib_git_message_validate.js"
import type {SimpleGit} from "./lib_git_simple_open.js"
import * as lib_git_simple_staging from "./lib_git_simple_staging.js"
import * as lib_llm_config from "./lib_llm_config.js"
import * as lib_tell from "./lib_tell.js"

export default {}

/**
 * Apply prefix and suffix to the summary line of a commit message
 */
function apply_prefix_and_suffix({message, prefix, suffix}: {message: string; prefix: string; suffix: string}): string {
  if (!prefix && !suffix) {
    return message
  }

  const lines = message.split("\n")
  if (lines.length === 0) {
    return message
  }

  const formatted_prefix = prefix ? `${prefix} ` : ""
  const formatted_suffix = suffix ? ` ${suffix}` : ""
  lines[0] = `${formatted_prefix}${lines[0]}${formatted_suffix}`
  return lines.join("\n")
}

export async function generate_for_commit({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<string> {
  const {llm_config, silent, add_prefix, add_suffix} = config

  if (!silent) {
    lib_tell.action(`Generating the Git commit message using LLM ${lib_llm_config.get_llm_model_via(llm_config)}`)
  }

  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  const generate_result = await lib_git_message_generate.generate_message({llm_config, diffstat, diff})

  const {llm_response} = generate_result

  const validation_result = lib_git_message_validate.validate_message(llm_response)

  if (!validation_result.valid) {
    lib_git_message_ui.display_message({message: llm_response, teller: lib_tell.warning})

    lib_abort.with_error(`Generated commit message failed validation: ${validation_result.reason}`)
  }

  // Apply prefix and suffix to the summary line if provided
  const modified_response = apply_prefix_and_suffix({message: llm_response, prefix: add_prefix, suffix: add_suffix})

  const commit_message_with_footer = lib_diffdash_footer.add_footer({llm_response: modified_response, llm_config})

  return commit_message_with_footer
}

export async function generate_and_compare({config, git}: {config: DiffDashConfig; git: SimpleGit}): Promise<void> {
  const {silent, all_llm_configs, add_prefix, add_suffix} = config

  if (!silent) {
    lib_tell.action("Generating Git commit messages using all models in parallel")
  }

  const diffstat = await lib_git_simple_staging.get_staged_diffstat(git)
  const diff = await lib_git_simple_staging.get_staged_diff(git)

  // Create an array of promises for parallel execution
  const generate_result_promises = all_llm_configs.map((llm_config) =>
    lib_git_message_generate.generate_message({llm_config, diffstat, diff}),
  )

  // Wait for all messages to be generated in parallel
  const all_generate_results = await Promise.all(generate_result_promises)

  // Display all generated messages
  for (const generate_result of all_generate_results) {
    const {llm_config, llm_response} = generate_result

    lib_tell.info(`Git commit message from ${lib_llm_config.get_llm_model_via(llm_config)}:`)

    const validation_result = lib_git_message_validate.validate_message(llm_response)

    // Apply prefix and suffix to the summary line if provided
    const modified_response = apply_prefix_and_suffix({message: llm_response, prefix: add_prefix, suffix: add_suffix})

    const commit_message_with_footer = lib_diffdash_footer.add_footer({llm_response: modified_response, llm_config})

    const teller = validation_result.valid ? lib_tell.plain : lib_tell.warning

    lib_git_message_ui.display_message({message: commit_message_with_footer, teller})
  }
}
