import package_json from "../package.json" with {type: "json"}

import {EMPTY} from "./lib_char_empty.js"

export const PACKAGE_NAME = package_json.name.replace(/^@[^/]+\//, EMPTY) || "unknown"
export const PACKAGE_VERSION = package_json.version || "0.0.0"
