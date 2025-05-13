import package_json from "../package.json" with {type: "json"}

import {EMPTY} from "./lib_char.js"

export default {}

// Extract name and version, handle scoped packages by removing the scope
export const PROGRAM_NAME = package_json.name.replace(/^@[^/]+\//, EMPTY) || "unknown"
export const PROGRAM_VERSION = package_json.version || "0.0.0"
