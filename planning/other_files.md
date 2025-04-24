# Other Files

This document provides an overview of non-source files in the codebase. These files support the project's development, configuration, documentation, and deployment processes.

## Configuration Files

### .depcheckrc.json
Configuration for the dependency checking tool that helps identify unused dependencies and maintain a clean dependency tree.

### .editorconfig
Editor configuration file that helps maintain consistent coding styles across different editors and IDEs by defining indentation styles, end of line formats, and character sets.

### .gitattributes
Git configuration file that defines attributes for paths, controlling how Git handles line endings, merging strategies, and diff display for specific file types.

### .gitignore
Specifies intentionally untracked files that Git should ignore, including build artifacts, environment files, caches, and dependency directories.

### .ncurc.json
Configuration for npm-check-updates tool that helps manage package upgrades with rules for which packages can be automatically updated.

### .node-version
Specifies the exact Node.js version for the project, used by version managers to automatically switch to the correct Node.js version.

### .npmrc
NPM configuration file that defines package manager settings, registry connections, and publishing constraints.

### .nvmrc
Node Version Manager configuration file specifying the required Node.js version, ensuring consistent Node.js environments across developer machines.

### biome.json
Configuration for Biome, the JavaScript/TypeScript formatter and linter used in this project. Enforces code style rules including snake_case naming, 2-space indentation, 120 character line width, and other formatting preferences defined in the coding standards.

### CLAUDE.md
This is the project memory for Claude (the AI assistant). It will be read when starting a coding session. Normally it just tells Claude to read the planning documents.

### package.json
Node.js project configuration defining the package name, version, dependencies, and scripts. Contains build commands, linting operations, and lists all project dependencies with their version requirements.

### pnpm-lock.yaml
PNPM lockfile that ensures consistent dependency installation across environments by recording exact versions of all installed packages and their dependencies.

### pnpm-workspace.yaml
PNPM workspace configuration file for managing the project structure, enabling package organization and dependency sharing within the monorepo.

### tsconfig.json
TypeScript configuration file that defines compilation settings including strict type checking, ES2023 target, module resolution strategies, and source file inclusion patterns. Enforces the strong typing that's a cornerstone of the codebase.

## User Documentation

### README.md
Primary user documentation providing an overview, installation instructions, usage examples, command-line options, and configuration details. Serves as the main reference for users looking to understand and use the software.
