import {type SimpleGit, simpleGit} from "simple-git"

import {abort_with_error} from "./lib_abort.js"
import {file_path_absolute} from "./lib_file_path.js"

export type {SimpleGit} from "simple-git"

export async function git_simple_open_git_repo(repo_path: string = process.cwd()): Promise<SimpleGit> {
  const resolved_path = file_path_absolute(repo_path)

  const git = simpleGit(resolved_path)

  const is_repo = await git.checkIsRepo()
  if (!is_repo) {
    abort_with_error("This directory is not in a git repository")
  }

  return git
}

export async function git_simple_open_check_not_bare(git: SimpleGit): Promise<void> {
  const is_bare_repository: string = await git.raw(["rev-parse", "--is-bare-repository"])

  if (is_bare_repository === "true") {
    abort_with_error("Cannot operate on a bare repository")
  }
}

export async function git_simple_open_check_no_conflicts(git: SimpleGit): Promise<void> {
  const status = await git.status()

  if (status.conflicted.length > 0) {
    abort_with_error("Cannot operate on a repository with conflicts")
  }
}
