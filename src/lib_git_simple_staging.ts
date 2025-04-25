import type {SimpleGit} from "simple-git"

export default {}

export async function has_staged_changes(git: SimpleGit): Promise<boolean> {
  const status = await git.status()
  return status.staged.length > 0
}

export async function has_unstaged_changes(git: SimpleGit): Promise<boolean> {
  const status = await git.status()
  return (
    status.not_added.length > 0 || status.modified.length > 0 || status.deleted.length > 0 || status.renamed.length > 0
  )
}

export async function stage_all_changes(git: SimpleGit): Promise<void> {
  await git.add(["--all"])
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
