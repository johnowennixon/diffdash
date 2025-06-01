import type {SimpleGit} from "simple-git"

import {SPACE} from "./lib_char_punctuation.js"

export default {}

export async function git_simple_staging_has_staged_changes(git: SimpleGit): Promise<boolean> {
  const status = await git.status()

  for (const file of status.files) {
    if ("ADMR".includes(file.index)) {
      return true
    }
  }

  return false
}

export async function git_simple_staging_has_unstaged_changes(git: SimpleGit): Promise<boolean> {
  const status = await git.status()

  for (const file of status.files) {
    if (file.working_dir !== SPACE) {
      return true
    }
  }

  return false
}

export async function git_simple_staging_stage_all_changes(git: SimpleGit): Promise<void> {
  await git.add(["--all"])
}

export async function git_simple_staging_get_staged_diffstat(git: SimpleGit): Promise<string> {
  return await git.diff(["--cached", "--stat"])
}

export async function git_simple_staging_get_staged_diff(git: SimpleGit): Promise<string> {
  return await git.diff(["--cached"])
}

export async function git_simple_staging_create_commit(git: SimpleGit, git_message: string): Promise<void> {
  await git.commit(git_message)
}

export async function git_simple_staging_push_to_remote(git: SimpleGit, no_verify = false): Promise<void> {
  const push_args = ["--follow-tags"]

  if (no_verify) {
    push_args.push("--no-verify")
  }

  await git.push(push_args)
}
