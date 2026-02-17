# Local Library Guide for TypeScript

## General

* Local libraries should be placed in the root of the `src` directory.
* Local libraries should use the `lib_` prefix (e.g., `lib_tell.ts`).
* If you want a hierarchical structure of libraries, use multiple segments in the library filename e.g `lib_char_digit.ts`.
* Local libraries are likely to synced between projects that you can not see - so don't make breaking changes.
* If you want to write a new local library, make it as general purpose as possible.
* If you need to write a local library that is only useful for this project, include this project's name in the filename.

## Available local libraries

* Use local library `lib_abort` to handle unrecoverable errors.
* Use local library `lib_ansi` to format text with ANSI codes like bold and italic.
* Use local library `lib_arg_push` for construct command-line arguments for subprocesses.
* Use local libraries `lib_assert_*` to enforce types and invariants.
* Use local libraries `lib_char_*` instead of hard-coding character strings.
* Use local library `lib_child` to spawn subprocess commands.
* Use local library `lib_cli` for parsing the supplied command-line arguments.
* Use local library `lib_datetime` when processing timestamps.
* Use local library `lib_debug` if you want to output a debug message.
* Use local library `lib_env` to read environment variables.
* Use local library `lib_file_glob` to build lists of files that match patterns.
* Use local library `lib_file_io` if you need to read or write files.
* Use local library `lib_file_path` as an alternative to Node's path library.
* Use local library `lib_stdio_write` to output raw text to console.
* Use local library `lib_tell` to output message lines to console in standard colour styles.
* Use local library `lib_text` to manipulate strings contains many lines of text.
* Use local libraries `lib_tui_*` to format output for text user interfaces.
* There are many more local libraries - too numerous to list here.
* If you can see the `jet` folder, you can copy libraries from there to this project.
* If you do copy a library from `jet`, please also copy the associated markdown file within the `doc` directory.
