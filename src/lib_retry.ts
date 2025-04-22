import * as lib_tell from "./lib_tell.js"

export default {}

export async function retry_async_exponential<T>(
  fn: () => Promise<T>,
  max_retries = 3,
  initial_delay = 1000,
): Promise<T> {
  let retries = 0
  let delay = initial_delay

  while (true) {
    try {
      return await fn()
    } catch (error) {
      if (retries >= max_retries) {
        throw error
      }

      retries++
      lib_tell.warning(
        `Retry attempt ${retries}/${max_retries} after error: ${error instanceof Error ? error.message : String(error)}`,
      )

      // Wait for the delay period
      const current_delay = delay
      await new Promise((resolve) => {
        setTimeout(resolve, current_delay)
      })

      // Exponential backoff
      delay *= 2
    }
  }
}
