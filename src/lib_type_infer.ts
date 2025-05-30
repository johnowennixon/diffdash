export default {}

export type TypeInferExpand<T> = T extends unknown ? {[K in keyof T]: T[K]} : never

export type TypeInferLowercasePropertiesFromStringArray<T extends ReadonlyArray<string>> = {
  [K in Lowercase<T[number]>]: string
}
