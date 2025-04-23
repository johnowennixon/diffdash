import * as readline from "node:readline"

import * as lib_ansi from "./lib_ansi.js"

export default {}

/**
 * Simple confirmation prompt that returns a boolean
 */
export async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(lib_ansi.bold(`${message} [Y/n] `), (answer) => {
      rl.close()
      const normalized_answer = answer.trim().toLowerCase()
      resolve(normalized_answer === "" || normalized_answer === "y" || normalized_answer === "yes")
    })
  })
}
