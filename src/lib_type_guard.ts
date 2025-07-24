export function type_guard_is_boolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

export function type_guard_is_number(value: unknown): value is number {
  return typeof value === "number"
}

export function type_guard_is_string(value: unknown): value is string {
  return typeof value === "string"
}

export function type_guard_is_object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && !Array.isArray(value) && value !== null
}

export function type_guard_is_array(value: unknown): value is Array<unknown> {
  return Array.isArray(value)
}
