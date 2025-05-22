# Memory

## Planning Documents

Not all these file will exist - but if they do, this is what they should contain and who is allowed to edit them.

### planning/codebase_summary.md

A non-definitive overview of the codebase, describing its structure, program categories, library categories, technical characteristics, and key features.

AI coding agents may be asked to keep this file up-to-date.

### planning/coding_style_guide.md

Detailed coding style guidelines covering file naming, formatting, functions, variables, types, imports, and error handling practices that all contributors should follow.

AI coding agents should not edit this file unless explicitly requested.

### planning/developer_workflow_guide.md

Basic instructions for linting, building, and fixing formatting issues in the codebase to ensure code quality.

AI coding agents should not edit this file unless explicitly requested.

### planning/other_files.md

Documentation of all non-source, non-test, non-planning files in the codebase, explaining their purpose and functionality.

Files are grouped by type - executables and libraries - and often into groups within that. All files are listed in alphabetic order within their group.

AI coding agents may be asked to keep this file up-to-date.

### planning/planning_documents.md

Documentation of all planning files that might be in the codebase, explaining their purpose and functionality.

All files are listed in alphabetic order.

AI coding agents should not edit this file unless explicitly requested.

### planning/problem_statement.md

A description of the problem that caused the software project to be started.

AI coding agents should not edit this file unless explicitly requested.

### planning/software_requirements_specification.md

This serves as the definitive source of information that describes the functionality, performance, and qualities of the software product to be developed. Its primary goal is to clearly and unambiguously articulate what the software must do to meet the needs of its stakeholders, without imposing specific design or implementation choices. This document acts as a contract between the development team and the stakeholders, ensuring a shared understanding of the product's scope and requirements. It will be used as the foundation for design, development, testing, and ultimately, the acceptance of the final product.

Anyone editing this file must take care to avoid adding architectural choices that are not really requirements.

AI coding agents should not edit this file unless explicitly requested.

### planning/software_architecture_document.md

The Software Architecture Document serves as a comprehensive blueprint for the software system, outlining its high-level structure, key components, and their interactions. It details the chosen architectural style and design patterns, explains how the architecture addresses critical quality attributes like performance, scalability, and security, and provides an overview of the data, interface, and deployment architectures. Crucially, it also documents the significant architectural decisions made, along with the rationale and trade-offs considered, providing a shared understanding of the system's fundamental design for all stakeholders and guiding the subsequent development efforts.

Anyone editing this file should take care to avoid duplicating requirements that are described in the Software Requirements Specification.

AI coding agents may be asked to keep this file up-to-date.

### planning/source_files.md

Documentation of all source files in the codebase, explaining their purpose and functionality.

Files are grouped by type - executables and libraries - and often into groups within that.
All files are listed in alphabetic order within their group.

AI coding agents should maintain this file to match the source files actually in the codebase.

### planning/task_breakdown_and_checklist.md

A checklist of planned tasks that need to be accomplished to meet the requirements. The tasks may be grouped into phases.

AI coding agents may maintain this document to be consistent with the progress towards completion. In particular, they should check tasks off when they are sure the task is complete.

### planning/work_in_progress.md

Saved summaries of work in progress when an AI coding agent ran out of context.

This file may be out-of-date but will give you an idea of past work.

AI coding agents may be asked to keep this file up-to-date.

## Codebase Summary

### Overview

This codebase is a collection of TypeScript utilities and programs focused on managing multiple related Git repositories (called "subsets"). The primary tool, `jn_subsets`, enables synchronizing common configuration files between repositories, performing Git operations across repositories, installing packages, running checks, and verifying binary symlinks. It follows strict TypeScript coding standards with an emphasis on strong typing, functional programming patterns, and consistent naming conventions.

### Structure

The codebase is organized into two main categories:

1. **Programs**: Stand-alone applications prefixed with `jn_` that provide specific functionality
2. **Libraries**: Utility modules prefixed with `lib_` that provide reusable functionality across programs

### TS-Subsets Core Features

* **Repository Synchronization**: Ensures common configuration files, build settings, and shared code are consistent across repositories
* **Multi-Repository Operations**: Run Git commands, searches, and other operations across multiple repositories at once
* **File Diffing**: Compare files between repositories to identify inconsistencies
* **Smart Synchronization**: Uses timestamp comparison to optimize file copying between repositories
* **Binary Management**: Verifies binary symlinks are correctly set up across a user's environment
* **Package Management**: Facilitates installing and updating dependencies across repositories

### Library Categories

The utility libraries can be grouped into several categories:

* **Core Utilities**: Basic functions for assertions, error handling, string manipulation
* **File System Operations**: Directory and file manipulation, path handling, searching
* **CLI Handling**: Argument parsing, terminal UI, ANSI colors
* **Git Integration**: Git command construction, output processing, and repository operations
* **Date/Time Operations**: Timestamp comparisons and formatting
* **Debug Utilities**: Debugging and diagnostic tools

### Technical Characteristics

* **Language**: TypeScript with strict type checking
* **Coding Style**: Snake case for variables and functions, PascalCase for types
* **Error Handling**: Consistent pattern using lib_assert and lib_abort
* **Module System**: ES modules with consistent import ordering
* **File Naming**: Snake case for all files
* **Character Handling**: Special character constants from lib_char

### Key Design Principles

* **Strong Typing**: Extensive use of TypeScript's type system with a ban on `any` type
* **Functional Approach**: Pure functions with minimal side effects where possible
* **Consistent Interfaces**: Similar function signatures across related modules
* **Platform Compatibility**: Cross-platform support for file operations and paths
* **Clear Error Messaging**: Detailed error messages for debugging
* **Modular Design**: Small, focused modules with specific responsibilities

## Source Files

This document provides a comprehensive reference for all source files in the codebase. Each file entry includes a concise description of its purpose, functionality, and implementation.

### Programs

#### JN (John Nixon) Programs

##### jn_subsets_binaries.ts

Focused utility that checks binary symlinks in the user's local bin directory. Verifies that command binaries are correctly linked to their expected package locations, ensuring tooling consistency across the development environment. Provides option to show detailed path information for debugging mismatched symlinks.

##### jn_subsets_typescript.ts

Command-line interface for managing consistent configurations and files across multiple related repositories (called "subsets"). Provides commands for synchronizing common files between repositories, comparing differences, installing packages, running checks, and performing Git operations. Uses lib_subsets_generic for the implementation details.

### Libraries

#### General Libraries

##### lib_abort.ts

Provides functions for handling unrecoverable errors with graceful termination. Implements a standard pattern for displaying error messages to users before exiting the program. Ensures consistent error handling across the codebase with functions that can be used for different severity levels.

##### lib_ansi.ts

Manages ANSI escape sequences for terminal text formatting and colors. Provides constants and functions for applying text styles like bold, italic, and colored output. Implements terminal capability detection to ensure compatibility across different environments.

##### lib_arg.ts

Provides a low-level foundation for command-line argument handling. Offers functions to extract and validate positional and named arguments from process.argv. Implements type checking and conversion for different parameter types in CLI applications.

##### lib_arg_infer.ts

Implements advanced type inference for command-line arguments using TypeScript's type system. Provides automatic type derivation from function signatures for strongly-typed CLI interfaces. Creates a declarative pattern for defining command arguments with proper TypeScript typing.

##### lib_array_get.ts

Provides safe access methods for array elements with boundary checking and default values. Implements functions to retrieve items by index with graceful handling of out-of-bounds situations. Offers utilities for accessing elements from the end of an array or retrieving ranges of elements.

##### lib_assert.ts

Provides type assertion utilities with clear error messages for runtime type checking. Implements functions to verify data shapes and value constraints with descriptive error handling. Creates a pattern for validating inputs across the codebase with consistent messaging.

##### lib_calendar.ts

Provides date and calendar manipulation functions with support for different calendar systems. Implements utilities for calculating business days, holidays, and date ranges. Offers formatting functions for displaying dates in various localized and standardized formats.

##### lib_char.ts

Defines constants for frequently used character literals to maintain consistency across the codebase. Provides named references for special characters, whitespace, and punctuation marks. Implements character classification functions for identifying character types and properties.

##### lib_child.ts

Manages child process execution with proper stdio handling and error management. Provides functions for running external commands with input/output redirection and signal handling. Implements utilities for capturing command output and checking exit codes of child processes.

##### lib_datetime.ts

Provides comprehensive date and time manipulation utilities with timezone awareness. Implements functions for parsing, formatting, and comparing datetime values with proper locale support. Offers tools for handling time durations, intervals, and date calculations.

##### lib_debug.ts

Implements debugging utilities for capturing and displaying diagnostic information. Provides functions for conditional debugging output with severity levels and source identification. Includes tools for performance monitoring and measuring execution time of operations.

##### lib_diff.ts

Calculates and formats differences between text strings, objects, and arrays. Provides utilities for generating human-readable representations of changes between versions. Implements various diff algorithms with configurable output formatting for different use cases.

##### lib_dir_sub.ts

Provides utilities for managing and navigating subdirectory structures within a project. Implements functions for creating, listing, and traversing hierarchical directory trees. Offers filtering capabilities to identify directories matching specific patterns or attributes.

##### lib_dir_user.ts

Manages directory paths specific to user home and configuration locations across platforms. Provides standardized access to user-specific storage locations for application data. Implements proper handling of differences between operating systems for user directory conventions.

##### lib_dot.ts

Manages dot notation access to nested object properties with safe traversal and default values. Provides utilities for getting and setting deeply nested properties using string paths. Implements type-safe property access with optional chaining behavior.

##### lib_dry_run.ts

Implements a dry run mode for operations that would normally modify system state. Provides utilities for simulating destructive operations without making actual changes. Includes detailed logging of what would happen during an actual execution.

##### lib_enabled.ts

Implements feature flags and conditional enablement with configurable toggle mechanisms. Provides utilities for enabling or disabling functionality based on environment, configuration, or runtime conditions. Includes hierarchical feature flag inheritance and override capabilities.

##### lib_env.ts

Manages environment variable access with type conversion and default value handling. Provides utilities for retrieving and validating environment variables with proper typing. Implements namespaced environment variable access with prefix handling for isolation.

##### lib_file_io.ts

Provides file input/output operations with robust error handling and automatic retries. Implements functions for reading, writing, and appending to files with various encoding options. Offers utilities for working with temporary files and secure file handling.

##### lib_file_path.ts

Manages file path operations with cross-platform compatibility and normalization. Provides utilities for path manipulation, joining, and resolution with proper handling of path separators. Implements safe path traversal with directory boundary enforcement.

##### lib_git_argv.ts

Defines Git command line argument vector builder functions for common Git operations. Provides functions like argv_status, argv_clone, argv_pull that construct proper command arguments with repository directory parameters. Ensures consistent Git command formatting with appropriate flags and options.

##### lib_git_output.ts

Processes and filters Git command output to detect meaningful changes. Provides predicates to determine if Git operations like fetch, pull, or status resulted in actual repository changes. Removes noise and irrelevant lines from Git command outputs for cleaner display.

##### lib_git_sync.ts

Implements synchronous Git command execution for operations that need immediate results. Provides blocking versions of Git commands like status, pull, and fetch when asynchronous execution is not appropriate. Offers consistent error handling and output processing similar to the async counterparts.

##### lib_inspect.ts

Enhances object inspection and pretty printing for debugging and logging purposes. Provides customizable object serialization with depth control and circular reference handling. Implements colorized output formatting for different data types and structures.

##### lib_jn_home.ts

Manages directory paths and structure for the user's home directory, particularly for repositories with three-letter acronyms. Provides constants and functions to access standard directory locations like CGG, HUB, JET, PRJ. Includes utilities to filter and identify Git repositories within these directories.

##### lib_json.ts

Handles JSON serialization and deserialization with enhanced error handling and formatting options. Provides functions for parsing and stringifying JSON with custom reviver and replacer functions. Implements utilities for working with JSON schemas and validation.

##### lib_subsets_generic.ts

Implements core functionality for managing multiple related repositories (subsets). Provides functions for repository synchronization, diffing files, running commands across repositories, and Git operations. Contains utility functions for comparing file timestamps, identifying file differences, and executing Git commands across repositories. Designed to be reusable with different sets of patterns and repository paths passed as parameters.

##### lib_subsets_node.ts

Provides Node.js-specific operations for working with multiple repositories. Includes functions for checking repository configurations, installing packages, and updating dependencies using tools like `ncu`. Separates Node.js-specific operations from the generic repository management functions in lib_subsets_generic.ts.

##### lib_stdio.ts

Manages standard input/output streams with utilities for reading, writing, and redirecting content. Provides functions for working with stdin, stdout, and stderr with proper encoding handling. Implements TTY detection and special character handling for terminal interaction.

##### lib_string_array.ts

Provides specialized utilities for working with arrays of strings with efficient manipulation functions. Implements common operations like unique filtering, pattern matching, and transformation. Offers advanced search capabilities across string collections with various matching strategies.

##### lib_string_function.ts

Implements functional programming utilities specifically designed for string operations. Provides higher-order functions for creating string transformers and processors. Includes composition utilities for building complex string manipulation pipelines.

##### lib_tell.ts

Provides user-facing message display utilities with formatted output and color support. Implements functions for displaying informational, warning, error, and success messages. Offers utilities for structured output presentation with consistent styling.

##### lib_text.ts

Implements comprehensive text processing utilities for manipulation, formatting, and analysis. Provides functions for common text operations like wrapping, padding, and case conversion. Includes tools for text metrics, search, and transformation with Unicode awareness.

##### lib_tui.ts

Implements terminal user interface components for interactive command-line applications. Provides utilities for creating menus, progress indicators, and formatted text displays. Offers screen layout management with proper cursor control and terminal capabilities.

##### lib_type.ts

Provides advanced TypeScript type utilities extending the language's built-in type system. Implements utility types for common patterns like deep partials, read-only recursion, and union manipulation. Offers runtime type checking functions that align with static TypeScript types.

##### lib_type_guard.ts

Implements TypeScript type guards for runtime type checking with static type integration. Provides reusable predicates that narrow types in conditional blocks. Creates patterns for validating complex data structures with precise type information.

##### lib_typescript.ts

Contains TypeScript utility types for advanced type manipulations. Implements helper types like Expand for better type inference and display in editors.

## Coding Style Guide for TypeScript

This document outlines the coding style conventions for our TypeScript projects. Adhering to these guidelines will help ensure code readability, maintainability, and collaboration within the team.

Many of these coding style rules are enforced using linters and other tools.

### Formatting and Structure

#### Indentation

* Use 2 spaces for indentation. Avoid tabs.
* Consistent indentation should be maintained throughout the codebase.

#### Line Length

* Aim for a maximum line length of 120 characters.
* Break lines where it improves readability, such as after commas, operators, or before long function arguments.

#### Whitespace

* Use a single space around operators (e.g., `=`, `+`, `-`, `*`, `/`, `==`, `!=`, `&&`, `||`, `<`, `>`).
* Use a single space after commas in lists and object literals.
* Use blank lines to separate logical blocks of code, function definitions, class members, and control flow structures.
* Do not use bracket spacing.
* Use blank lines liberally within functions.
* Avoid having two blank lines in a row.
* Avoid trailing whitespace at the end of lines.
* All text files must end with a final newline.

#### Braces and Curly Brackets

* For blocks (e.g., `if`, `else`, `for`, `while`, function bodies, class definitions), place the opening brace on the same line as the statement, followed by a space.
* Place the closing brace on a new line at the same indentation level as the opening statement.

#### Semicolons

* Do not terminate statements with semicolons unless absolutely necessary.

#### String Literals

* Use double quotes for string literals
* Use single quotes for string literals that contain double quotes
* Use template literals (with backticks) for string interpolation

### Naming Conventions

#### Variables

* Use snake_case for variable names.
* Names should be descriptive and indicate the purpose of the variable.
* Avoid single-letter variable names except for very short-lived loop counters (e.g., `i`, `j`).
* Use meaningful boolean variable names that clearly indicate a true/false state (e.g., `is_active`, `has_feature`).

#### Constants

* Use UPPER_SNAKE_CASE for module-level constant names.
* Declare constants using `const`.
* Consider using `as const`.

#### Functions and Methods

* Use snake_case for function and method names.
* Names should be verbs or verb phrases that clearly indicate the action (e.g., `calculate_total`, `get_user_by_id`, `send_message`).

#### Classes, Interfaces and other Types

* Use PascalCase for names of types and classes.
* Names should be nouns or noun phrases representing the object or concept the class models (e.g., `UserProfile`, `ShoppingCart`).

#### Enums

* Do not add any new enums.

#### Namespaces

* Do not add any new namespaces.

#### Files

* Use snake_case for file names.
* Library modules should use the `lib_` prefix (e.g., `lib_tell.ts`).
* Many program filenames start with a two-character code.

### Comments

* Do not add comments to code that you haven't written.
* Do not write JSDoc comments.
* Do not write comments that can be easily intuited from the code.
* Absolutely write comments if the code is non-obvious or there is trickiness involved.
* Block comments may be used to temporarily remove code that might be added back later.
* Comments may be used as hints to linters.
* Prefer to name functions to make comments elsewhere unnecessary.
* If you think a comment is outdated, edit it or delete it.

### TypeScript Specific

#### Formatting

* Always include a trailing comma in multi-line function parameter lists.

#### Types

* We use TypeScript in strict mode.
* The `any` type is banned - both explicit and implicit.
* If you use a type exported by another module, import the type itself instead of using a property of a namespace import.
* Types must be imported with a `type` keyword.

#### Functions

* Functions should have their return types explicitly defined.
* Prefer named functions, but you can use arrow function for short inline functions.
* Prefer parameters using destructured objects for functions with many parameters.

#### Arrays

* Prefer generic `Array<T>` syntax instead of `T[]`.

#### Imports

* Use import/export syntax and avoid using `require`.
* All imports should be at the top of the module (after any module-level documentation comments).
* Group imports in the following order, separated by a blank line:
  1. Standard library imports
  2. Third-party imports
  3. Local module imports
* Groups of imports should be separated by blank line.
* Imports should be sorted alphabetically (on the imported filename) within each group.
* Prefer to import whole namespaces - except for types and constants.

### Programming Paradigm

#### Style

* Most code should be written in a simple Imperative Programming style.
* Keep data structures simple and elegant - only use a class if necessary.
* Rather than singleton classes, just use a module.
* You may use `map`, `filter`, `reduce` and similar. But avoid more complex Functional Programming.
* Avoid Object-Oriented Programming unless there is a clear use-case.
* Consider using declarative structures if it simplifies the code and maintenance.

#### Error Handling

* If an error is unrecoverable, prefer to immediately abort rather than throwing exceptions.
* If a function call can be reasonably expected to throw an exception, the exception should be caught and converted to a boolean result.
* Conversely, if a function call might throw an exception but this is not expected, prefer to let the exception pass up the call chain and be printed out by the top-level program.

### Other

#### File Layout

* Source files should not be placed in a hierarchy.

#### Characters

* Character literals (e.g. `"$"`) should be retrieved from `lib_char` instead of hardcoding - that includes the empty string.

#### User Messages

* For messages displayed to the user, prefer curly quote marks to straight quote marks.

## Developer Workflow Guide for TypeScript

### Best Practices

* Keep It Simple Stupid: write code that is easy to understand and maintain.
* Don't Repeat Yourself: if sections of code are mostly the same then the code should be refactored.
* Principle of Least Astonishment: code should behave in a way that is expected by someone familiar with the language.
* Protect against simple mistakes: if function parameters are supplied in the wrong order the build should fail.
* Architect for testability: consider both unit tests and integration tests.

### Installing Software

* AI agents should not install NPM packages without asking.
* AI agents must never attempt to install system packages - if you want this done, it should be done by a human.

### Git Usage

* AI agents should not try and use Git to commit software - let the humans do this.

### Task Completion

Before considering any change as complete, you must:

* run a lint, and fix any errors
* run a build, and fix any errors
* run any tests if they exist
* consider updating the README and other documentation

### Useful Bash snippets

Try running these Bash commands:

* to lint the code, run `pnpm run lint`
* to build the code, run `pnpm run build`
* to fix formatting issues in source code, run `pnpm run fix:biome`
* to fix formatting issues in markdown documents, run `pnpm run fix:markdownlint`

### Library Usage

* Prefer to use available libraries rather than writing code.
* Prefer to use libraries that are locally available rather than importing external libraries.
* Local libraries are likely to shared between projects that you can not see.
* If you want to write a new library, make it as general purpose as possible.
* If you need to write a library that is only useful for this project, including this project's name in the filename.

### Fixing lint errors

* Many errors, especially formatting errors, can be auto-fixed with `pnpm run fix:biome`.
* The diagnostic is there for a reason - don't mark errors as ignored unless you have found no way to fix them.

### Available Linux Commands

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

### Available local libraries

* Use local library `lib_abort` to handle unrecoverable errors.
* Use local library `lib_ansi` to format text with ANSI codes like bold and italic.
* Use local library `lib_arg` for construct command-line arguments for subprocesses.
* Use local library `lib_arg_infer` for parsing the supplied command-line arguments.
* Use local library `lib_assert` to enforce types and invariants.
* Use local library `lib_char` instead of hard-coding character strings.
* Use local library `lib_child` to spawn subprocess commands.
* Use local library `lib_datetime` when processing timestamps.
* Use local library `lib_debug` if you want to output a debug message.
* Use local library `lib_env` to read environment variables.
* Use local library `lib_file_glob` to build lists of files that match patterns.
* Use local library `lib_file_io` if you need to read or write files.
* Use local library `lib_file_path` as an alternative to Node's path library.
* Use local library `lib_stdio` to output raw text to console.
* Use local library `lib_tell` to output message lines to console in standard colour styles.
* Use local library `lib_text` to manipulate strings contains many lines of text.
* Use local library `lib_tui_*` to format output for text user interfaces.
* There are many more local libraries - too numerous to list here.
