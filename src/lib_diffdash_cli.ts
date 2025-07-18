import {cli_boolean, cli_choice_default, cli_make_parser, cli_string} from "./lib_cli.js"
import {
  diffdash_llm_model_choices,
  diffdash_llm_model_default,
  diffdash_llm_model_fallback,
} from "./lib_diffdash_llm.js"

const diffdash_cli_schema = {
  version: cli_boolean({help: "show program version information and exit"}),

  auto_add: cli_boolean({help: "automatically stage all changes without confirmation"}),
  auto_commit: cli_boolean({help: "automatically commit changes without confirmation"}),
  auto_push: cli_boolean({help: "automatically push changes after commit without confirmation"}),

  disable_add: cli_boolean({help: "disable adding unstaged changes - exit if no changes staged"}),
  disable_status: cli_boolean({help: "disable listing the staged files before generating a message"}),
  disable_preview: cli_boolean({help: "disable previewing the generated message"}),
  disable_commit: cli_boolean({help: "disable committing changes - exit after generating the message"}),
  disable_push: cli_boolean({help: "disable pushing changes - exit after making the commit"}),

  push_no_verify: cli_boolean({help: "bypass git hooks when pushing to Git"}),
  push_force: cli_boolean({help: "apply force when pushing to Git"}),

  add_prefix: cli_string({help: "add a prefix to the commit message summary line", metavar: "PREFIX"}),
  add_suffix: cli_string({help: "add a suffix to the commit message summary line", metavar: "SUFFIX"}),

  llm_list: cli_boolean({help: "display a list of available Large Language Models and exit"}),
  llm_compare: cli_boolean({help: "compare the generated messages from all models - but do not commit"}),
  llm_router: cli_boolean({help: "prefer to access the LLM via a router rather than direct"}),
  llm_fallback: cli_boolean({help: `use the fallback model (${diffdash_llm_model_fallback})`}),
  llm_model: cli_choice_default<string>({
    help: `choose the Large Language Model by name (defaults to ${diffdash_llm_model_default})`,
    choices: diffdash_llm_model_choices,
    default: diffdash_llm_model_default,
  }),
  llm_excludes: cli_string({help: "models to exclude from comparison (comma separated)", metavar: "MODELS"}),

  just_output: cli_boolean({help: "just output the commit message for use in scripts"}),

  silent: cli_boolean({help: "suppress all normal output - errors and aborts still display"}),

  debug_llm_prompts: cli_boolean({help: "debug prompts sent to the LLM"}),
  debug_llm_inputs: cli_boolean({help: "debug inputs object sent to the LLM"}),
  debug_llm_outputs: cli_boolean({help: "debug outputs object received from the LLM"}),
}

export const diffdash_cli_parser = cli_make_parser({
  cli_schema: diffdash_cli_schema,
  description: "DiffDash - generate Git commit messages using AI",
})

export const diffdash_cli_parsed_args = diffdash_cli_parser.parsed_args
