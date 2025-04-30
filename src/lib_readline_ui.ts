import * as readline from "node:readline"

import * as lib_ansi from "./lib_ansi.js"

export default {}

/**
 * Simple confirmation prompt that returns a boolean
 */
export async function confirm(message: string): Promise<boolean> {
  const query = lib_ansi.bold(lib_ansi.blue(`${message} [Y/n] `))

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close()
      const normalized_answer = answer.trim().toLowerCase()
      resolve(normalized_answer === "" || normalized_answer === "y" || normalized_answer === "yes")
    })
  })
}
