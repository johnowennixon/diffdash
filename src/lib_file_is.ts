import fs from "node:fs"

export function file_is_dir(dir_path: string): boolean {
  try {
    return fs.statSync(dir_path).isDirectory()
  } catch {
    return false
  }
}

export function file_is_file(file_path: string): boolean {
  try {
    return fs.statSync(file_path).isFile()
  } catch {
    return false
  }
}

export function file_is_socket(file_path: string): boolean {
  try {
    return fs.statSync(file_path).isSocket()
  } catch {
    return false
  }
}

export function file_is_executable(file_path: string): boolean {
  try {
    fs.accessSync(file_path, fs.constants.X_OK)
    return true
  } catch {
    return false
  }
}
