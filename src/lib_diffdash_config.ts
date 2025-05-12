import * as a from "./lib_arg_infer.js"
import * as lib_debug from "./lib_debug.js"
import * as lib_env from "./lib_env.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_config from "./lib_llm_config.js"
import * as lib_llm_model from "./lib_llm_model.js"
import * as lib_llm_models_diff from "./lib_llm_models_diff.js"

export default {}

const llm_model_details = lib_llm_models_diff.get_details()
const llm_model_choices = lib_llm_model.get_choices(llm_model_details)
const llm_model_default = lib_env.get_substitute("DIFFDASH_LLM_MODEL", lib_llm_models_diff.get_default_model_name())
const llm_model_fallback = lib_llm_models_diff.get_fallback_model_name()

export const arg_schema = {
  version: a.arg_boolean({help: "show program version information and exit"}),
  compare: a.arg_boolean({help: "compare the generated messages from all models - but do not commit"}),

  auto_add: a.arg_boolean({help: "automatically stage all changes without confirmation"}),
  auto_commit: a.arg_boolean({help: "automatically commit changes without confirmation"}),
  auto_push: a.arg_boolean({help: "automatically push changes after commit without confirmation"}),

  disable_add: a.arg_boolean({help: "disable adding unstaged changes - exit if no changes staged"}),
  disable_status: a.arg_boolean({help: "disable listing the staged files before generating a message"}),
  disable_preview: a.arg_boolean({help: "disable previewing the generated message"}),
  disable_commit: a.arg_boolean({help: "disable committing changes - exit after generating the message"}),
  disable_push: a.arg_boolean({help: "disable pushing changes - exit after making the commit"}),

  silent: a.arg_boolean({help: "suppress all normal output - errors and aborts still display"}),
  no_verify: a.arg_boolean({help: "bypass git hooks when pushing to Git"}),

  llm_model: a.arg_choice_default<string>({
    help: `choose the LLM model by name (defaults to ${llm_model_default})`,
    choices: llm_model_choices,
    default: llm_model_default,
  }),
  llm_fallback: a.arg_boolean({help: `use the fallback LLM model (${llm_model_fallback})`}),
  llm_direct: a.arg_boolean({help: "prefer to access the LLM direct rather than using an aggregator"}),

  debug_llm_inputs: a.arg_boolean({help: "debug prompts sent to the LLM"}),
  debug_llm_outputs: a.arg_boolean({help: "debug outputs received from the LLM"}),
}

export const arg_parser = a.make_arg_parser(arg_schema, "DiffDash - generate Git commit messages using AI")

export interface DiffDashConfig {
  version: boolean
  compare: boolean
  auto_add: boolean
  auto_commit: boolean
  auto_push: boolean
  disable_add: boolean
  disable_commit: boolean
  disable_preview: boolean
  disable_status: boolean
  disable_push: boolean
  silent: boolean
  no_verify: boolean
  llm_config: LlmConfig
  all_llm_configs: Array<LlmConfig>
}

export function process_config(): DiffDashConfig {
  const pa = arg_parser.parsed_args

  const {
    version,
    compare,
    auto_add,
    auto_commit,
    auto_push,
    disable_add,
    disable_commit,
    disable_preview,
    disable_status,
    disable_push,
    silent,
    no_verify,
    llm_model,
    llm_fallback,
    llm_direct,
    debug_llm_inputs,
    debug_llm_outputs,
  } = pa

  const llm_model_name = llm_fallback ? llm_model_fallback : llm_model
  const llm_config = lib_llm_config.get_llm_config({llm_model_details, llm_model_name, llm_direct})
  const all_llm_configs = lib_llm_config.all_llm_configs({llm_model_details, llm_direct})

  lib_debug.channels.llm_inputs = debug_llm_inputs
  lib_debug.channels.llm_outputs = debug_llm_outputs

  const config: DiffDashConfig = {
    version,
    compare,
    auto_add,
    auto_commit,
    auto_push,
    disable_add,
    disable_commit,
    disable_preview,
    disable_status,
    disable_push,
    silent,
    no_verify,
    llm_config,
    all_llm_configs,
  }

  return config
}
