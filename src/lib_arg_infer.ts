import {ArgumentParser} from "argparse"
import type {ArgumentGroup, ArgumentOptions, ArgumentParserOptions, Namespace} from "argparse"

import {DASH, EMPTY, PLUS, UNDERSCORE} from "./lib_char.js"
import {debug_channels, debug_inspect_when} from "./lib_debug.js"
import type {StringPredicate} from "./lib_string_types.js"
import type {TypeInferExpand} from "./lib_type_infer.js"

type ArgInferKind = "string" | "integer" | "boolean" | "choice" | "list" | "meg"

type ArgInferPredicate = StringPredicate

type ArgInferOptions = ArgumentOptions & {positional?: boolean; predicate?: ArgInferPredicate}

type ArgInferCommandSync = (pa: unknown) => void
type ArgInferCommandAsync = (pa: unknown) => Promise<void>

type ArgInferGeneric<V> = {
  kind: ArgInferKind
  options: ArgInferOptions
  value: V
  command_sync?: ArgInferCommandSync
  command_async?: ArgInferCommandAsync
}

type ArgInferSchema = {[key: string]: ArgInferGeneric<unknown>}

type ArgInferString = ArgInferGeneric<string | undefined>
type ArgInferStringAlways = ArgInferGeneric<string>
type ArgInferInteger = ArgInferGeneric<number | undefined>
type ArgInferIntegerAlways = ArgInferGeneric<number>
type ArgInferBoolean = ArgInferGeneric<boolean>
type ArgInferChoiceOptional<C> = ArgInferGeneric<C | undefined>
type ArgInferChoiceAlways<C> = ArgInferGeneric<C>
type ArgInferList = ArgInferGeneric<Array<string>>
type ArgInferMeg<V extends ArgInferSchema> = {
  kind: "meg"
  options: ArgInferOptions
  value: V
}

export function arg_string(options: ArgInferOptions = {}): ArgInferString {
  return {kind: "string", options, value: ""}
}

export function arg_string_always(options: ArgInferOptions = {}): ArgInferStringAlways {
  return {kind: "string", options, value: ""}
}

export function arg_integer(options: ArgInferOptions = {}): ArgInferInteger {
  return {kind: "integer", options, value: 0}
}

export function arg_integer_always(options: ArgInferOptions = {}): ArgInferIntegerAlways {
  return {kind: "integer", options, value: 0}
}

export function arg_boolean(options: ArgInferOptions = {}): ArgInferBoolean {
  return {kind: "boolean", options, value: false}
}

export function arg_command_sync(command_sync: ArgInferCommandSync, options: ArgInferOptions = {}): ArgInferBoolean {
  return {kind: "boolean", options, value: false, command_sync}
}

export function arg_command_async(command_async: ArgInferCommandAsync, options: ArgInferOptions = {}): ArgInferBoolean {
  return {kind: "boolean", options, value: false, command_async}
}

export function arg_choice_optional<C>(options: ArgInferOptions = {}): ArgInferChoiceOptional<C> {
  return {kind: "choice", options, value: undefined}
}

export function arg_choice_default<C>(options: ArgInferOptions = {}): ArgInferChoiceAlways<C> {
  return {kind: "choice", options, value: undefined as C}
}

export function arg_choice_required<C>(options: ArgInferOptions = {}): ArgInferChoiceAlways<C> {
  options.required = true
  return {kind: "choice", options, value: undefined as C}
}

export function arg_list(options: ArgInferOptions = {}): ArgInferList {
  return {kind: "list", options, value: []}
}

export function arg_meg_optional<T extends ArgInferSchema>(meg_schema: T): ArgInferMeg<T> {
  return {kind: "meg", options: {required: false}, value: meg_schema}
}

export function arg_meg_required<T extends ArgInferSchema>(meg_schema: T): ArgInferMeg<T> {
  return {kind: "meg", options: {required: true}, value: meg_schema}
}

export function arg_meg_required_predicate<T extends ArgInferSchema>(
  meg_schema: T,
  predicate: ArgInferPredicate,
): ArgInferMeg<T> {
  return {kind: "meg", options: {required: true, predicate}, value: meg_schema}
}

type ArgInferParsedArgsOld<T extends ArgInferSchema> = {
  [K in keyof T]: T[K] extends ArgInferBoolean
    ? boolean
    : T[K] extends ArgInferIntegerAlways
      ? number
      : T[K] extends ArgInferInteger
        ? number | undefined
        : T[K] extends ArgInferList
          ? Array<string>
          : T[K] extends ArgInferMeg<infer U>
            ? {
                [NestedK in keyof U]: U[NestedK] extends ArgInferBoolean
                  ? boolean
                  : U[NestedK] extends ArgInferIntegerAlways
                    ? number
                    : U[NestedK] extends ArgInferInteger
                      ? number | undefined
                      : U[NestedK] extends ArgInferList
                        ? Array<string>
                        : U[NestedK] extends ArgInferChoiceAlways<infer C>
                          ? C
                          : U[NestedK] extends ArgInferChoiceOptional<infer C>
                            ? C | undefined
                            : U[NestedK] extends ArgInferStringAlways
                              ? string
                              : U[NestedK] extends ArgInferString
                                ? string | undefined
                                : never
              }
            : T[K] extends ArgInferChoiceAlways<infer C>
              ? C
              : T[K] extends ArgInferChoiceOptional<infer C>
                ? C | undefined
                : T[K] extends ArgInferStringAlways
                  ? string
                  : T[K] extends ArgInferString
                    ? string | undefined
                    : never
}

export type ArgInferParsedArgs<T extends ArgInferSchema> = TypeInferExpand<ArgInferParsedArgsOld<T>>

function omit<T, K extends keyof T>(obj: T, key_to_omit: K): Omit<T, K> {
  const {[key_to_omit]: _, ...rest} = obj
  return rest
}

function add_args({
  arg_schema,
  parser_group,
  predicate,
}: {arg_schema: ArgInferSchema; parser_group: ArgumentGroup; predicate?: ArgInferPredicate}): void {
  for (const key in arg_schema) {
    if (!Object.hasOwn(arg_schema, key)) {
      continue
    }

    const arg = arg_schema[key]
    if (!arg) {
      continue
    }

    if (predicate !== undefined) {
      if (!predicate(key)) {
        continue
      }
    }

    const key_replaced = key.replaceAll(UNDERSCORE, DASH)
    const key_amended = `${arg.options.positional === true ? EMPTY : "--"}${key_replaced}`

    const options = omit(arg.options, "positional")

    switch (arg.kind) {
      case "string":
      case "choice":
        parser_group.add_argument(key_amended, {...options})
        break
      case "integer":
        parser_group.add_argument(key_amended, {...options, type: "int"})
        break
      case "boolean":
        parser_group.add_argument(key_amended, {...options, action: "store_true"})
        break
      case "list":
        parser_group.add_argument(key_amended, {...options, nargs: PLUS})
        break
      case "meg":
        {
          const mutually_exclusive_group = parser_group.add_mutually_exclusive_group({
            required: arg.options.required === true,
          })
          add_args({
            arg_schema: arg.value as ArgInferSchema,
            parser_group: mutually_exclusive_group,
            predicate: arg.options.predicate,
          })
        }
        break
      default:
        throw new Error("Unknown argument kind")
    }
  }
}

function recursive_parse_args<U extends ArgInferSchema>({
  schema,
  namespace,
  predicate,
}: {schema: U; namespace: Namespace; predicate?: ArgInferPredicate}): ArgInferParsedArgs<U> {
  const result: Partial<ArgInferParsedArgs<U>> = {}

  for (const key in schema) {
    if (!Object.hasOwn(schema, key)) {
      continue
    }

    const arg = schema[key]
    if (!arg) {
      continue
    }

    if (predicate !== undefined) {
      if (!predicate(key)) {
        continue
      }
    }

    if (arg.kind === "meg") {
      const nested_schema = arg.value as ArgInferSchema
      result[key] = recursive_parse_args({
        schema: nested_schema,
        namespace,
        predicate: arg.options.predicate,
      }) as ArgInferParsedArgs<U>[Extract<keyof U, string>]
    } else {
      result[key] = namespace[key] as ArgInferParsedArgs<U>[Extract<keyof U, string>]
    }
  }

  return result as ArgInferParsedArgs<U>
}

function recursive_despatch_sync<U extends ArgInferSchema, T extends ArgInferSchema>({
  schema,
  namespace,
  parsed_args,
}: {schema: U; namespace: Namespace; parsed_args: ArgInferParsedArgs<T>}): void {
  for (const key in schema) {
    if (!Object.hasOwn(schema, key)) {
      continue
    }

    const arg = schema[key]
    if (!arg) {
      continue
    }

    if (arg.kind === "meg") {
      const nested_schema = arg.value as ArgInferSchema
      recursive_despatch_sync({schema: nested_schema, namespace, parsed_args})
    } else if (arg.kind === "boolean") {
      if (namespace[key] as boolean) {
        if (arg.command_sync) {
          arg.command_sync(parsed_args)
        }
      }
    }
  }
}

async function recursive_despatch_async<U extends ArgInferSchema, T extends ArgInferSchema>({
  schema,
  namespace,
  parsed_args,
}: {schema: U; namespace: Namespace; parsed_args: ArgInferParsedArgs<T>}): Promise<void> {
  for (const key in schema) {
    if (!Object.hasOwn(schema, key)) {
      continue
    }

    const arg = schema[key]
    if (!arg) {
      continue
    }

    if (arg.kind === "meg") {
      const nested_schema = arg.value as ArgInferSchema
      await recursive_despatch_async({schema: nested_schema, namespace, parsed_args})
    } else if (arg.kind === "boolean") {
      if (namespace[key] as boolean) {
        if (arg.command_async) {
          await arg.command_async(parsed_args)
        }
      }
    }
  }
}

export function make_arg_parser<T extends ArgInferSchema>({
  arg_schema,
  description,
}: {arg_schema: T; description: string}): {
  parsed_args: ArgInferParsedArgs<T>
  despatch_sync: () => void
  despatch_async: () => Promise<void>
} {
  const argument_parser_options = {description, allow_abbrev: false} as unknown as ArgumentParserOptions

  const parser = new ArgumentParser(argument_parser_options)

  add_args({arg_schema, parser_group: parser})

  const namespace = parser.parse_args() as Namespace

  debug_inspect_when(debug_channels.arg, namespace, "namespace")

  const parsed_args = recursive_parse_args({schema: arg_schema, namespace})

  function despatch_sync(): void {
    recursive_despatch_sync({schema: arg_schema, namespace, parsed_args})
  }

  async function despatch_async(): Promise<void> {
    await recursive_despatch_async({schema: arg_schema, namespace, parsed_args})
  }

  return {parsed_args, despatch_sync, despatch_async}
}
