import * as lib_ansi from "./lib_ansi.js"
import {EMPTY} from "./lib_char.js"
import * as lib_enabled from "./lib_enabled.js"
import * as lib_inspect from "./lib_inspect.js"
import * as lib_stdio from "./lib_stdio.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export const debug_channels = {
  api: false,
  arg: false,
  backups: false,
  child_input: false,
  child_output: false,
  cleanup: false,
  cloudflare: false,
  config: false,
  data: false,
  detail: false,
  forwarding: false,
  gcp: false,
  git: false,
  helm: false,
  lines: false,
  llm_inputs: false,
  llm_outputs: false,
  llm_tokens: false,
  llm_tools: false,
  node: false,
  path: false,
  kubectl: false,
  postgresql: false,
  rejects: false,
  retries: false,
  sql: false,
}

type DebugChannel = keyof typeof debug_channels

export function debug_enable_if(channel: DebugChannel, enabled: boolean): void {
  if (enabled && !debug_channels[channel]) {
    debug_channels[channel] = true
    lib_tell.tell_debug(`Debugging enabled for ‘${channel}’`)
  }
}

function debug_init(): void {
  for (const channel in debug_channels) {
    if (lib_enabled.enabled_from_env(`lib_debug_${channel}`)) {
      debug_enable_if(channel as DebugChannel, true)
    }
  }
}

debug_init()

export function debug_tell_when(when: boolean | undefined, message: string): void {
  if (when !== undefined && when) {
    lib_tell.tell_debug(message)
  }
}

export function debug_inspect(obj: unknown, name: string | null = null): void {
  const prefix = name ? `${name}: ` : EMPTY
  const message = prefix + lib_inspect.inspect_obj_to_string(obj)
  lib_stdio.write_stderr_linefeed(lib_ansi.ansi_grey(message))
}

export function debug_inspect_if(obj: unknown, name: string | null = null): void {
  if (obj !== undefined) {
    debug_inspect(obj, name)
  }
}

export function debug_inspect_when(when: boolean | undefined, obj: unknown, name: string | null = null): void {
  if (when !== undefined && when) {
    debug_inspect(obj, name)
  }
}
