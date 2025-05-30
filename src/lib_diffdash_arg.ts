import {arg_boolean, arg_choice_default, arg_string, make_arg_parser} from "./lib_arg_infer.js"
import {
  diffdash_llm_model_choices,
  diffdash_llm_model_default,
  diffdash_llm_model_fallback,
} from "./lib_diffdash_llm.js"

export default {}

export const diffdash_arg_schema = {
  version: arg_boolean({help: "show program version information and exit"}),
  compare: arg_boolean({help: "compare the generated messages from all models - but do not commit"}),

  add_prefix: arg_string({help: "add a prefix to the commit message summary line", metavar: "PREFIX"}),
  add_suffix: arg_string({help: "add a suffix to the commit message summary line", metavar: "SUFFIX"}),

  auto_add: arg_boolean({help: "automatically stage all changes without confirmation"}),
  auto_commit: arg_boolean({help: "automatically commit changes without confirmation"}),
  auto_push: arg_boolean({help: "automatically push changes after commit without confirmation"}),

  disable_add: arg_boolean({help: "disable adding unstaged changes - exit if no changes staged"}),
  disable_status: arg_boolean({help: "disable listing the staged files before generating a message"}),
  disable_preview: arg_boolean({help: "disable previewing the generated message"}),
  disable_commit: arg_boolean({help: "disable committing changes - exit after generating the message"}),
  disable_push: arg_boolean({help: "disable pushing changes - exit after making the commit"}),

  silent: arg_boolean({help: "suppress all normal output - errors and aborts still display"}),
  no_verify: arg_boolean({help: "bypass git hooks when pushing to Git"}),

  llm_list: arg_boolean({help: "display a list of available Large Language Models"}),
  llm_model: arg_choice_default<string>({
    help: `choose the Large Language Model by name (defaults to ${diffdash_llm_model_default})`,
    choices: diffdash_llm_model_choices,
    default: diffdash_llm_model_default,
  }),
  llm_fallback: arg_boolean({help: `use the fallback model (${diffdash_llm_model_fallback})`}),
  llm_excludes: arg_string({help: "models to exclude from comparison (comma separated)", metavar: "MODELS"}),
  llm_router: arg_boolean({help: "prefer to access the LLM via a router rather than direct"}),

  debug_llm_inputs: arg_boolean({help: "debug inputs (including all prompts) sent to the LLM"}),
  debug_llm_outputs: arg_boolean({help: "debug outputs received from the LLM"}),
}

export const diffdash_arg_parser = make_arg_parser({
  arg_schema: diffdash_arg_schema,
  description: "DiffDash - generate Git commit messages using AI",
})
