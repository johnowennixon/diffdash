import package_json from "../package.json" with {type: "json"}

import {EMPTY} from "./lib_char_empty.js"

function remove_npmjs_scope(name: string): string {
  return name.replace(/^@[^/]+\//, EMPTY)
}

export const PACKAGE_NAME = remove_npmjs_scope(package_json.name)
export const PACKAGE_VERSION = package_json.version
