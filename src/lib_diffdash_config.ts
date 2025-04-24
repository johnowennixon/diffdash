import * as lib_abort from "./lib_abort.js"
import * as a from "./lib_arg_infer.js"
import * as lib_debug from "./lib_debug.js"
import type {LlmConfig, LlmProvider} from "./lib_llm_config.js"
import {LLM_PROVIDER_CHOICES} from "./lib_llm_config.js"
import * as lib_llm_config from "./lib_llm_config.js"
import {PROGRAM_NAME} from "./lib_package_details.js"

export default {}

const DEFAULT_LLM_PROVIDER: LlmProvider = "openai"

export const arg_schema = {
  llm_provider: a.arg_choice_default<LlmProvider>({
    help: `the LLM provider to use (default: ${DEFAULT_LLM_PROVIDER})`,
    choices: LLM_PROVIDER_CHOICES,
    default: DEFAULT_LLM_PROVIDER,
  }),
  llm_model: a.arg_string({help: "the LLM model to use (default depends upon provider)", metavar: "MODEL"}),

  debug_llm_inputs: a.arg_boolean({help: "debug prompts sent to the LLM"}),
  debug_llm_outputs: a.arg_boolean({help: "debug outputs received from the LLM"}),
}

export const arg_parser = a.make_arg_parser(arg_schema, PROGRAM_NAME)

export interface DiffDashConfig {
  llm_config: LlmConfig
}

export function process_config(): DiffDashConfig {
  const pa = arg_parser.parsed_args

  lib_debug.channels.llm_inputs = pa.debug_llm_inputs
  lib_debug.channels.llm_outputs = pa.debug_llm_outputs

  const llm_provider = pa.llm_provider
  const llm_model = pa.llm_model ?? lib_llm_config.default_llm_model({llm_provider})

  if (llm_model === undefined) {
    lib_abort.abort("The LLM model has not been defined")
  }

  const llm_api_key = lib_llm_config.get_llm_api_key({llm_provider})

  const llm_config: LlmConfig = {
    llm_provider,
    llm_model,
    llm_api_key,
  }

  const config: DiffDashConfig = {llm_config}

  return config
}
