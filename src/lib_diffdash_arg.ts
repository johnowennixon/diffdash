import * as a from "./lib_arg_infer.js"
import {llm_model_choices, llm_model_default, llm_model_fallback} from "./lib_diffdash_llm.js"

export default {}

export const arg_schema = {
  version: a.arg_boolean({help: "show program version information and exit"}),
  compare: a.arg_boolean({help: "compare the generated messages from all models - but do not commit"}),

  add_prefix: a.arg_string({help: "add a prefix to the commit message summary line", metavar: "PREFIX"}),
  add_suffix: a.arg_string({help: "add a suffix to the commit message summary line", metavar: "SUFFIX"}),

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
    help: `choose the Large Language Model by name (defaults to ${llm_model_default})`,
    choices: llm_model_choices,
    default: llm_model_default,
  }),
  llm_fallback: a.arg_boolean({help: `use the fallback model (${llm_model_fallback})`}),
  llm_excludes: a.arg_string({help: "models to exclude from comparison (comma separated)", metavar: "MODELS"}),
  llm_router: a.arg_boolean({help: "prefer to access the LLM via a router rather than direct"}),

  debug_llm_inputs: a.arg_boolean({help: "debug inputs (including all prompts) sent to the LLM"}),
  debug_llm_outputs: a.arg_boolean({help: "debug outputs received from the LLM"}),
}

export const arg_parser = a.make_arg_parser({
  arg_schema,
  description: "DiffDash - generate Git commit messages using AI",
})
