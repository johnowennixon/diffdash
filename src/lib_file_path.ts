import fs from "node:fs"
import path from "node:path"

import * as lib_abort from "./lib_abort.js"

export default {}

export function path_delimiter(): string {
  return path.delimiter
}

export function path_join(segment1: string, ...segments: Array<string>): string {
  return path.join(segment1, ...segments)
}

export function path_absolute(relative_path: string): string {
  return path.resolve(relative_path)
}

export function path_basename(file_path: string): string {
  return path.basename(file_path)
}

export function path_dirname(file_path: string): string {
  return path.dirname(file_path)
}

export function path_extname(file_path: string): string {
  return path.extname(file_path)
}

export function is_dir(dir_path: string): boolean {
  try {
    return fs.statSync(dir_path).isDirectory()
  } catch {
    return false
  }
}

export function is_file(file_path: string): boolean {
  try {
    return fs.statSync(file_path).isFile()
  } catch {
    return false
  }
}

export function is_socket(file_path: string): boolean {
  try {
    return fs.statSync(file_path).isSocket()
  } catch {
    return false
  }
}

export function is_executable(file_path: string): boolean {
  try {
    fs.accessSync(file_path, fs.constants.X_OK)
    return true
  } catch {
    return false
  }
}

export function check_is_dir(dir_path: string | undefined): string {
  if (!dir_path || !is_dir(dir_path)) {
    lib_abort.abort_with_error(`Directory not found: ${dir_path}`)
  }

  return dir_path
}

export function check_is_file(file_path: string | undefined): string {
  if (!file_path || !is_file(file_path)) {
    lib_abort.abort_with_error(`File not found: ${file_path}`)
  }

  return file_path
}

export function check_is_socket(file_path: string | undefined): string {
  if (!file_path || !is_socket(file_path)) {
    lib_abort.abort_with_error(`Socket not found: ${file_path}`)
  }

  return file_path
}

export function mkdir_sync(dir_path: string): void {
  fs.mkdirSync(dir_path, {mode: 0o775, recursive: true})
}

export function remove_file_sync(file_path: string): void {
  fs.rmSync(file_path, {force: true})
}

export function remove_dir_sync(dir_path: string): void {
  fs.rmSync(dir_path, {force: true, recursive: true})
}

export function readlink_sync(file_path: string): string {
  return fs.readlinkSync(file_path)
}
