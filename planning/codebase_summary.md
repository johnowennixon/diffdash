# Codebase Summary

Diffdash is a TypeScript command-line tool that generates high-quality commit messages for staged changes using large language models (LLMs). It analyzes the current staged changes, creates a well-crafted commit message, and allows the user to accept, edit, or cancel the commit.

## Core Features

- Analyzes staged changes in a Git repository
- Generates descriptive commit messages using LLMs (OpenAI, Anthropic, Google Gemini, OpenRouter)
- Displays the generated message with syntax highlighting
- Provides an interactive workflow to accept, edit, or cancel the commit
- Adds specialized footers to identify AI-assisted commits
- Supports message editing using the user's default editor
- Includes comprehensive validation to ensure quality messages
- Offers to push changes to remote after successful commit
- Prompts to stage all changes when no staged changes are detected

## Architecture

The codebase follows a modular design with specialized libraries:

1. **Core Execution Flow** (`diffdash.ts`):
   - Main entry point that orchestrates the entire process
   - Handles configuration, validation, user confirmation, and commit creation

2. **Git Operations** (`lib_git_*.ts`):
   - Repository access and validation (`lib_git_simple_utils.ts`)
   - Staged changes analysis and diff formatting (`lib_git_simple_staging.ts`)
   - Commit message generation (`lib_git_message_generator.ts`)
   - Message validation and fixing common issues (`lib_git_message_validate.ts`)
   - UI presentation for commit messages (`lib_git_message_ui.ts`)

3. **LLM Integration** (`lib_llm_*.ts`):
   - API communication with multiple LLM providers via Vercel AI SDK (`lib_llm_chat.ts`)
   - Configuration management for LLM providers (`lib_llm_config.ts`)
   - Prompt engineering for generating quality commit messages (`lib_git_message_prompt.ts`)

4. **User Interaction**:
   - Interactive confirmation with options to accept, edit, or cancel (`lib_readline_prompt.ts`)
   - Command-line argument parsing and configuration (`lib_diffdash_config.ts`, `lib_arg_infer.ts`)
   - User messaging and console output (`lib_tell.ts`, `lib_ansi.ts`)

5. **Utility Functions**:
   - File path manipulation (`lib_file_path.ts`)
   - File I/O operations (`lib_file_io.ts`)
   - Error handling and graceful abortion (`lib_abort.ts`)
   - Debugging tools (`lib_debug.ts`)
   - Date/time formatting (`lib_datetime.ts`)
   - Package information access (`lib_package_details.ts`)

## Workflow

1. **Initialization**:
   - The process begins with `diffdash.ts`, which processes command-line arguments and environment variables
   - The application validates the current directory is a valid Git repository
   - It checks for staged changes and aborts if none exist

2. **Diff Analysis**:
   - Retrieves the staged diff and diffstat using simple-git library
   - Formats the diff information for LLM consumption

3. **Message Generation**:
   - Constructs a prompt containing the staged changes
   - Sends the prompt to the configured LLM provider (OpenAI, Anthropic, or Google)
   - Processes the LLM response to extract the commit message
   - Validates the message for quality and format requirements
   - Applies automatic fixes for common issues when possible

4. **User Interaction**:
   - Displays the generated commit message with proper formatting
   - Prompts the user to accept, edit, or reject the message
   - Creates the Git commit if accepted
   - Offers to push changes to remote after successful commit

## Technologies and Dependencies

- **Core Technologies**:
  - TypeScript with strict type checking (ES2023 target)
  - Node.js (v22+)
  - Vercel AI SDK for LLM integration

- **Key Dependencies**:
  - `simple-git`: Git repository operations
  - `@ai-sdk/*`: Provider-specific clients for LLM integration (OpenAI, Anthropic, Google)
  - `ai`: Vercel's AI SDK for generative AI interactions
  - `ansis`: Terminal color and styling
  - `argparse`: Command-line argument parsing

- **Development Tools**:
  - Biome: Modern linting, formatting, and code quality tools
  - TypeScript with strict configuration
  - Custom tooling for build management (shebangs, chmod)

## Design Patterns and Architecture Choices

1. **Modularity**: The codebase follows a modular design with clear separation of concerns. Each library file has a specific purpose and focuses on a single aspect of functionality.

2. **Functional Programming**: Functions are designed to be pure when possible, with minimal side effects and clear inputs/outputs.

3. **Immutability**: Data is treated as immutable where appropriate, reducing the risk of unexpected state changes.

4. **Error Handling**: The application uses a consistent pattern for error handling, with structured error messages and graceful exits.

5. **Dependency Injection**: Components receive their dependencies as parameters rather than creating them directly, enhancing testability.

6. **Type Safety**: The project uses TypeScript with a strict type-checking configuration, reducing runtime errors through static analysis.

7. **Prompt Engineering**: Carefully designed LLM prompts that structure the input and output format for consistent results.

8. **Message Validation**: Automatic validation and fixing of generated commit messages ensures they meet quality standards.

9. **Command Line Interface**: Structured and user-friendly CLI with clear error messages and interactive elements.

10. **Flexibility**: Support for multiple LLM providers (OpenAI, Anthropic, Google Gemini, OpenRouter) allows users to choose their preferred service.

## Development Status

The project has completed most implementation tasks, with remaining work focused on:
- Comprehensive testing
- Detailed documentation
- Performance optimization for large repositories
- Installation and distribution process
