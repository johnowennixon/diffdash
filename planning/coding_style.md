# Coding Style

## Enforcement
- Many of these coding style rules will be enforced using lint and other tools

## File Naming
- Use snake_case for filenames

## Formatting
- Indentation is made with two spaces
- Lines can be up to 120 characters long
- Do not terminate statements with semicolons
- Use trailing commas
- Do not use bracket spacing
- No trailing spaces at end of lines
- All text files must end with a final newline

## Blank lines
- Separate functions with a single blank line
- Use blank lines liberally within functions

## Strings
- Use double quotes for string literals

## Functions
- Use snake_case for function names that are defined in this codebase
- Prefer named functions, but you can use arrow function for short inline functions
- Functions should have their return types explicitly defined

## Variables
- Use snake_case for variables and UPPER_CASE for module-level constants

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
- Group imports as imports from Node, imports from packages, and local imports (in that order)
- Groups separated by blank line
- Imports should be sorted alphabetically (on the imported filename) within their group
- Types must be imported with a `type` keyword - this will be enforced by lint
- Prefer to import whole namespaces - except for types and constants

## Characters
- Character literals (e.g. "*"), need to be replaced with an import from lib_char.ts - that includes the empty string

## Utilities
- Use modules with names starting `lib_` for common functionality

## Error Handling
- Use lib_assert to enforce types
- Use lib_abort to handle unrecoverable errors

## Curly quotes
- For messages displayed to the user, I prefer curly quote marks to straight quote marks
