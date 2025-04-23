// This module provides Git access using simple-git

import {type SimpleGit, simpleGit} from "simple-git"

import {EMPTY} from "./lib_char.js"
import * as lib_file_path from "./lib_file_path.js"
import * as lib_tell from "./lib_tell.js"

export default {}

export type GitRepo = SimpleGit

export interface GitAuthor {
  name: string
  email: string
  date: Date
}

export interface GitCommitter {
  name: string
  email: string
  date: Date
}

export interface GitCommitObject {
  sha: string
  message: string
  author: GitAuthor
  committer: GitCommitter
  date: Date
  parent_shas: Array<string>
  tree_sha: string
}

export interface GitBranch {
  name: string
  target_sha: string
}

export interface GitTag {
  name: string
  target_sha: string
  is_signed: boolean
  message: string
}

export function format_date_for_git(date: Date): string {
  // Git expects dates in the format: timestamp timezone
  // e.g. "1586994145 +0200"
  const timestamp = Math.floor(date.getTime() / 1000) // Convert to Unix timestamp (seconds)

  // Calculate timezone offset string
  const offset = date.getTimezoneOffset()
  const hours = Math.abs(Math.floor(offset / 60))
  const minutes = Math.abs(offset % 60)
  const sign = offset <= 0 ? "+" : "-" // Note: getTimezoneOffset returns negative for east of UTC
  const timezone = `${sign}${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}`

  return `${timestamp} ${timezone}`
}

export async function open_repository(repo_path: string = process.cwd()): Promise<GitRepo> {
  const resolved_path = lib_file_path.absolute(repo_path)

  try {
    const git = simpleGit(resolved_path)

    await git.checkIsRepo()

    return git
  } catch (error) {
    lib_tell.error(`Failed to open Git repository at: ${repo_path}`)
    throw error
  }
}

export async function validate_repository(git: GitRepo): Promise<boolean> {
  try {
    // Check if repository is valid
    const is_repo = await git.checkIsRepo()
    if (!is_repo) {
      lib_tell.error("The directory is not a git repository")
      return false
    }

    // Check if repository is bare
    const is_bare = (await git.raw(["rev-parse", "--is-bare-repository"])) === "true"
    if (is_bare) {
      lib_tell.error("Cannot operate on a bare repository")
      return false
    }

    return true
  } catch (error) {
    lib_tell.error("Failed to validate repository")
    throw error
  }
}

export async function get_all_branches(git: GitRepo): Promise<Array<GitBranch>> {
  try {
    const branches = await git.branch()

    return branches.all.map((name) => {
      return {
        name,
        target_sha: EMPTY, // We'll need to fill this in later with separate calls
      }
    })
  } catch (error) {
    lib_tell.error("Failed to get all branches")
    throw error
  }
}

export async function get_all_tags(git: GitRepo): Promise<Array<GitTag>> {
  try {
    const tag_list = await git.tags()
    const tags: Array<GitTag> = []

    for (const tag_name of tag_list.all) {
      const sha = await git.revparse([tag_name])

      tags.push({
        name: tag_name,
        target_sha: sha,
        is_signed: false, // simple-git doesn't have built-in tag signature checking
        message: EMPTY, // Would need a separate call to get message
      })
    }

    return tags
  } catch (error) {
    lib_tell.error("Failed to get all tags")
    throw error
  }
}

export async function get_commit_from_sha(git: GitRepo, sha: string): Promise<GitCommitObject> {
  try {
    // Use the raw git command to get specific commit information by SHA
    const result = await git.raw(["show", "--quiet", "--format=%H%n%P%n%an%n%ae%n%aI%n%cn%n%ce%n%cI%n%T%n%B", sha])

    // Split the result by newlines
    const lines = result.split("\n")

    // Handle missing outputs (shouldn't happen but TypeScript needs this)
    if (lines.length < 9) {
      throw new Error(`Failed to get complete commit data for ${sha}`)
    }

    // The hash is on the first line
    const hash = lines[0] || sha

    // Parent hashes are on the second line (space-separated)
    const parent_hashes = lines[1] || ""

    // Author name, email, and date are on the next three lines
    const author_name = lines[2] || "Unknown"
    const author_email = lines[3] || "unknown@example.com"
    const author_date_str = lines[4] || new Date().toISOString()

    // Committer name, email, and date are on the next three lines
    const committer_name = lines[5] || "Unknown"
    const committer_email = lines[6] || "unknown@example.com"
    const committer_date_str = lines[7] || new Date().toISOString()

    // Tree hash is on the next line
    const tree_hash = lines[8] || ""

    // The rest is the commit message
    const message = lines.slice(9).join("\n").trim()

    // Parse parent SHAs
    const parent_shas = parent_hashes.split(" ").filter(Boolean)

    // Create commit object with proper date handling
    const author_date = new Date(author_date_str)
    const committer_date = new Date(committer_date_str)

    return {
      sha: hash,
      message,
      author: {
        name: author_name,
        email: author_email,
        date: author_date,
      },
      committer: {
        name: committer_name,
        email: committer_email,
        date: committer_date,
      },
      date: author_date,
      parent_shas,
      tree_sha: tree_hash,
    }
  } catch (error) {
    lib_tell.error(`Failed to get commit: ${sha}`)
    throw error
  }
}

export async function get_all_commits(git: GitRepo): Promise<Array<string>> {
  try {
    // Get all commits in reverse chronological order (newest to oldest)
    const log = await git.log(["--topo-order", "--all"])

    // Reverse the array to process from oldest to newest
    // This ensures parent commits are processed before their children
    return log.all.map((commit) => commit.hash).reverse()
  } catch (error) {
    lib_tell.error("Failed to get all commits")
    throw error
  }
}

/**
 * Get all commits that are reachable from local refs (branches and tags)
 * but not from remote refs. This ensures we only process commits that we can
 * actually update references for.
 */
export async function get_locally_reachable_commits(git: GitRepo): Promise<Array<string>> {
  try {
    // Get a list of all local refs (branches and tags)
    const refs = await git.raw(["show-ref"])
    const ref_lines = refs.split("\n").filter(Boolean)

    // Filter out remote refs
    const local_refs = ref_lines
      .filter((line) => {
        const parts = line.split(" ")
        const ref_name = parts[1]
        return ref_name !== undefined && !ref_name.startsWith("refs/remotes/")
      })
      .map((line) => line.split(" ")[1])
      .filter((ref): ref is string => ref !== undefined) // Type guard to ensure no undefined values

    if (local_refs.length === 0) {
      lib_tell.warning("No local refs found. No commits will be processed.")
      return []
    }

    // Build a rev-list command to get all commits reachable from local refs
    // Use --topo-order to maintain topological ordering
    const rev_list_args = ["rev-list", "--topo-order"]
    rev_list_args.push(...local_refs) // Add the local refs (now guaranteed to be strings)

    const result = await git.raw(rev_list_args)

    // Parse the result into an array of commit SHAs
    const commits = result.split("\n").filter(Boolean)

    // Reverse the array to process from oldest to newest
    // This ensures parent commits are processed before their children
    return commits.reverse()
  } catch (error) {
    lib_tell.error(`Failed to get locally reachable commits: ${error instanceof Error ? error.message : String(error)}`)
    throw error
  }
}

/**
 * Check if the repository contains any signed tags.
 * Returns an array of tag names that are signed.
 */
export async function check_for_signed_tags(git: GitRepo): Promise<Array<string>> {
  const signed_tags: Array<string> = []

  try {
    // Get all tags
    const refs = await git.raw(["show-ref", "--tags"])
    if (!refs.trim()) {
      // No tags in repo
      return []
    }

    const ref_lines = refs.split("\n").filter(Boolean)

    for (const ref_line of ref_lines) {
      const parts = ref_line.split(" ")
      if (parts.length < 2) {
        continue
      }

      const ref_name = parts[1]
      if (!ref_name) {
        continue
      }

      const friendly_name = ref_name.replace(/^refs\/tags\//, "")

      try {
        // Check if it's an annotated tag
        const tag_info = await git.raw(["cat-file", "-t", ref_name])
        const is_annotated_tag = tag_info.trim() === "tag"

        if (is_annotated_tag) {
          // Check if it's signed by looking for PGP signature
          const tag_data = await git.raw(["cat-file", "-p", ref_name])
          if (tag_data.includes("-----BEGIN PGP SIGNATURE-----")) {
            signed_tags.push(friendly_name)
          }
        }
      } catch (error) {
        // Skip this tag if there was an error checking it
        lib_tell.warning(
          `Could not check tag ${friendly_name}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }

    return signed_tags
  } catch (error) {
    lib_tell.warning(`Error checking for signed tags: ${error instanceof Error ? error.message : String(error)}`)
    return [] // Return empty array if we couldn't check
  }
}

/**
 * Push changes to the remote repository
 * Uses --follow-tags to also push any tags associated with the commits being pushed
 */
export async function push_to_remote(git: GitRepo): Promise<boolean> {
  try {
    await git.push(["--follow-tags"])
    lib_tell.success("Successfully pushed changes to remote")
    return true
  } catch (error) {
    lib_tell.error(`Failed to push to remote: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}
