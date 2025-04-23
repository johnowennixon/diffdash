# Other Files

This document provides an overview of non-source files in the codebase. These files support the project's development, configuration, documentation, and deployment processes.

## Configuration Files

### .depcheckrc.json
Configuration for dependency checking tool that helps identify unused dependencies and maintain a clean dependency tree.

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

### package.json
Node.js project configuration defining the package name, version, dependencies, and scripts. Contains build commands, linting operations, and lists all project dependencies with their version requirements. Includes dependencies for multiple LLM providers (OpenAI, Anthropic, Google Gemini, and OpenRouter) via the appropriate SDK packages.

### pnpm-lock.yaml
PNPM lockfile that ensures consistent dependency installation across environments by recording exact versions of all installed packages and their dependencies.

### pnpm-workspace.yaml
PNPM workspace configuration file for managing the project structure, enabling package organization and dependency sharing within the monorepo.

### tsconfig.json
TypeScript configuration file that defines compilation settings including strict type checking, ES2023 target, module resolution strategies, and source file inclusion patterns. Enforces the strong typing that's a cornerstone of the codebase.

## Documentation Files

### CLAUDE.md
Specific instructions for Claude (the AI assistant) to follow when working with the codebase, ensuring consistent and correct interaction with the project.

### README.md
Primary project documentation providing an overview of Diffdash, a command-line tool for generating commit messages using AI. Includes installation instructions, usage examples, command-line options, and API key configuration details. Serves as the main reference for users looking to understand and utilize the tool's features.

### planning/architecture_guide.md
Comprehensive technical architecture document outlining the goals, components, workflow, and technology stack of the Diffdash tool. Details the core modules, their responsibilities, and how they interact to provide commit message generation functionality for staged changes.

### planning/codebase_summary.md
Comprehensive overview of the codebase, describing its structure, program categories, library categories, technical characteristics, and key features.

### planning/coding_style.md
Detailed coding style guidelines covering file naming, formatting, functions, variables, types, imports, and error handling practices that all contributors should follow.

### planning/editing_guidelines.md
Basic instructions for linting, building, and fixing formatting issues in the codebase to ensure code quality.

### planning/lessons_learned.md
Collection of insights and best practices discovered during the development process of the Diffdash tool. Summarizes important technical decisions, implementation strategies, and design improvements for future reference.

### planning/other_files.md
Comprehensive documentation of all non-source files in the codebase, explaining their purpose and functionality.

### planning/source_files.md
Comprehensive documentation of all source files in the codebase, explaining their purpose and functionality.

### planning/development_tasks.md
Detailed project roadmap organized in phases, tracking development progress through implementation tasks. Lists completed and remaining work items for transforming the codebase from a Git history rewriting tool into a tool that generates commit messages for staged changes using LLMs.

## Claude Command Files

### .claude/commands/create-codebase-summary.md
Command file that instructs Claude to create or update the codebase summary document. Provides instructions for generating a comprehensive overview of the project structure, functionality, and technical characteristics.

### .claude/commands/read-planning.md
Command file used to instruct Claude to read and process all planning documents in the project. Provides context about the codebase structure and development guidelines to assist with AI-powered development tasks.

### .claude/commands/update-other-files.md
Command file that instructs Claude to update the documentation of non-source files in the project. Contains instructions for checking file existence and documenting undocumented files with consistent formatting.

### .claude/commands/update-source-files.md
Command file that instructs Claude to update the documentation of source files in the project. Contains instructions for ensuring that all source files are properly documented with consistent formatting and accurate descriptions.
