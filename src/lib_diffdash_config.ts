import {debug_channels, debug_inspect_when} from "./lib_debug.js"
import {diffdash_cli_parser} from "./lib_diffdash_cli.js"
import {diffdash_llm_model_details, diffdash_llm_model_fallback} from "./lib_diffdash_llm.js"
import type {LlmConfig} from "./lib_llm_config.js"
import {llm_config_get, llm_config_get_all} from "./lib_llm_config.js"
import {llm_list_models} from "./lib_llm_list.js"
import {PACKAGE_NAME, PACKAGE_VERSION} from "./lib_package.js"
import {tell_plain} from "./lib_tell.js"

export interface DiffDashConfig {
  compare: boolean
  add_prefix: string | undefined
  add_suffix: string | undefined
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

export function diffdash_config_get(): DiffDashConfig {
  const pa = diffdash_cli_parser.parsed_args

  const {
    version,
    compare,
    add_prefix,
    add_suffix,
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
    llm_router,
    llm_fallback,
    llm_model,
    llm_excludes,
    llm_list,
    debug_llm_inputs,
    debug_llm_outputs,
  } = pa

  if (version) {
    tell_plain(`${PACKAGE_NAME} v${PACKAGE_VERSION}`)
    process.exit(0)
  }

  if (llm_list) {
    llm_list_models({llm_model_details: diffdash_llm_model_details})
    process.exit(0)
  }

  const llm_model_name = llm_fallback ? diffdash_llm_model_fallback : llm_model
  const llm_config = llm_config_get({
    llm_model_details: diffdash_llm_model_details,
    llm_model_name,
    llm_router,
  })
  const all_llm_configs = llm_config_get_all({
    llm_model_details: diffdash_llm_model_details,
    llm_router,
    llm_excludes,
  })

  debug_channels.llm_inputs = debug_llm_inputs
  debug_channels.llm_outputs = debug_llm_outputs

  const config: DiffDashConfig = {
    compare,
    add_prefix,
    add_suffix,
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

  debug_inspect_when(debug_channels.config, config, "config")

  return config
}
