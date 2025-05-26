import * as lib_debug from "./lib_debug.js"
import {arg_parser} from "./lib_diffdash_arg.js"
import {llm_model_details, llm_model_fallback} from "./lib_diffdash_llm.js"
import type {LlmConfig} from "./lib_llm_config.js"
import * as lib_llm_config from "./lib_llm_config.js"

export default {}

export interface DiffDashConfig {
  version: boolean
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

export function get_config(): DiffDashConfig {
  const pa = arg_parser.parsed_args

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
    llm_model,
    llm_fallback,
    llm_excludes,
    llm_router,
    debug_llm_inputs,
    debug_llm_outputs,
  } = pa

  const llm_model_name = llm_fallback ? llm_model_fallback : llm_model
  const llm_config = lib_llm_config.get_llm_config({llm_model_details, llm_model_name, llm_router})
  const all_llm_configs = lib_llm_config.all_llm_configs({llm_model_details, llm_router, llm_excludes})

  lib_debug.channels.llm_inputs = debug_llm_inputs
  lib_debug.channels.llm_outputs = debug_llm_outputs

  const config: DiffDashConfig = {
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
    llm_config,
    all_llm_configs,
  }

  return config
}
