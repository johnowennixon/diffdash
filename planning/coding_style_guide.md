# Coding Style Guide for TypeScript

This document outlines the coding style conventions for our TypeScript projects. Adhering to these guidelines will help ensure code readability, maintainability, and collaboration within the team.

Many of these coding style rules are enforced using linters and other tools.

## Formatting and Structure

### Indentation

- Use 2 spaces for indentation. Avoid tabs.
- Consistent indentation should be maintained throughout the codebase.

### Line Length
- Aim for a maximum line length of 120 characters.
- Break lines where it improves readability, such as after commas, operators, or before long function arguments.

### Whitespace
- Use a single space around operators (e.g., `=`, `+`, `-`, `*`, `/`, `==`, `!=`, `&&`, `||`, `<`, `>`).
- Use a single space after commas in lists and object literals.
- Use blank lines to separate logical blocks of code, function definitions, class members, and control flow structures.
- Do not use bracket spacing.
- Use blank lines liberally within functions.
- Avoid having two blank lines in a row.
- Avoid trailing whitespace at the end of lines.
- All text files must end with a final newline.

### Braces and Curly Brackets
- For blocks (e.g., `if`, `else`, `for`, `while`, function bodies, class definitions), place the opening brace on the same line as the statement, followed by a space.
- Place the closing brace on a new line at the same indentation level as the opening statement.

### Semicolons
- Do not terminate statements with semicolons unless absolutely necessary.

### String Literals
- Use double quotes for string literals
- Use single quotes for string literals that contain double quotes
- Use template literals (with backticks) for string interpolation

## Naming Conventions

### Variables
- Use snake_case for variable names.
- Names should be descriptive and indicate the purpose of the variable.
- Avoid single-letter variable names except for very short-lived loop counters (e.g., `i`, `j`).
- Use meaningful boolean variable names that clearly indicate a true/false state (e.g., `is_active`, `has_feature`).

### Constants
- Use UPPER_SNAKE_CASE for module-level constant names.
- Declare constants using `const`.
- Consider using `as const`.

### Functions and Methods
- Use snake_case for function and method names.
- Names should be verbs or verb phrases that clearly indicate the action (e.g., `calculate_total`, `get_user_by_id`, `send_message`).

### Classes, Interfaces and other Types
- Use PascalCase for names of types and classes.
- Names should be nouns or noun phrases representing the object or concept the class models (e.g., `UserProfile`, `ShoppingCart`).

### Enums
- Do not add any new enums.

### Namespaces
- Do not add any new namespaces.

### Files
- Use snake_case for file names.
- Library modules should use the `lib_` prefix (e.g., `lib_tell.ts`).
- Many program filenames start with a two-character code.

## Comments
- Do not add comments to code that you haven't written.
- Do not write JSDoc comments.
- Do not write comments that can be easily intuited from the code.
- Absolutely write comments if the code is non-obvious or there is trickiness involved.
- Block comments may be used to temporarily remove code that might be added back later.
- Comments may be used as hints to linters.
- Prefer to name functions to make comments elsewhere unnecessary.
- If you think a comment is outdated, edit it or delete it.

## TypeScript Specific

### Formatting
- Always include a trailing comma in multi-line function parameter lists.

### Types
- We use TypeScript in strict mode.
- The `any` type is banned - both explicit and implicit.
- Functions should have their return types explicitly defined.
- Types must be imported with a `type` keyword.

### Functions
- Prefer named functions, but you can use arrow function for short inline functions.
- Prefer parameters using destructured objects for functions with many parameters.

### Arrays
- Prefer generic `Array<T>` syntax instead of `T[]`.

### Imports
- Use import/export syntax and avoid using `require`.
- All imports should be at the top of the module (after any module-level documentation comments).
- Group imports in the following order, separated by a blank line:
  1. Standard library imports
  2. Third-party imports
  3. Local module imports
- Groups of imports should be separated by blank line.
- Imports should be sorted alphabetically (on the imported filename) within each group.
- Prefer to import whole namespaces - except for types and constants.

## Programming Paradigm

### Style
- Most code should be written in a simple Imperative Programming style.
- Keep data structures simple and elegant - only use a class if necessary.
- Rather than singleton classes, just use a module.
- You may use `map`, `filter`, `reduce` and similar. But avoid more complex Functional Programming.
- Avoid Object-Oriented Programming unless there is a clear use-case.
- Consider using declarative structures if it simplifies the code and maintenance.

### Error Handling
- If an error is unrecoverable, prefer to immediately abort rather than throwing exceptions.
- If a function call can be reasonably expected to throw an exception, the exception should be caught and converted to a boolean result.
- Conversely, if a function call might throw an exception but this is not expected, prefer to let the exception pass up the call chain and be printed out by the top-level program.

## Other

### File Layout
- Source files should not be placed in a hierarchy.

### Characters
- Character literals (e.g. `"$"`) should be retrieved from `lib_char` instead of hardcoding - that includes the empty string.

### User Messages
- For messages displayed to the user, prefer curly quote marks to straight quote marks.
