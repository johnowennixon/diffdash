import {type SimpleGit, simpleGit} from "simple-git"

import * as lib_abort from "./lib_abort.js"
import * as lib_file_path from "./lib_file_path.js"

export default {}

export async function open_git_repo(repo_path: string = process.cwd()): Promise<SimpleGit> {
  const resolved_path = lib_file_path.absolute(repo_path)

  const git = simpleGit(resolved_path)

  const is_repo = await git.checkIsRepo()
  if (!is_repo) {
    lib_abort.with_error("This directory is not in a git repository")
  }

  return git
}

export async function check_git_repo_is_not_bare(git: SimpleGit): Promise<void> {
  const is_bare = (await git.raw(["rev-parse", "--is-bare-repository"])) === "true"

  if (is_bare) {
    lib_abort.with_error("Cannot operate on a bare repository")
  }
}
