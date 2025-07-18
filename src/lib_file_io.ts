import fs from "node:fs"

export function file_io_read_binary(file_path: string): Buffer {
  return fs.readFileSync(file_path)
}

export function file_io_read_text(file_path: string): string {
  return fs.readFileSync(file_path, {encoding: "utf8"})
}

export function file_io_write_binary({file_path, data}: {file_path: string; data: Buffer}): void {
  fs.writeFileSync(file_path, data)
}

export function file_io_write_text({file_path, text}: {file_path: string; text: string}): void {
  fs.writeFileSync(file_path, text, {encoding: "utf8"})
}
