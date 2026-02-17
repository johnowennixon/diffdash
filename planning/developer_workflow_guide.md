# Developer Workflow Guide for TypeScript

## Best Practices

* Keep It Simple Stupid: write code that is easy to understand and maintain.
* Don't Repeat Yourself: if sections of code are mostly the same then the code should be refactored.
* Principle of Least Astonishment: code should behave in a way that is expected by someone familiar with the language.
* Protect against simple mistakes: if function parameters are supplied in the wrong order the build should fail.
* Architect for testability: consider both unit tests and integration tests.

## Installing Software

* AI agents must never attempt to install system packages - if you want this done, it should be done by a human.

## Git Usage

* AI agents should not try and use Git to commit software - let the humans do this.

## Task Completion

Before considering any change as complete, you must:

* run a lint, and fix any errors
* run a build, and fix any errors
* run any tests if they exist
* update the planning documents
* update the README and other documentation

## Useful Bash snippets

Try running these Bash commands:

* to lint the code, run `bun run lint`
* to build the code, run `bun run build`
* to fix formatting issues in source code, run `bun run fix:biome`
* to fix formatting issues in markdown documents, run `bun run fix:markdownlint`

## Library Usage

* Prefer to use available libraries rather than writing code.
* Prefer to use libraries that are locally available rather than importing external libraries.

## Fixing lint errors

* Many errors, especially formatting errors, can be auto-fixed with `bun run fix:biome`.
* The diagnostic is there for a reason - don't mark errors as ignored unless you have found no way to fix them.

## Available Linux Commands

All common Linux utilities are available including:

* `bun` - our package manager for Node.
* `chmod` - change file permissions.
* `comm` - compare two sorted files line by line.
* `diff` - find differences between files.
* `find` - find files which have matching characteristics.
* `git` - examine the commit history and status of changes.
* `grep` - find specific lines from files.
* `sed` - stream editor.
* `sort` - sort a file or stream alphabetically.
* `xargs` - run a command for each line of the input
