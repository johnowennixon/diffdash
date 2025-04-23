import type {SimpleGit} from "simple-git"

export async function has_staged_changes(git: SimpleGit): Promise<boolean> {
  const status = await git.status()
  return status.staged.length > 0
}

export async function get_staged_diffstat(git: SimpleGit): Promise<string> {
  return await git.diff(["--cached", "--stat"])
}

export async function get_staged_diff(git: SimpleGit): Promise<string> {
  return await git.diff(["--cached"])
}

export async function create_commit(git: SimpleGit, message: string): Promise<void> {
  await git.commit(message)
}
