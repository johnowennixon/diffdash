import cli_table3 from "cli-table3"

import {ansi_bold} from "./lib_ansi.js"

export default {}

export class CliTable {
  table: cli_table3.Table
  count = 0

  constructor({headings}: {headings?: Array<string>}) {
    const constructor_options: cli_table3.TableConstructorOptions = {style: {head: []}}

    if (headings) {
      constructor_options.head = headings.map((heading) => ansi_bold(heading))
    }

    this.table = new cli_table3(constructor_options)
  }

  push(row: Array<string>): void {
    this.table.push(row)
    this.count++
  }

  toString(): string {
    return this.table.toString()
  }
}
