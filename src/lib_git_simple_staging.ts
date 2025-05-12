import type {SimpleGit} from "simple-git"

import {SPACE} from "./lib_char.js"

export default {}

export async function has_staged_changes(git: SimpleGit): Promise<boolean> {
  const status = await git.status()

  for (const file of status.files) {
    if ("ADMR".includes(file.index)) {
      return true
    }
  }

  return false
}

export async function has_unstaged_changes(git: SimpleGit): Promise<boolean> {
  const status = await git.status()

  for (const file of status.files) {
    if (file.working_dir !== SPACE) {
      return true
    }
  }

  return false
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

export async function push_to_remote(git: SimpleGit, no_verify = false): Promise<void> {
  const push_args = ["--follow-tags"]

  if (no_verify) {
    push_args.push("--no-verify")
  }

  await git.push(push_args)
}
