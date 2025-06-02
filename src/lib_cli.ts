import {ArgumentParser} from "argparse"
import type {ArgumentGroup, ArgumentOptions, ArgumentParserOptions, Namespace} from "argparse"

import {EMPTY} from "./lib_char_empty.js"
import {DASH, PLUS, UNDERSCORE} from "./lib_char_punctuation.js"
import {debug_channels, debug_inspect_when} from "./lib_debug.js"
import type {StringPredicate} from "./lib_string_types.js"
import type {TypeInferExpand} from "./lib_type_infer.js"

export default {}

type CliKind = "string" | "integer" | "boolean" | "choice" | "list" | "meg"

type CliPredicate = StringPredicate

type CliOptions = ArgumentOptions & {positional?: boolean; predicate?: CliPredicate}

type CliCommandSync = (pa: unknown) => void
type CliCommandAsync = (pa: unknown) => Promise<void>

type CliGeneric<V> = {
  kind: CliKind
  options: CliOptions
  value: V
  command_sync?: CliCommandSync
  command_async?: CliCommandAsync
}

type CliSchema = {[key: string]: CliGeneric<unknown>}

type CliString = CliGeneric<string | undefined>
type CliStringAlways = CliGeneric<string>
type CliInteger = CliGeneric<number | undefined>
type CliIntegerAlways = CliGeneric<number>
type CliBoolean = CliGeneric<boolean>
type CliChoiceOptional<C> = CliGeneric<C | undefined>
type CliChoiceAlways<C> = CliGeneric<C>
type CliList = CliGeneric<Array<string>>
type CliMeg<V extends CliSchema> = {
  kind: "meg"
  options: CliOptions
  value: V
}

export function cli_string(options: CliOptions = {}): CliString {
  return {kind: "string", options, value: ""}
}

export function cli_string_always(options: CliOptions = {}): CliStringAlways {
  return {kind: "string", options, value: ""}
}

export function cli_integer(options: CliOptions = {}): CliInteger {
  return {kind: "integer", options, value: 0}
}

export function cli_integer_always(options: CliOptions = {}): CliIntegerAlways {
  return {kind: "integer", options, value: 0}
}

export function cli_boolean(options: CliOptions = {}): CliBoolean {
  return {kind: "boolean", options, value: false}
}

export function cli_command_sync(command_sync: CliCommandSync, options: CliOptions = {}): CliBoolean {
  return {kind: "boolean", options, value: false, command_sync}
}

export function cli_command_async(command_async: CliCommandAsync, options: CliOptions = {}): CliBoolean {
  return {kind: "boolean", options, value: false, command_async}
}

export function cli_choice_optional<C>(options: CliOptions = {}): CliChoiceOptional<C> {
  return {kind: "choice", options, value: undefined}
}

export function cli_choice_default<C>(options: CliOptions = {}): CliChoiceAlways<C> {
  return {kind: "choice", options, value: undefined as C}
}

export function cli_choice_required<C>(options: CliOptions = {}): CliChoiceAlways<C> {
  options.required = true
  return {kind: "choice", options, value: undefined as C}
}

export function cli_list(options: CliOptions = {}): CliList {
  return {kind: "list", options, value: []}
}

export function cli_meg_optional<T extends CliSchema>(meg_schema: T): CliMeg<T> {
  return {kind: "meg", options: {required: false}, value: meg_schema}
}

export function cli_meg_required<T extends CliSchema>(meg_schema: T): CliMeg<T> {
  return {kind: "meg", options: {required: true}, value: meg_schema}
}

export function cli_meg_required_predicate<T extends CliSchema>(meg_schema: T, predicate: CliPredicate): CliMeg<T> {
  return {kind: "meg", options: {required: true, predicate}, value: meg_schema}
}

type CliParsedArgsOld<T extends CliSchema> = {
  [K in keyof T]: T[K] extends CliBoolean
    ? boolean
    : T[K] extends CliIntegerAlways
      ? number
      : T[K] extends CliInteger
        ? number | undefined
        : T[K] extends CliList
          ? Array<string>
          : T[K] extends CliMeg<infer U>
            ? {
                [NestedK in keyof U]: U[NestedK] extends CliBoolean
                  ? boolean
                  : U[NestedK] extends CliIntegerAlways
                    ? number
                    : U[NestedK] extends CliInteger
                      ? number | undefined
                      : U[NestedK] extends CliList
                        ? Array<string>
                        : U[NestedK] extends CliChoiceAlways<infer C>
                          ? C
                          : U[NestedK] extends CliChoiceOptional<infer C>
                            ? C | undefined
                            : U[NestedK] extends CliStringAlways
                              ? string
                              : U[NestedK] extends CliString
                                ? string | undefined
                                : never
              }
            : T[K] extends CliChoiceAlways<infer C>
              ? C
              : T[K] extends CliChoiceOptional<infer C>
                ? C | undefined
                : T[K] extends CliStringAlways
                  ? string
                  : T[K] extends CliString
                    ? string | undefined
                    : never
}

export type CliParsedArgs<T extends CliSchema> = TypeInferExpand<CliParsedArgsOld<T>>

function cli_omit<T, K extends keyof T>(obj: T, key_to_omit: K): Omit<T, K> {
  const {[key_to_omit]: _, ...rest} = obj
  return rest
}

function cli_add_keys({
  cli_schema,
  parser_group,
  predicate,
}: {cli_schema: CliSchema; parser_group: ArgumentGroup; predicate?: CliPredicate}): void {
  for (const key in cli_schema) {
    if (!Object.hasOwn(cli_schema, key)) {
      continue
    }

    const cli = cli_schema[key]
    if (!cli) {
      continue
    }

    if (predicate !== undefined) {
      if (!predicate(key)) {
        continue
      }
    }

    const key_replaced = key.replaceAll(UNDERSCORE, DASH)
    const key_amended = `${cli.options.positional === true ? EMPTY : "--"}${key_replaced}`

    const options = cli_omit(cli.options, "positional")

    switch (cli.kind) {
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
            required: cli.options.required === true,
          })
          cli_add_keys({
            cli_schema: cli.value as CliSchema,
            parser_group: mutually_exclusive_group,
            predicate: cli.options.predicate,
          })
        }
        break
      default:
        throw new Error("Unknown argument kind")
    }
  }
}

function cli_recursive_parse<U extends CliSchema>({
  schema,
  namespace,
  predicate,
}: {schema: U; namespace: Namespace; predicate?: CliPredicate}): CliParsedArgs<U> {
  const result: Partial<CliParsedArgs<U>> = {}

  for (const key in schema) {
    if (!Object.hasOwn(schema, key)) {
      continue
    }

    const cli = schema[key]
    if (!cli) {
      continue
    }

    if (predicate !== undefined) {
      if (!predicate(key)) {
        continue
      }
    }

    if (cli.kind === "meg") {
      const nested_schema = cli.value as CliSchema
      result[key] = cli_recursive_parse({
        schema: nested_schema,
        namespace,
        predicate: cli.options.predicate,
      }) as CliParsedArgs<U>[Extract<keyof U, string>]
    } else {
      result[key] = namespace[key] as CliParsedArgs<U>[Extract<keyof U, string>]
    }
  }

  return result as CliParsedArgs<U>
}

function cli_recursive_despatch_sync<U extends CliSchema, T extends CliSchema>({
  schema,
  namespace,
  parsed_args,
}: {schema: U; namespace: Namespace; parsed_args: CliParsedArgs<T>}): void {
  for (const key in schema) {
    if (!Object.hasOwn(schema, key)) {
      continue
    }

    const cli = schema[key]
    if (!cli) {
      continue
    }

    if (cli.kind === "meg") {
      const nested_schema = cli.value as CliSchema
      cli_recursive_despatch_sync({schema: nested_schema, namespace, parsed_args})
    } else if (cli.kind === "boolean") {
      if (namespace[key] as boolean) {
        if (cli.command_sync) {
          cli.command_sync(parsed_args)
        }
      }
    }
  }
}

async function cli_recursive_despatch_async<U extends CliSchema, T extends CliSchema>({
  schema,
  namespace,
  parsed_args,
}: {schema: U; namespace: Namespace; parsed_args: CliParsedArgs<T>}): Promise<void> {
  for (const key in schema) {
    if (!Object.hasOwn(schema, key)) {
      continue
    }

    const cli = schema[key]
    if (!cli) {
      continue
    }

    if (cli.kind === "meg") {
      const nested_schema = cli.value as CliSchema
      await cli_recursive_despatch_async({schema: nested_schema, namespace, parsed_args})
    } else if (cli.kind === "boolean") {
      if (namespace[key] as boolean) {
        if (cli.command_async) {
          await cli.command_async(parsed_args)
        }
      }
    }
  }
}

export function cli_make_parser<T extends CliSchema>({
  cli_schema,
  description,
}: {cli_schema: T; description: string}): {
  parsed_args: CliParsedArgs<T>
  despatch_sync: () => void
  despatch_async: () => Promise<void>
} {
  const argument_parser_options = {description, allow_abbrev: false} as unknown as ArgumentParserOptions

  const parser = new ArgumentParser(argument_parser_options)

  cli_add_keys({cli_schema, parser_group: parser})

  const namespace = parser.parse_args() as Namespace

  debug_inspect_when(debug_channels.cli, namespace, "namespace")

  const parsed_args = cli_recursive_parse({schema: cli_schema, namespace})

  function despatch_sync(): void {
    cli_recursive_despatch_sync({schema: cli_schema, namespace, parsed_args})
  }

  async function despatch_async(): Promise<void> {
    await cli_recursive_despatch_async({schema: cli_schema, namespace, parsed_args})
  }

  return {parsed_args, despatch_sync, despatch_async}
}
