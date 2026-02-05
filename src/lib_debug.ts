import {ansi_grey} from "./lib_ansi.js"
import {EMPTY} from "./lib_char_empty.js"
import {enabled_from_env} from "./lib_enabled.js"
import {inspect_obj_to_string} from "./lib_inspect.js"
import {stdio_write_stderr_linefeed} from "./lib_stdio_write.js"
import {tell_debug} from "./lib_tell.js"
import {tui_quote_smart_single as qss} from "./lib_tui_quote.js"

export const debug_channels = {
  api: false,
  backups: false,
  child_input: false,
  child_output: false,
  cleanup: false,
  cli: false,
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
  llm_prompts: false,
  llm_tokens: false,
  llm_tools: false,
  node: false,
  path: false,
  kubectl: false,
  postgresql: false,
  regex: false,
  rejects: false,
  retries: false,
  sql: false,
}

type DebugChannel = keyof typeof debug_channels

export function debug_enable_if(channel: DebugChannel, enabled: boolean): void {
  if (enabled && !debug_channels[channel]) {
    debug_channels[channel] = true
    tell_debug(`Debugging enabled for ${qss(channel)}`)
  }
}

function debug_init(): void {
  for (const channel in debug_channels) {
    if (enabled_from_env(`lib_debug_${channel}`)) {
      debug_enable_if(channel as DebugChannel, true)
    }
  }
}

debug_init()

export function debug_tell_when(when: boolean | undefined, message: string): void {
  if (when !== undefined && when) {
    tell_debug(message)
  }
}

export function debug_inspect(obj: unknown, name: string | null = null): void {
  const prefix = name ? `${name}: ` : EMPTY
  const message = prefix + inspect_obj_to_string(obj)
  stdio_write_stderr_linefeed(ansi_grey(message))
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
