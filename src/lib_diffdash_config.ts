import * as a from "./lib_arg_infer.js"
import * as lib_debug from "./lib_debug.js"
import * as lib_env from "./lib_env.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_config from "./lib_llm_config.js"
import * as lib_llm_models_diff from "./lib_llm_models_diff.js"
import type {LlmModel} from "./lib_llm_models_diff.js"
import {PROGRAM_NAME} from "./lib_package_details.js"

export default {}

const llm_model_choices = lib_llm_models_diff.MODEL_CHOICES
const llm_model_default = lib_env.get_substitute("DIFFDASH_LLM_MODEL", lib_llm_models_diff.MODEL_DEFAULT)

export const arg_schema = {
  llm_model: a.arg_choice_default<LlmModel>({
    help: `the LLM model to use (defaults to ${llm_model_default})`,
    choices: llm_model_choices,
    default: llm_model_default,
  }),

  auto_add: a.arg_boolean({help: "automatically stage all changes without prompting"}),
  auto_commit: a.arg_boolean({help: "automatically commit changes without confirmation"}),
  auto_push: a.arg_boolean({help: "automatically push changes after commit without prompting"}),

  disable_add: a.arg_boolean({help: "disable adding unstaged changes (takes priority over --auto-add)"}),
  disable_push: a.arg_boolean({help: "disable pushing changes (takes priority over --auto-push)"}),

  no_verify: a.arg_boolean({help: "bypass git hooks with --no-verify flag when pushing"}),

  debug_llm_inputs: a.arg_boolean({help: "debug prompts sent to the LLM"}),
  debug_llm_outputs: a.arg_boolean({help: "debug outputs received from the LLM"}),
}

export const arg_parser = a.make_arg_parser(arg_schema, PROGRAM_NAME)

export interface DiffDashConfig {
  llm_config: LlmConfig
  auto_add: boolean
  auto_commit: boolean
  auto_push: boolean
  disable_add: boolean
  disable_push: boolean
  no_verify: boolean
}

export function process_config(): DiffDashConfig {
  const pa = arg_parser.parsed_args

  const {
    llm_model,
    auto_add,
    auto_commit,
    auto_push,
    disable_add,
    disable_push,
    debug_llm_inputs,
    debug_llm_outputs,
    no_verify,
  } = pa

  lib_debug.channels.llm_inputs = debug_llm_inputs
  lib_debug.channels.llm_outputs = debug_llm_outputs

  const llm_model_name = llm_model
  const llm_model_code = lib_llm_models_diff.get_model_details(llm_model_name).llm_model_code
  const llm_provider = lib_llm_models_diff.get_model_details(llm_model_name).llm_provider
  const llm_api_key = lib_llm_config.get_llm_api_key({llm_provider})

  const llm_config: LlmConfig = {
    llm_model_name,
    llm_model_code,
    llm_provider,
    llm_api_key,
  }

  const config: DiffDashConfig = {
    llm_config,
    auto_add,
    auto_commit,
    auto_push,
    disable_add,
    disable_push,
    no_verify,
  }

  return config
}
