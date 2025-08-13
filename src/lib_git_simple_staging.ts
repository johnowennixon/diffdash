import type {Options, SimpleGit} from "simple-git"

import {SPACE} from "./lib_char_punctuation.js"

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

export async function git_simple_staging_create_commit({
  git,
  git_message,
  no_verify = false,
}: {
  git: SimpleGit
  git_message: string
  no_verify?: boolean
}): Promise<void> {
  const options: Options = {}

  if (no_verify) {
    options["--no-verify"] = null
  }

  await git.commit(git_message, options)
}

export async function git_simple_staging_push_to_remote({
  git,
  no_verify = false,
  force = false,
}: {
  git: SimpleGit
  no_verify?: boolean
  force?: boolean
}): Promise<void> {
  const options: Options = {}

  options["--follow-tags"] = null

  if (no_verify) {
    options["--no-verify"] = null
  }
  if (force) {
    options["--force"] = null
  }

  await git.push(options)
}
