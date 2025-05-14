# Coding Guidelines

## Commands

* Build: `pnpm run build`
* Lint: `pnpm run lint`
* Fix formatting: `pnpm run fix:biome`
* Fix markdown: `pnpm run fix:markdownlint`

## Style Guide

* No semicolons
* No tabs, use 2 spaces for indentation
* 120 character line length
* snake_case for variables/functions, PascalCase for types/classes
* Double quotes for strings, template literals for interpolation
* Use `Array<T>` instead of `T[]`
* Explicit function return types
* Imports: sorted alphabetically by filename, grouped by stdlib/third-party/local
* No enums or namespaces
* Type imports must use `type` keyword
* Prefer abort over exceptions for unrecoverable errors
* No JSDoc comments, comment only non-obvious code
* Use `lib_char` for character literals

Refer to full documents in planning/ directory for details.
