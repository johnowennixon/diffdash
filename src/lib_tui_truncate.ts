import {ELLIPSIS, SPACE} from "./lib_char.js"

export default {}

export function tui_truncate_plain(n: number, s: string, truncate = true): string {
  return truncate ? s.slice(0, n) : s
}

export function tui_truncate_ellipsis(n: number | undefined, s: string, truncate = true): string {
  if (n === undefined || !truncate) {
    return s.slice()
  }

  if (s.length <= n) {
    return s.slice()
  }

  return s.slice(0, n - 2) + SPACE + ELLIPSIS
}
