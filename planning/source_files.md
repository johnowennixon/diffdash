# Source Files

## Programs

### src/diffdash.ts

Provides a command-line interface for managing Git commits with AI assistance. Handles version checks, model listings, and sequence comparisons. Formats output with colored text and silent mode options.

## Libraries

### src/lib_abort.ts

Provides ways to stop a program with warnings or errors. Formats messages with colors for clarity. Always exits the process after displaying the message.

### src/lib_ansi.ts

Provides tools to add colors and styles to text in the terminal. Offers functions to make text bold, dim, italic, or colored in various shades. Also includes a way to remove ANSI color codes from text.

### src/lib_char_box.ts

Provides a constant for the Unicode heavy horizontal box drawing character. The character can be used to create visual dividers or borders in text-based interfaces. This single constant is part of what appears to be a collection of box-drawing characters for text formatting.

### src/lib_char_control.ts

Defines common character control codes for text processing. Exports constants for special characters like backspace, carriage return, escape, and line feed. Can be imported by other modules needing standardized character representations.

### src/lib_char_digit.ts

Provides string representations of the digits from 0 to 9 as named constants. Makes code more readable by allowing developers to reference digit characters by name instead of using string literals. Helps maintain consistency when working with digit characters throughout an application.

### src/lib_char_empty.ts

Provides a constant for an empty string. Helps avoid magic strings in code. Can be imported wherever an empty string literal is needed.

### src/lib_char_punctuation.ts

Provides named constants for common punctuation and special characters. Makes code more readable by replacing literal character use with descriptive variable names. Helps prevent typos and improves maintainability when working with special characters in string operations.

### src/lib_cli.ts

Provides tools for defining and parsing command-line arguments with support for various types like strings, numbers, and choices. Handles nested argument structures and optional or required fields. Includes functions to execute commands based on parsed arguments.

### src/lib_datetime.ts

Provides functions to work with dates and times in various formats. Handles parsing, formatting, and adjusting dates for local or UTC time. Supports converting timestamps and ISO strings into readable or compact representations.

### src/lib_debug.ts

Provides a way to manage and control debugging channels for different parts of an application. Allows enabling or disabling specific debug channels based on environment variables. Offers functions to inspect and log objects with optional names and conditional checks.

### src/lib_diffdash_add.ts

Provides a way to modify Git commit messages by adding prefixes or suffixes to the first line. Adds a footer with details like the program name, version, timestamp, and model used. Works with plain text messages and ensures proper formatting with line breaks.

### src/lib_diffdash_cli.ts

Provides options for controlling how Git commit messages are generated and handled. Supports adding prefixes or suffixes to messages and automating Git actions like staging, committing, and pushing. Includes debugging features for inspecting inputs and outputs when working with large language models.

### src/lib_diffdash_config.ts

Provides configuration settings for managing version control and language model interactions. Handles options like auto-commit, auto-push, and disabling specific actions. Also manages language model configurations and debug settings for inputs and outputs.

### src/lib_diffdash_llm.ts

Provides a list of supported LLM models and their default or fallback options. Exposes details and choices for these models to be used elsewhere. Relies on environment variables to set the default model if specified.

### src/lib_diffdash_sequence.ts

Handles the sequence of steps for managing Git commits and changes. Provides options to add, preview, commit, and push changes with various configurations. Supports comparing different commit message generation models before finalizing.

### src/lib_duration.ts

Measures time intervals with high precision using system timers. Provides methods to start, stop, and calculate durations in nanoseconds, seconds, or milliseconds. Supports both exact and rounded values for convenience.

### src/lib_enabled.ts

Converts string values like \"0\", \"1\", \"true\", or \"false\" into a boolean, with a fallback option. Handles environment variables by checking their string values against common boolean representations. Ignores case and supports custom defaults for missing or invalid inputs.

### src/lib_env.ts

Provides utilities for working with environment variables. Handles fetching values with fallbacks or errors if missing. Allows setting new values in the environment.

### src/lib_error.ts

Provides ways to handle errors in a simple and flexible manner. Logs errors to the console or ignores them silently. Converts errors to readable text and can abort execution with a custom message.

### src/lib_file_path.ts

Provides utilities for working with file paths in a Node.js environment. Helps join, split, and analyze paths to files or directories. Offers methods to get the base name, directory, extension, or absolute path of a file.

### src/lib_git_message_display.ts

Displays Git commit messages in a formatted block with optional titles and separators. Uses a helper to center titles and pad lines for visual clarity. Relies on an external function to output the formatted content.

### src/lib_git_message_generate.ts

Generates Git commit messages using a language model, either in structured or unstructured format. Handles errors and tracks the time taken for the process. Returns the generated message or an error if something goes wrong.

### src/lib_git_message_prompt.ts

Provides prompts for generating Git commit messages in a conversational style. Formats the output as either structured JSON or unstructured text based on user preference. Includes reminders about Git diff syntax and guidelines for writing clear, concise messages.

### src/lib_git_message_schema.ts

Provides a way to structure and validate Git commit messages. Defines a schema for a summary line and additional details. Formats the message with proper spacing and bullet points for extra lines.

### src/lib_git_message_validate.ts

Checks if a Git commit message meets specific formatting rules. Ensures the message is not too short or too long and follows a structured format with bullet points. Reports validation failures with clear reasons for rejection.

### src/lib_git_simple_open.ts

Provides tools for working with git repositories in a simple way. Checks if a directory is a valid git repository and ensures it is not bare or has conflicts. Uses helper functions to handle errors and resolve file paths.

### src/lib_git_simple_staging.ts

Checks for staged and unstaged changes in a Git repository. Stages all changes and retrieves details about staged differences. Creates commits and pushes changes to a remote repository with optional verification.

### src/lib_inspect.ts

Provides a way to convert objects into formatted strings for inspection. Uses Node.js's built-in inspection tool with customizable depth and colors. Helps debug complex objects by showing their structure clearly.

### src/lib_llm_access.ts

Provides tools to check and retrieve access details for large language models. Determines if a model is available based on provider and API key checks. Handles fallback options when direct access is not possible.

### src/lib_llm_api.ts

Provides tools for working with different language model providers. Determines how a provider is accessed and retrieves its API key from the environment. Creates a language model instance based on the specified provider and model code.

### src/lib_llm_chat.ts

Provides tools for interacting with language models to generate text or structured data. Handles configuration like timeouts, temperature, and token limits for model inputs. Supports debugging by logging inputs and outputs during the process.

### src/lib_llm_config.ts

Provides configuration details for language models, including model names, provider information, and API keys. Helps retrieve and manage model configurations based on available choices and access rules. Also includes utilities to display model details in a user-friendly format.

### src/lib_llm_list.ts

Displays a formatted table of language model details including names, context sizes, and costs. Formats the data with right-aligned numbers and currency symbols for clarity. Outputs the table to the standard output for easy viewing.

### src/lib_llm_model.ts

Provides details about various language models, including their names, providers, and costs. Lists models with specific attributes like context window size and support for structured JSON. Offers functions to filter and retrieve model details based on given criteria.

### src/lib_llm_tokens.ts

Provides a way to estimate token counts for text based on the LLM model being used. Uses different methods for specific models like GPT variants and falls back to a simple length-based estimate otherwise. Also includes a debug utility to log token usage details when enabled.

### src/lib_package.ts

Provides the name and version of the program from the package.json file. Handles scoped package names by removing the scope prefix. Returns default values if the name or version are missing.

### src/lib_parse_number.ts

Converts strings to numbers or undefined if the input is empty or undefined. Handles both integers and floating-point values. Provides simple parsing with no additional formatting or validation.

### src/lib_stdio_write.ts

Provides utilities for interacting with standard output and error streams in a terminal. Checks if the streams are available and retrieves their column widths. Writes messages to the streams with optional line feeds.

### src/lib_string_types.ts

Defines types for working with strings in various ways. Includes types for maps, predicates, replacers, and objects that use strings. Focuses on string manipulation and storage without implementing specific logic.

### src/lib_tell.ts

Provides colored output for messages with optional timestamps. Supports different message types like errors, warnings, and success notifications. Silently ignores messages if configured or outputs them to standard error.

### src/lib_tui_block.ts

Creates a bordered block of text with optional title and padding. Centers the title if provided and surrounds the content with separator lines. Uses a simple layout to make the content stand out visually.

### src/lib_tui_justify.ts

Aligns text to the left, right, or center within a given width, optionally truncating or adding ellipsis. Pads text with spaces or zeros to fit the specified length. Centers text by evenly distributing padding on both sides.

### src/lib_tui_readline.ts

Provides a way to ask for user confirmation in a terminal with a yes-or-no prompt. Formats the question in bold blue text for better visibility. Waits for the user's input and returns true for affirmative answers or false otherwise.

### src/lib_tui_table.ts

Creates formatted tables for terminal output with optional bold headings. Adds rows to the table and converts it to a string for display. Uses a third-party library for table styling and formatting.

### src/lib_tui_truncate.ts

Trims strings to a given length, either plainly or with an ellipsis. Handles cases where truncation is not needed or disabled. Uses a space and ellipsis for truncated text when specified.

### src/lib_type_infer.ts

Infers and expands types for objects, ensuring all properties are explicitly included. Handles lowercase conversion for string array properties, mapping them to lowercase keys. Provides utility types for working with dynamic or inferred data structures.
