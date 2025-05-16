export default {}

export function is_boolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

export function is_number(value: unknown): value is number {
  return typeof value === "number"
}

export function is_string(value: unknown): value is string {
  return typeof value === "string"
}

export function is_object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && !Array.isArray(value) && value !== null
}

export function is_array(value: unknown): value is Array<unknown> {
  return Array.isArray(value)
}
