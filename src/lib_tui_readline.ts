import {createInterface} from "node:readline"

import {ansi_blue, ansi_bold} from "./lib_ansi.js"

export default {}

export async function tui_readline_confirm(message: string): Promise<boolean> {
  const query = ansi_bold(ansi_blue(`${message} [Y/n] `))

  const rl = createInterface({
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
