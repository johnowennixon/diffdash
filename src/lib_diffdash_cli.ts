import {cli_boolean_always, cli_choice_default, cli_make_parser, cli_string_optional} from "./lib_cli.js"
import {diffdash_llm_model_choices, diffdash_llm_model_default} from "./lib_diffdash_llm.js"
import {LANGUAGE_CODE_ENGLISH, language_get_code_choices} from "./lib_language.js"
import {tui_quote_smart_single as qss} from "./lib_tui_quote.js"

const diffdash_cli_schema = {
  version: cli_boolean_always({help: "show program version information and exit"}),

  auto_add: cli_boolean_always({help: "automatically stage all changes without confirmation"}),
  auto_commit: cli_boolean_always({help: "automatically commit changes without confirmation"}),
  auto_push: cli_boolean_always({help: "automatically push changes after commit without confirmation"}),

  disable_add: cli_boolean_always({help: "disable adding unstaged changes - exit if no changes staged"}),
  disable_status: cli_boolean_always({help: "disable listing the staged files before generating a message"}),
  disable_preview: cli_boolean_always({help: "disable previewing the generated message"}),
  disable_commit: cli_boolean_always({help: "disable committing changes - exit after generating the message"}),
  disable_push: cli_boolean_always({help: "disable pushing changes - exit after making the commit"}),

  add_prefix: cli_string_optional({help: "add a prefix to the commit message summary line", metavar: "PREFIX"}),
  add_suffix: cli_string_optional({help: "add a suffix to the commit message summary line", metavar: "SUFFIX"}),

  language: cli_choice_default<string>({
    help: `choose the language for commit messages (defaults to ${qss(LANGUAGE_CODE_ENGLISH)})`,
    choices: language_get_code_choices(),
    default: LANGUAGE_CODE_ENGLISH,
  }),

  llm_list: cli_boolean_always({help: "display a list of available Large Language Models and exit"}),
  llm_compare: cli_boolean_always({help: "compare the generated messages from all models - but do not commit"}),
  llm_model: cli_choice_default<string>({
    help: `choose the Large Language Model by name (defaults to ${qss(diffdash_llm_model_default)})`,
    choices: diffdash_llm_model_choices,
    default: diffdash_llm_model_default,
  }),
  llm_excludes: cli_string_optional({help: "models to exclude from comparison (comma separated)", metavar: "MODELS"}),

  no_secret_check: cli_boolean_always({help: "bypass checking for secrets in diffs"}),
  no_verify: cli_boolean_always({help: "bypass git hooks when committing or pushing to Git"}),
  force: cli_boolean_always({help: "apply force when pushing to Git"}),

  just_output: cli_boolean_always({help: "just output the commit message for use in scripts"}),

  silent: cli_boolean_always({help: "suppress all normal output - errors and aborts still display"}),

  debug_llm_prompts: cli_boolean_always({help: "debug prompts sent to the LLM"}),
  debug_llm_inputs: cli_boolean_always({help: "debug inputs object sent to the LLM"}),
  debug_llm_outputs: cli_boolean_always({help: "debug outputs object received from the LLM"}),
}

export const diffdash_cli_parser = cli_make_parser({
  cli_schema: diffdash_cli_schema,
  description: "DiffDash - generate Git commit messages using AI",
})

export const diffdash_cli_parsed_args = diffdash_cli_parser.parsed_args
