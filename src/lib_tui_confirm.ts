import {input as inquirer_input} from "@inquirer/prompts"

export async function tui_confirm({
  question,
  default: default_value,
  style_message,
}: {
  question: string
  default?: boolean
  style_message?: (text: string) => string
}): Promise<boolean> {
  const result = await inquirer_input({
    message: question,
    default: default_value === undefined ? undefined : default_value ? "Yes" : "No",
    validate: (text: string) => {
      const cleaned = text.trim().toLowerCase()
      if (cleaned === "y" || cleaned === "yes" || cleaned === "n" || cleaned === "no") {
        return true
      }
      return "Please enter Yes or No"
    },
    transformer: (text: string, {isFinal: is_final}: {isFinal: boolean}) => {
      const cleaned = text.trim().toLowerCase()
      return is_final ? (cleaned === "y" || cleaned === "yes" ? "Yes" : "No") : text
    },
    theme: {
      prefix: {idle: undefined, done: undefined},
      style: {
        message: style_message,
      },
    },
  })

  return result.trim().toLowerCase() === "y" || result.trim().toLowerCase() === "yes"
}
