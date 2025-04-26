# Developer Workflow Guide for TypeScript

## Installing software
- AI agents should not install NPM packages without asking
- AI agents should never install system packages - if they want this done it can be done by a human

## Completion checklist
- Before considering any change as complete, you must run a lint and build, and fix any errors
- To lint the code, run `pnpm run lint`
- To build the code, run `pnpm run build`
- If you need to fix formatting issues, try running `pnpm run fix:biome`

## Library Usage
- Prefer to use available libraries rather than writing code
- Prefer to use libraries that are locally available rather than importing external libraries
- Local libraries are shared between projects
- If you want to write a library, make it as general purpose as possible
- If you need to write a library that is only useful for this project, including this project's name in the filename

## Available local libraries
- Use local library `lib_abort` to handle unrecoverable errors
- Use local library `lib_ansi` to format text with ANSI codes like bold and italic
- Use local library `lib_arg` for construct command-line arguments for subpocesses
- Use local library `lib_arg_infer` for parsing the supplied command-line arguments
- Use local library `lib_assert` to enforce types and invariants
- Use local library `lib_char` instead of hard-coding character strings
- Use local library `lib_child` to spawn subprocess commands
- Use local library `lib_datetime` when processing timestamps
- Use local library `lib_debug` if you want to output a debug message
- Use local library `lib_env` to read environment variables
- Use local library `lib_file_io` if you need to read or write files
- Use local library `lib_file_path` as an alternative to Node's path library
- Use local library `lib_stdio` to output raw text to console
- Use local library `lib_tell` to output message lines to console in standard colour styles
- Use local library `lib_text` to manipulate strings contains many lines of text
- Use local library `lib_tui` to format output for text user interfaces
- and many more

# Comments
- Do not add comments to code that you haven't written
- Do not write JSDoc comments
- Do not write comments that can be easily intuited from the code
- Absolutely write comments if the code is non-obvious or there is trickiness involved
- Comments may be used to temporarily remove code that might be added back later
- Comments may be used as hints to linters
- Prefer to name functions to make comments elsewhere unnecessary
