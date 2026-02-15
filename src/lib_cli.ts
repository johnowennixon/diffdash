import type {ArgumentGroup, ArgumentOptions, ArgumentParserOptions, Namespace} from "argparse"
import {ArgumentParser} from "argparse"

import {EMPTY} from "./lib_char_empty.js"
import {DASH, PLUS, QUESTION, UNDERSCORE} from "./lib_char_punctuation.js"
import {debug_channels, debug_inspect_when} from "./lib_debug.js"
import type {TypeInferExpand} from "./lib_type_infer.js"

type CliKind = "string" | "integer" | "boolean" | "choice" | "list" | "meg"

type CliOptions = ArgumentOptions & {positional?: boolean}

type CliGeneric<V> = {
  kind: CliKind
  options: CliOptions
  value: V
}

type CliSchema = {[key: string]: CliGeneric<unknown>}

type CliStringOptional = CliGeneric<string | undefined>
type CliStringAlways = CliGeneric<string>
type CliIntegerOptional = CliGeneric<number | undefined>
type CliIntegerAlways = CliGeneric<number>
type CliBooleanAlways = CliGeneric<boolean>
type CliChoiceOptional<C> = CliGeneric<C | undefined>
type CliChoiceAlways<C> = CliGeneric<C>
type CliList = CliGeneric<Array<string>>
type CliMeg<V extends CliSchema> = {
  kind: "meg"
  options: CliOptions
  value: V
}

type CliParamsHelp = {
  help: string
}

type CliParamsMetavar = {
  help: string
  metavar?: string
}

type CliParamsDefault<V> = {
  help: string
  metavar?: string
  default: V
}

type CliParamsChoices = {
  help: string
  metavar?: string
  choices: Array<string>
}

type CliParamsChoicesDefault<V> = {
  help: string
  metavar?: string
  choices: Array<string>
  default: V
}

export function cli_string_optional(params: CliParamsMetavar): CliStringOptional {
  const {help, metavar} = params
  const options: CliOptions = {help, metavar}
  return {kind: "string", options, value: ""}
}

export function cli_string_required(params: CliParamsMetavar): CliStringAlways {
  const {help, metavar} = params
  const options: CliOptions = {help, metavar, required: true}
  return {kind: "string", options, value: ""}
}

export function cli_string_default(params: CliParamsDefault<string>): CliStringAlways {
  const {help, metavar, default: _default} = params
  const options: CliOptions = {help, metavar, default: _default}
  return {kind: "string", options, value: ""}
}

export function cli_string_positional_required(params: CliParamsMetavar): CliStringAlways {
  const {help, metavar} = params
  const options: CliOptions = {help, metavar, positional: true}
  return {kind: "string", options, value: ""}
}

export function cli_string_positional_optional(params: CliParamsMetavar): CliStringOptional {
  const {help, metavar} = params
  const options: CliOptions = {help, metavar, positional: true, nargs: QUESTION}
  return {kind: "string", options, value: ""}
}

export function cli_integer_optional(params: CliParamsMetavar): CliIntegerOptional {
  const {help, metavar} = params
  const options: CliOptions = {help, metavar}
  return {kind: "integer", options, value: 0}
}

export function cli_integer_default(params: CliParamsDefault<number>): CliIntegerAlways {
  const {help, metavar, default: _default} = params
  const options: CliOptions = {help, metavar, default: _default}
  return {kind: "integer", options, value: 0}
}

export function cli_boolean_always(params: CliParamsHelp): CliBooleanAlways {
  const {help} = params
  const options: CliOptions = {help}
  return {kind: "boolean", options, value: false}
}

export function cli_boolean_default(params: CliParamsDefault<boolean>): CliBooleanAlways {
  const {help, default: _default} = params
  const options: CliOptions = {help, default: _default}
  return {kind: "boolean", options, value: false}
}

export function cli_choice_optional<C>(params: CliParamsChoices): CliChoiceOptional<C> {
  const {help, metavar, choices} = params
  const options: CliOptions = {help, metavar, choices}
  return {kind: "choice", options, value: undefined}
}

export function cli_choice_required<C>(params: CliParamsChoices): CliChoiceAlways<C> {
  const {help, metavar, choices} = params
  const options: CliOptions = {help, metavar, choices, required: true}
  return {kind: "choice", options, value: undefined as C}
}

export function cli_choice_default<C>(params: CliParamsChoicesDefault<C>): CliChoiceAlways<C> {
  const {help, metavar, choices, default: _default} = params
  const options: CliOptions = {help, metavar, choices, default: _default}
  return {kind: "choice", options, value: undefined as C}
}

export function cli_list_positional(params: CliParamsHelp): CliList {
  const {help} = params
  const options: CliOptions = {help, positional: true}
  return {kind: "list", options, value: []}
}

export function cli_meg_optional<T extends CliSchema>(meg_schema: T): CliMeg<T> {
  return {kind: "meg", options: {required: false}, value: meg_schema}
}

export function cli_meg_required<T extends CliSchema>(meg_schema: T): CliMeg<T> {
  return {kind: "meg", options: {required: true}, value: meg_schema}
}

type CliParsedArgsOld<T extends CliSchema> = {
  [K in keyof T]: T[K] extends CliBooleanAlways
    ? boolean
    : T[K] extends CliIntegerAlways
      ? number
      : T[K] extends CliIntegerOptional
        ? number | undefined
        : T[K] extends CliList
          ? Array<string>
          : T[K] extends CliMeg<infer U>
            ? {
                [NestedK in keyof U]: U[NestedK] extends CliBooleanAlways
                  ? boolean
                  : U[NestedK] extends CliIntegerAlways
                    ? number
                    : U[NestedK] extends CliIntegerOptional
                      ? number | undefined
                      : U[NestedK] extends CliList
                        ? Array<string>
                        : U[NestedK] extends CliChoiceAlways<infer C>
                          ? C
                          : U[NestedK] extends CliChoiceOptional<infer C>
                            ? C | undefined
                            : U[NestedK] extends CliStringAlways
                              ? string
                              : U[NestedK] extends CliStringOptional
                                ? string | undefined
                                : never
              }
            : T[K] extends CliChoiceAlways<infer C>
              ? C
              : T[K] extends CliChoiceOptional<infer C>
                ? C | undefined
                : T[K] extends CliStringAlways
                  ? string
                  : T[K] extends CliStringOptional
                    ? string | undefined
                    : never
}

export type CliParsedArgs<T extends CliSchema> = TypeInferExpand<CliParsedArgsOld<T>>

function cli_omit<T, K extends keyof T>(obj: T, key_to_omit: K): Omit<T, K> {
  const {[key_to_omit]: _, ...rest} = obj
  return rest
}

function cli_add_keys({cli_schema, parser_group}: {cli_schema: CliSchema; parser_group: ArgumentGroup}): void {
  for (const key in cli_schema) {
    if (!Object.hasOwn(cli_schema, key)) {
      continue
    }

    const cli = cli_schema[key]
    if (!cli) {
      continue
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
}: {
  schema: U
  namespace: Namespace
}): CliParsedArgs<U> {
  const result: Partial<CliParsedArgs<U>> = {}

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
      result[key] = cli_recursive_parse({
        schema: nested_schema,
        namespace,
      }) as CliParsedArgs<U>[Extract<keyof U, string>]
    } else {
      result[key] = namespace[key] as CliParsedArgs<U>[Extract<keyof U, string>]
    }
  }

  return result as CliParsedArgs<U>
}

export function cli_make_parser<T extends CliSchema>({
  cli_schema,
  description,
}: {
  cli_schema: T
  description: string
}): {
  parsed_args: CliParsedArgs<T>
} {
  const argument_parser_options = {description, allow_abbrev: false} as unknown as ArgumentParserOptions

  const parser = new ArgumentParser(argument_parser_options)

  cli_add_keys({cli_schema, parser_group: parser})

  const namespace = parser.parse_args() as Namespace

  debug_inspect_when(debug_channels.cli, namespace, "namespace")

  const parsed_args = cli_recursive_parse({schema: cli_schema, namespace})

  return {parsed_args}
}
