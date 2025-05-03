import * as a from "./lib_arg_infer.js"
import * as lib_debug from "./lib_debug.js"
import * as lib_env from "./lib_env.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_config from "./lib_llm_config.js"
import * as lib_llm_models_diff from "./lib_llm_models_diff.js"
import type {LlmModelsDiff} from "./lib_llm_models_diff.js"
import {PROGRAM_NAME} from "./lib_package_details.js"

export default {}

const llm_model_choices = lib_llm_models_diff.get_choices()
const llm_model_default = lib_env.get_substitute("DIFFDASH_LLM_MODEL", lib_llm_models_diff.get_default())

export const arg_schema = {
  llm_model: a.arg_choice_default<LlmModelsDiff>({
    help: `the LLM model to use (defaults to ${llm_model_default})`,
    choices: llm_model_choices,
    default: llm_model_default,
  }),

  auto_add: a.arg_boolean({help: "automatically stage all changes without prompting"}),
  auto_commit: a.arg_boolean({help: "automatically commit changes without confirmation"}),
  auto_push: a.arg_boolean({help: "automatically push changes after commit without prompting"}),

  disable_add: a.arg_boolean({help: "disable adding unstaged changes (takes priority over --auto-add)"}),
  disable_commit: a.arg_boolean({help: "disable committing changes after displaying the generated message"}),
  disable_push: a.arg_boolean({help: "disable pushing changes (takes priority over --auto-push)"}),
  disable_status: a.arg_boolean({help: "disable displaying the status of staged files before commit"}),

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
  disable_commit: boolean
  disable_status: boolean
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
    disable_commit,
    disable_status,
    disable_push,
    debug_llm_inputs,
    debug_llm_outputs,
    no_verify,
  } = pa

  lib_debug.channels.llm_inputs = debug_llm_inputs
  lib_debug.channels.llm_outputs = debug_llm_outputs

  const llm_config = lib_llm_config.get_llm_config(llm_model, lib_llm_models_diff.get_model_details)

  const config: DiffDashConfig = {
    llm_config,
    auto_add,
    auto_commit,
    auto_push,
    disable_add,
    disable_commit,
    disable_status,
    disable_push,
    no_verify,
  }

  return config
}
