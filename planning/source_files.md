# Source Files

This document provides a comprehensive reference for all source files in the codebase. Each file entry includes a concise description of its purpose, functionality, and implementation.

## Programs

### diffdash.ts
Main entry point for the DiffDash tool. Orchestrates the process of configuring the application, validating the Git repository, analyzing staged changes, generating commit messages, and obtaining user confirmation before committing changes.

## Libraries

### General Libraries

#### lib_abort.ts
Provides functions for handling unrecoverable errors with graceful termination. Implements a standard pattern for displaying error messages to users before exiting the program. Ensures consistent error handling across the codebase with functions that can be used for different severity levels.

#### lib_ansi.ts
Manages ANSI escape sequences for terminal text formatting and colors. Provides constants and functions for applying text styles like bold, italic, and colored output. Implements terminal capability detection to ensure compatibility across different environments.

#### lib_arg_infer.ts
Implements advanced type inference for command-line arguments using TypeScript's type system. Provides automatic type derivation from function signatures for strongly-typed CLI interfaces. Creates a declarative pattern for defining command arguments with proper TypeScript typing.

#### lib_char.ts
Defines constants for frequently used character literals to maintain consistency across the codebase. Provides named references for special characters, whitespace, and punctuation marks. Implements character classification functions for identifying character types and properties.

#### lib_datetime.ts
Provides comprehensive date and time manipulation utilities with timezone awareness. Implements functions for parsing, formatting, and comparing datetime values with proper locale support. Offers tools for handling time durations, intervals, and date calculations.

#### lib_debug.ts
Implements debugging utilities for capturing and displaying diagnostic information. Provides functions for conditional debugging output with severity levels and source identification. Includes tools for performance monitoring and measuring execution time of operations.

#### lib_enabled.ts
Implements feature flags and conditional enablement with configurable toggle mechanisms. Provides utilities for enabling or disabling functionality based on environment, configuration, or runtime conditions. Includes hierarchical feature flag inheritance and override capabilities.

#### lib_env.ts
Provides utilities for working with environment variables in a type-safe manner. Implements functions for retrieving environment variables with fallbacks, empty defaults, or aborting when missing. Includes type definitions for environment records and methods for setting environment values.

#### lib_file_path.ts
Manages file path operations with cross-platform compatibility and normalization. Provides utilities for path manipulation, joining, and resolution with proper handling of path separators. Implements safe path traversal with directory boundary enforcement.

#### lib_git_message_generator.ts
Handles the generation of Git commit messages using Large Language Models. Coordinates prompt creation, LLM API calls, message validation, and footer addition for a seamless message generation process. Provides utilities to format and enhance the generated message for optimal commit history.

#### lib_git_message_prompt.ts
Constructs prompts for LLM-based Git commit message generation. Exports functions to create system and user prompts incorporating Git diff information, original messages, and custom instructions for LLM-based message generation.

#### lib_git_message_ui.ts
Implements user interface components for displaying Git commit messages with proper formatting. Provides functions to present commit messages in a visually appealing format with consistent styling. Utilizes the text block display utilities for terminal output.

#### lib_git_message_validate.ts
Validates Git commit messages against quality and formatting criteria. Checks for issues like empty messages, excessive length, or insufficient content. Returns validation results with explanations and suggested replacements for invalid messages.

#### lib_git_simple_staging.ts
Provides utilities for working with Git staged changes in a repository. Implements functions to check for staged and unstaged changes, generate diffstat summaries, and retrieve detailed diffs of staged files. Includes functionality for staging all changes and committing staged.

#### lib_git_simple_utils.ts
Contains utility functions for common Git operations with simplified interfaces. Abstracts away complex Git command details to provide easy-to-use helper functions. Includes functions for checking repository status, extracting branch information, manipulating Git config, and pushing changes to remote repositories.

#### lib_inspect.ts
Enhances object inspection and pretty printing for debugging and logging purposes. Provides customizable object serialization with depth control and circular reference handling. Implements colorized output formatting for different data types and structures.

#### lib_llm_chat.ts
Interfaces with Large Language Model APIs for conversational AI functionality. Provides a unified interface for sending messages to different LLM providers. Implements message history management and context handling for maintaining conversation state.

#### lib_llm_config.ts
Manages configuration settings for integrating with Large Language Model providers (OpenAI, Anthropic, Google Gemini, and OpenRouter). Provides structured configuration objects for API endpoints, authentication, and model parameters. Implements validation and normalization of LLM configuration options.

#### lib_package_details.ts
Extracts and exports package information from package.json. Provides constants for the program name and version for use throughout the application.

#### lib_readline_ui.ts
Creates interactive command-line prompts for user input. Implements a confirm function that prompts users with yes/no questions and returns boolean results.

#### lib_stdio.ts
Manages standard input/output streams with utilities for reading, writing, and redirecting content. Provides functions for working with stdin, stdout, and stderr with proper encoding handling. Implements TTY detection and special character handling for terminal interaction.

#### lib_tell.ts
Provides user-facing message display utilities with formatted output and color support. Implements functions for displaying informational, warning, error, and success messages. Offers utilities for structured output presentation with consistent styling.

#### lib_tui_block.ts
Implements text-based user interface components for displaying formatted blocks of text. Provides utilities for creating bordered text blocks with optional titles and custom widths. Includes text centering and padding functions for consistent terminal output formatting.

#### lib_type.ts
Provides advanced TypeScript type utilities extending the language's built-in type system. Implements utility types for common patterns like deep partials, read-only recursion, and union manipulation. Offers runtime type checking functions that align with static TypeScript types.

#### lib_typescript.ts
Contains TypeScript utility types for advanced type manipulations. Implements helper types like Expand for better type inference and display in editors.

### DiffDash Libraries

#### lib_diffdash_config.ts
Manages configuration settings for the DiffDash commit message generation tool. Implements argument parsing with comprehensive command-line options for controlling LLM provider selection, debugging, and process behavior. Processes user-provided arguments into a structured DiffDashConfig object with appropriate defaults.

#### lib_diffdash_core.ts
Implements the core application flow for the DiffDash tool with the main sequence of operations. Orchestrates repository validation, staged changes detection, message generation, and commit creation in a logical workflow. Provides user confirmation prompts at key decision points and handles optional push operations after commit.
