import {z} from "zod"

import {abort_with_error} from "./lib_abort.js"
import {debug_channels, debug_inspect_when} from "./lib_debug.js"
import {diffdash_cli_parsed_args} from "./lib_diffdash_cli.js"
import {diffdash_llm_model_details} from "./lib_diffdash_llm.js"
import {file_io_read_text} from "./lib_file_io.js"
import {file_is_file} from "./lib_file_is.js"
import {json5_parse} from "./lib_json5.js"
import type {LlmConfig} from "./lib_llm_config.js"
import {llm_config_get, llm_config_get_all} from "./lib_llm_config.js"
import {llm_list_models} from "./lib_llm_list.js"
import {PACKAGE_NAME, PACKAGE_VERSION} from "./lib_package.js"
import {tell_plain} from "./lib_tell.js"
import {tui_quote_smart_single} from "./lib_tui_quote.js"

const diffdash_config_file_schema = z
  .object({
    extra_prompts: z.string().array().optional(),
  })
  .strict()

type DiffDashConfigFile = z.infer<typeof diffdash_config_file_schema>

export type DiffDashConfig = {
  auto_add: boolean
  auto_commit: boolean
  auto_push: boolean
  disable_add: boolean
  disable_commit: boolean
  disable_preview: boolean
  disable_status: boolean
  disable_push: boolean
  add_prefix: string | undefined
  add_suffix: string | undefined
  no_verify: boolean
  force: boolean
  llm_compare: boolean
  llm_config: LlmConfig
  all_llm_configs: Array<LlmConfig>
  just_output: boolean
  silent: boolean
  extra_prompts?: Array<string> | undefined
}

function diffdash_config_file_read(config: DiffDashConfig): void {
  const config_file_name = ".diffdash.json5"

  if (!file_is_file(config_file_name)) {
    return
  }

  const config_content = file_io_read_text(config_file_name)
  const parsed_json = json5_parse(config_content)

  const validation_result = diffdash_config_file_schema.safeParse(parsed_json)
  if (!validation_result.success) {
    abort_with_error(`Unable to parse DiffDash config file: ${tui_quote_smart_single(config_file_name)}`)
  }

  const data: DiffDashConfigFile = validation_result.data

  if (data.extra_prompts) {
    config.extra_prompts = data.extra_prompts
  }
}

export function diffdash_config_get(): DiffDashConfig {
  const {
    version,
    auto_add,
    auto_commit,
    auto_push,
    disable_add,
    disable_commit,
    disable_preview,
    disable_status,
    disable_push,
    no_verify,
    force,
    add_prefix,
    add_suffix,
    llm_list,
    llm_compare,
    llm_model,
    llm_excludes,
    just_output,
    silent,
    debug_llm_prompts,
    debug_llm_inputs,
    debug_llm_outputs,
  } = diffdash_cli_parsed_args

  if (version) {
    tell_plain(`${PACKAGE_NAME} v${PACKAGE_VERSION}`)
    process.exit(0)
  }

  if (llm_list) {
    llm_list_models({llm_model_details: diffdash_llm_model_details})
    process.exit(0)
  }

  const llm_config = llm_config_get({llm_model_details: diffdash_llm_model_details, llm_model_name: llm_model})
  const all_llm_configs = llm_config_get_all({llm_model_details: diffdash_llm_model_details, llm_excludes})

  debug_channels.llm_prompts = debug_llm_prompts
  debug_channels.llm_inputs = debug_llm_inputs
  debug_channels.llm_outputs = debug_llm_outputs

  const config: DiffDashConfig = {
    auto_add,
    auto_commit,
    auto_push,
    disable_add,
    disable_commit,
    disable_preview,
    disable_status,
    disable_push,
    add_prefix,
    add_suffix,
    no_verify,
    force,
    llm_compare,
    llm_config,
    all_llm_configs,
    just_output,
    silent,
    extra_prompts: undefined,
  }

  diffdash_config_file_read(config)

  debug_inspect_when(debug_channels.config, config, "config")

  return config
}
