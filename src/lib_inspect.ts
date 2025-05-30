import {inspect} from "node:util"

export default {}

export function inspect_obj_to_string(obj: unknown): string {
  return inspect(obj, {depth: Number.POSITIVE_INFINITY, colors: true, breakLength: 160})
}
