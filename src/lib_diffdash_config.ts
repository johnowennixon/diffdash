import {ArgumentParser} from "argparse"
import * as lib_package_details from "./lib_package_details.js"

export interface DiffdashConfig {
  // Repository settings
  repo_path: string

  // LLM settings
  llm_provider: "openai" | "anthropic" | "google"
  llm_model: string

  // Prompt settings
  system_prompt?: string
  user_prompt_prefix?: string
  user_prompt_suffix?: string

  // Message validation settings
  min_message_length?: number
  max_message_length?: number

  // Debug options
  debug_llm_inputs: boolean
  debug_llm_outputs: boolean

  // Miscellaneous
  verbose: boolean
}

export function process_config(): DiffdashConfig {
  const parser = new ArgumentParser({
    description: `${lib_package_details.PROGRAM_NAME} (v${lib_package_details.PROGRAM_VERSION}) - Generate commit messages for staged changes using LLMs`,
  })

  // Repository settings
  parser.add_argument("--repo-path", {
    help: "Path to the Git repository (defaults to current directory)",
    type: "str",
    default: process.cwd(),
  })

  // LLM provider and model
  parser.add_argument("--llm-provider", {
    help: "LLM provider to use (openai, anthropic, google)",
    type: "str",
    choices: ["openai", "anthropic", "google"],
    default: "openai",
  })

  parser.add_argument("--llm-model", {
    help: "LLM model to use from the selected provider",
    type: "str",
    default: "",
  })

  // API keys are read directly from environment variables:
  // - OPENAI_API_KEY
  // - ANTHROPIC_API_KEY
  // - GOOGLE_API_KEY

  // Prompt customization
  parser.add_argument("--system-prompt", {
    help: "Custom system prompt for the LLM",
    type: "str",
  })

  parser.add_argument("--user-prompt-prefix", {
    help: "Text to include at the beginning of the user prompt",
    type: "str",
  })

  parser.add_argument("--user-prompt-suffix", {
    help: "Text to include at the end of the user prompt",
    type: "str",
  })

  // Message validation
  parser.add_argument("--min-message-length", {
    help: "Minimum length for commit messages",
    type: "int",
  })

  parser.add_argument("--max-message-length", {
    help: "Maximum length for commit messages",
    type: "int",
  })

  // Debug options
  parser.add_argument("--debug-llm-inputs", {
    help: "Show prompts sent to the LLM",
    action: "store_true",
  })

  parser.add_argument("--debug-llm-outputs", {
    help: "Show raw outputs from the LLM",
    action: "store_true",
  })

  // Miscellaneous
  parser.add_argument("--verbose", {
    help: "Enable verbose output",
    action: "store_true",
  })

  const args = parser.parse_args()

  // Process the parsed arguments into our config object
  const config: DiffdashConfig = {
    repo_path: args.repo_path,

    llm_provider: args.llm_provider as "openai" | "anthropic" | "google",
    llm_model: get_default_model(args.llm_provider, args.llm_model),

    system_prompt: args.system_prompt,
    user_prompt_prefix: args.user_prompt_prefix,
    user_prompt_suffix: args.user_prompt_suffix,

    min_message_length: args.min_message_length,
    max_message_length: args.max_message_length,

    debug_llm_inputs: !!args.debug_llm_inputs,
    debug_llm_outputs: !!args.debug_llm_outputs,

    verbose: !!args.verbose,
  }

  // Validate the configuration
  validate_config(config)

  return config
}

function get_default_model(provider: string, model?: string): string {
  if (model) {
    return model
  }

  switch (provider) {
    case "openai":
      return "gpt-4o"
    case "anthropic":
      return "claude-3-opus-20240229"
    case "google":
      return "gemini-1.5-pro"
    default:
      return "gpt-4o"
  }
}

function validate_config(_config: DiffdashConfig): void {
  // Validation happens in lib_llm_chat.ts when making API calls
}
