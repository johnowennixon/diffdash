import * as util from "node:util"

export default {}

export function obj_to_string(obj: unknown): string {
  return util.inspect(obj, {depth: Number.POSITIVE_INFINITY, colors: true, breakLength: 160})
}
