import path from "node:path"

export default {}

export function path_delimiter(): string {
  return path.delimiter
}

export function path_join(segment1: string, ...segments: Array<string>): string {
  return path.join(segment1, ...segments)
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

export function path_absolute(relative_path: string): string {
  return path.resolve(relative_path)
}

export function path_relative({base_dir, file_path}: {base_dir: string; file_path: string}): string {
  return path.relative(base_dir, file_path)
}
