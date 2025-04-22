import fs from "node:fs"

export default {}

export function read_binary(file_path: string): Buffer {
  return fs.readFileSync(file_path)
}

export function read_text(file_path: string): string {
  return fs.readFileSync(file_path, {encoding: "utf8"})
}

export function write_binary({file_path, data}: {file_path: string; data: Buffer}): void {
  fs.writeFileSync(file_path, data)
}

export function write_text({file_path, text}: {file_path: string; text: string}): void {
  fs.writeFileSync(file_path, text, {encoding: "utf8"})
}
