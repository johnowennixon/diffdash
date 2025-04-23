import {EMPTY} from "./lib_char.js"
import * as lib_enabled from "./lib_enabled.js"
import * as lib_inspect from "./lib_inspect.js"
import * as lib_stdio from "./lib_stdio.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export const channels = {
  api: false,
  arg: false,
  backups: false,
  child_input: false,
  child_output: false,
  cleanup: false,
  cloudflare: false,
  data: false,
  detail: false,
  forwarding: false,
  gcp: false,
  helm: false,
  lines: false,
  llm_inputs: false,
  llm_outputs: false,
  node: false,
  path: false,
  kubectl: false,
  postgresql: false,
  rejects: false,
  retries: false,
  sql: false,
}

type DebugChannel = keyof typeof channels

export function enable_if(channel: DebugChannel, enabled: boolean): void {
  if (enabled && !channels[channel]) {
    channels[channel] = true
    lib_tell.debug(`Debugging enabled for ‘${channel}’`)
  }
}

function init(): void {
  for (const channel in channels) {
    if (lib_enabled.from_env(`lib_debug_${channel}`)) {
      enable_if(channel as DebugChannel, true)
    }
  }
}

init()

export function inspect(obj: unknown, name: string | null = null): void {
  const prefix = name ? `${name}: ` : EMPTY
  const message = prefix + lib_inspect.obj_to_string(obj)
  lib_stdio.write_stderr_linefeed(message)
}

export function inspect_if(obj: unknown, name: string | null = null): void {
  if (obj !== undefined) {
    const prefix = name ? `${name}: ` : EMPTY
    const message = prefix + lib_inspect.obj_to_string(obj)
    lib_stdio.write_stderr_linefeed(message)
  }
}

export function inspect_when(when: boolean | undefined, obj: unknown, name: string | null = null): void {
  if (when !== undefined && when) {
    inspect(obj, name)
  }
}
