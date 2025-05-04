export default {}

export type Expand<T> = T extends unknown ? {[K in keyof T]: T[K]} : never

export type InferLowercasePropertiesFromStringArray<T extends ReadonlyArray<string>> = {
  [K in Lowercase<T[number]>]: string
}
