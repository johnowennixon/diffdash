import {spawn} from "node:child_process"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import * as readline from "node:readline"
import * as lib_tell from "./lib_tell.js"

/**
 * Simple confirmation prompt that returns a boolean
 */
export async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${message} [Y/n] `, (answer) => {
      rl.close()
      const normalized_answer = answer.trim().toLowerCase()
      resolve(normalized_answer === "" || normalized_answer === "y" || normalized_answer === "yes")
    })
  })
}

/**
 * Result object for the confirm_with_edit function
 */
export interface ConfirmWithEditResult {
  action: "accept" | "edit" | "cancel"
  edited_content?: string
}

/**
 * Enhanced confirmation prompt that allows accepting, editing, or canceling
 */
export async function confirm_with_edit(message: string): Promise<ConfirmWithEditResult> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${message} [Y]es/[E]dit/[N]o: `, async (answer) => {
      rl.close()
      const normalized_answer = answer.trim().toLowerCase()

      if (normalized_answer === "" || normalized_answer === "y" || normalized_answer === "yes") {
        resolve({action: "accept"})
      } else if (normalized_answer === "e" || normalized_answer === "edit") {
        try {
          const edited_content = await open_editor()
          if (edited_content !== null) {
            resolve({action: "edit", edited_content})
          } else {
            lib_tell.warning("Editor was closed without saving changes.")
            resolve({action: "cancel"})
          }
        } catch (error) {
          lib_tell.error(`Error opening editor: ${error instanceof Error ? error.message : String(error)}`)
          resolve({action: "cancel"})
        }
      } else {
        resolve({action: "cancel"})
      }
    })
  })
}

/**
 * Open the user's default editor to edit the commit message
 */
async function open_editor(): Promise<string | null> {
  // Create a temporary file for the commit message
  const temp_dir = os.tmpdir()
  const temp_file = path.join(temp_dir, `commit-message-${Date.now()}.txt`)

  try {
    // Get editor from environment variables or use a default
    const editor = process.env["VISUAL"] || process.env["EDITOR"] || "nano"

    // Create an empty temp file
    fs.writeFileSync(temp_file, "")

    // Open the editor
    await new Promise<void>((resolve, reject) => {
      const child = spawn(editor, [temp_file], {
        stdio: "inherit",
        shell: true,
      })

      child.on("exit", (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Editor exited with code ${code}`))
        }
      })

      child.on("error", (error) => {
        reject(error)
      })
    })

    // Read the edited content
    if (fs.existsSync(temp_file)) {
      const content = fs.readFileSync(temp_file, "utf-8")
      return content
    }

    return null
  } finally {
    // Clean up the temporary file
    if (fs.existsSync(temp_file)) {
      fs.unlinkSync(temp_file)
    }
  }
}
