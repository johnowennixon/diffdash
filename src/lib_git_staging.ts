import type {SimpleGit} from "simple-git"

/**
 * Check if there are any staged changes in the repository
 */
export async function has_staged_changes(git: SimpleGit): Promise<boolean> {
  const status = await git.status()
  return status.staged.length > 0
}

/**
 * Get a diffstat summary for staged changes
 */
export async function get_staged_diff_stats(git: SimpleGit): Promise<string> {
  try {
    // Use git diff --cached --stat to get a summary of staged changes
    const diff_stats = await git.diff(["--cached", "--stat"])
    return diff_stats
  } catch (_error) {
    // Return empty string if there's an error
    return ""
  }
}

/**
 * Get the full diff for staged changes
 */
export async function get_staged_diff(git: SimpleGit): Promise<string> {
  try {
    // Use git diff --cached to get the full diff of staged changes
    const diff = await git.diff(["--cached"])
    return diff
  } catch (_error) {
    // Return empty string if there's an error
    return ""
  }
}

/**
 * Create a commit with the given message
 */
export async function create_commit(git: SimpleGit, message: string): Promise<void> {
  await git.commit(message)
}
