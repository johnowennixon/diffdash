import package_json from "../package.json" with {type: "json"}

export default {}

// Extract name and version, handle scoped packages by removing the scope
export const PROGRAM_NAME = package_json.name.replace(/^@[^/]+\//, "") || "unknown"
export const PROGRAM_VERSION = package_json.version || "0.0.0"
