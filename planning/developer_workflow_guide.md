# Developer Workflow Guide for TypeScript

## Best Practices

* Keep It Simple Stupid: write code that is easy to understand and maintain.
* Don't Repeat Yourself: if sections of code are mostly the same then the code should be refactored.
* Principle of Least Astonishment: code should behave in a way that is expected by someone familiar with the language.
* Protect against simple mistakes: if function parameters are supplied in the wrong order the build should fail.
* Architect for testability: consider both unit tests and integration tests.

## Installing Software

* AI agents should not install NPM packages without asking.
* AI agents must never attempt to install system packages - if you want this done, it should be done by a human.

## Git Usage

* AI agents should not try and use Git to commit software - let the humans do this.

## Task Completion

Before considering any change as complete, you must:

* run a lint, and fix any errors
* run a build, and fix any errors
* run any tests if they exist
* consider updating the README and other documentation

## Useful Bash snippets

Try running these Bash commands:

* to lint the code, run `pnpm run lint`
* to build the code, run `pnpm run build`
* to fix formatting issues in source code, run `pnpm run fix:biome`
* to fix formatting issues in markdown documents, run `pnpm run fix:markdownlint`

## Library Usage

* Prefer to use available libraries rather than writing code.
* Prefer to use libraries that are locally available rather than importing external libraries.
* Local libraries are likely to shared between projects that you can not see.
* If you want to write a new library, make it as general purpose as possible.
* If you need to write a library that is only useful for this project, including this project's name in the filename.

## Fixing lint errors

* Many errors, especially formatting errors, can be auto-fixed with `pnpm run fix:biome`.
* The diagnostic is there for a reason - don't mark errors as ignored unless you have found no way to fix them.

## Available Linux Commands

All common Linux utilities are available including:

* `chmod` - change file permissions.
* `comm` - compare two sorted files line by line.
* `diff` - find differences between files.
* `find` - find files which have matching characteristics.
* `git` - examine the commit history and status of changes.
* `grep` - find specific lines from files.
* `pnpm` - for access to Node packages and scripts.
* `sort` - sort a file or stream alphabetically.
* `xargs` - run a command for each line of the input

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
