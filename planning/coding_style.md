# Coding Style

## Enforcement
- Many of these coding style rules are enforced using lint and other tools

## File Naming
- Use snake_case for filenames
- Library modules should use the `lib_` prefix (e.g., `lib_tell`)
- Many program filenames start with a two-character code

## Formatting
- Indentation is made with two spaces
- Lines can be up to 120 characters long
- Do not use trailing spaces at end of lines
- All text files must end with a final newline
- Do not terminate statements with semicolons
- Use trailing commas
- Do not use bracket spacing

## Blank lines
- Separate functions with a single blank line
- Use blank lines liberally within functions

## Strings
- Use double quotes for string literals
- Use single quotes for strings that contain double quotes
- Use template literals (with backticks) for string interpolation

## Functions
- Use snake_case for function names that are defined in this codebase
- Prefer named functions, but you can use arrow function for short inline functions
- Functions should have their return types explicitly defined
- Always include a trailing comma in multi-line function parameter lists
- Prefer parameters using destructured objects for functions with many parameters

## Variables
- Use snake_case for variables and UPPER_CASE for module-level constants
- Avoid single-character variable names, except for very short loops or mathematical formulas

## Types
- Use PascalCase for types
- Names of types should be unique in the codebase - even if they don't conflict
- We use TypeScript in strict mode
- The `any` type is banned - both explicit and implicit

## Arrays
- Prefer generic Array<T> syntax over T[]

## Enums
-  Do not define any new enums

## Imports
- Use ES modules (import/export) syntax, not CommonJS (require)
- Group imports in the following order, separated by a blank line:
  1. Standard library imports
  2. Third-party imports
  3. Local module imports
- Groups of imports should be separated by blank line
- Imports should be sorted alphabetically (on the imported filename) within each group
- Types must be imported with a `type` keyword
- Prefer to import whole namespaces - except for types and constants

## Characters
- Character literals (e.g. "$") should be retrieved from `lib_char` instead of hardcoding - that includes the empty string

## Error Handling
- Use `lib_assert` to enforce types and invariants
- Use `lib_abort` to handle unrecoverable errors

## User Messages
- For messages displayed to the user, I prefer curly quote marks to straight quote marks

## Variable Naming Conventions
- Functions which are top-level commands should be prefixed with `do_`

## Command-line Interface
- Use `lib_arg_infer` for command-line argument parsing
