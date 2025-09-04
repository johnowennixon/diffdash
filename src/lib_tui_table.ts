import type {HorizontalAlignment, Table, TableConstructorOptions} from "cli-table3"
import cli_table3 from "cli-table3"

import {abort_with_error} from "./lib_abort.js"
import {ansi_bold} from "./lib_ansi.js"

export type {HorizontalAlignment} from "cli-table3"

export class TuiTable {
  private table: Table
  private columns_total: number

  constructor({
    headings,
    alignments,
    compact,
  }: {headings: Array<string>; alignments?: Array<HorizontalAlignment>; compact?: boolean}) {
    const constructor_options: TableConstructorOptions = {style: {head: [], compact}}

    constructor_options.head = headings.map((heading) => ansi_bold(heading))
    this.columns_total = headings.length

    if (alignments) {
      if (alignments.length !== this.columns_total) {
        abort_with_error(
          `length of alignments (${alignments.length}) must match length of headings (${this.columns_total})`,
        )
      }

      constructor_options.colAligns = alignments
    }

    this.table = new cli_table3(constructor_options)
  }

  push(row: Array<string>): void {
    if (row.length !== this.columns_total) {
      abort_with_error(`length of row (${row.length}) must match length of headings (${this.columns_total})`)
    }

    this.table.push(row)
  }

  toString(): string {
    return this.table.toString()
  }
}
