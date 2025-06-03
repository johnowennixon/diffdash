import path from "node:path"

export function file_path_delimiter(): string {
  return path.delimiter
}

export function file_path_join(segment1: string, ...segments: Array<string>): string {
  return path.join(segment1, ...segments)
}

export function file_path_basename(file_path: string): string {
  return path.basename(file_path)
}

export function file_path_dirname(file_path: string): string {
  return path.dirname(file_path)
}

export function file_path_extname(file_path: string): string {
  return path.extname(file_path)
}

export function file_path_absolute(relative_path: string): string {
  return path.resolve(relative_path)
}

export function file_path_relative({base_dir, file_path}: {base_dir: string; file_path: string}): string {
  return path.relative(base_dir, file_path)
}
