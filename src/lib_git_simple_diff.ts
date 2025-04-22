import * as lib_array_get from "./lib_array_get.js"
import {EMPTY} from "./lib_char.js"
import type {GitRepo} from "./lib_git_simple_utils.js"
import * as lib_tell from "./lib_tell.js"

export default {}

const SHA_EMPTY_TREE = "4b825dc642cb6eb9a060e54bf8d69288fbee4904"

export async function get_parent_shas(git: GitRepo, commit_sha: string): Promise<Array<string>> {
  const commit_info = await git.show([commit_sha, "--format=%P", "--quiet"])
  return commit_info.trim().split(" ").filter(Boolean)
}

export async function calculate_diffstat(git: GitRepo, commit_sha: string): Promise<string> {
  try {
    const parent_shas = await get_parent_shas(git, commit_sha)
    let diffstat = EMPTY

    if (parent_shas.length === 0) {
      // Initial commit - get diffstat against empty tree
      const empty_tree_sha = "4b825dc642cb6eb9a060e54bf8d69288fbee4904"
      diffstat = await git.diff(["--stat", empty_tree_sha, commit_sha])
    } else {
      // For normal commits, use the first parent for diffstat
      const first_parent = lib_array_get.get_first(parent_shas)
      diffstat = await git.diff(["--stat", first_parent, commit_sha])
    }

    return diffstat
  } catch (error) {
    lib_tell.error(`Failed to calculate diffstat for commit: ${commit_sha}`)
    throw error
  }
}

export async function calculate_diff(git: GitRepo, commit_sha: string): Promise<string> {
  try {
    const parent_shas = await get_parent_shas(git, commit_sha)
    let diff = EMPTY

    if (parent_shas.length === 0) {
      // Initial commit - get diff against empty tree
      diff = await git.diff([SHA_EMPTY_TREE, commit_sha])
    } else {
      // Normal commit - get diff against each parent
      for (const parent_sha of parent_shas) {
        const parent_diff = await git.diff([parent_sha, commit_sha])
        diff += parent_diff
      }
    }

    return diff
  } catch (error) {
    lib_tell.error(`Failed to calculate diff for commit: ${commit_sha}`)
    throw error
  }
}
