import {ArgumentParser} from "argparse"

import * as lib_abort from "./lib_abort.js"
import * as lib_debug from "./lib_debug.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_config from "./lib_llm_config.js"
import * as lib_package_details from "./lib_package_details.js"

export default {}

export interface DiffdashConfig {
  llm_config: LlmConfig
  verbose: boolean
}

export function process_config(): DiffdashConfig {
  const parser = new ArgumentParser({
    description: `${lib_package_details.PROGRAM_NAME} (v${lib_package_details.PROGRAM_VERSION}) - Generate commit messages for staged changes using LLMs`,
  })

  // LLM provider and model
  parser.add_argument("--llm-provider", {
    help: "LLM provider to use (openai, anthropic, google)",
    type: "str",
    choices: ["openai", "anthropic", "google"],
    default: "openai",
  })

  parser.add_argument("--llm-model", {
    help: "LLM model to use (default depends upon provider)",
    type: "str",
    default: "",
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

  lib_debug.channels.llm_inputs = args.debug_llm_inputs
  lib_debug.channels.llm_outputs = args.debug_llm_outputs

  const verbose = !!args.verbose

  const llm_provider = args.llm_provider as "openai" | "anthropic" | "google"
  const llm_model = (args.llm_model ?? lib_llm_config.default_llm_model(args.llm_provider)) as string

  if (llm_model === undefined) {
    lib_abort.abort("The LLM model has not been defined")
  }

  const llm_api_key = lib_llm_config.get_llm_api_key({llm_provider})

  const llm_config: LlmConfig = {
    llm_provider,
    llm_model,
    llm_api_key,
  }

  lib_llm_config.show_llm_config({llm_config, verbose})

  // Process the parsed arguments into our config object
  const config: DiffdashConfig = {
    llm_config,
    verbose,
  }

  return config
}
