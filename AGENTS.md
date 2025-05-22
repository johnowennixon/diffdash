# Planning

## Software Requirements Specification for DiffDash

### 1. Introduction

#### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the requirements for DiffDash, a command-line tool that generates high-quality Git commit messages using Large Language Models (LLMs). This document serves as the definitive source of information that describes the functionality, performance, and qualities of DiffDash.

#### 1.2 Scope

DiffDash shall be a standalone command-line tool that analyzes staged changes in a Git repository and uses LLMs to generate detailed, contextually appropriate commit messages. The tool shall streamline the Git workflow by automating the creation of consistent, descriptive commit messages while maintaining user control over the commit process.

#### 1.3 Definitions, Acronyms, and Abbreviations

* **CLI**: Command Line Interface
* **LLM**: Large Language Model
* **Git**: A distributed version control system
* **Commit**: A Git operation that records changes to a repository
* **Staged Changes**: Files that have been added to Git's staging area for inclusion in the next commit

#### 1.4 References

* Coding style and conventions as defined in planning/coding_style.md

#### 1.5 Overview

The remainder of this document details the functional and non-functional requirements, constraints, and assumptions for DiffDash. Section 2 describes the overall product perspective and functionality. Section 3 details specific functional requirements. Section 4 outlines interface requirements, while Section 5 covers performance requirements. Sections 6 and 7 address quality attributes and constraints, respectively.

### 2. Overall Description

#### 2.1 Product Perspective

DiffDash shall be a self-contained tool that integrates with existing Git repositories and workflows. It shall operate as a standalone command-line application that users can invoke to generate commit messages based on the changes they have staged in Git.

#### 2.2 Product Functions

DiffDash shall provide the following core functions:

* Analyze staged changes in a Git repository
* Generate descriptive commit messages using LLMs
* Present generated messages to users for confirmation or editing
* Create Git commits with the confirmed messages
* Optionally push commits to remote repositories

#### 2.3 User Classes and Characteristics

The primary users of DiffDash shall be software developers who:

* Use Git for version control
* Seek to improve the quality and consistency of their commit messages
* Value clear documentation of code changes
* Are comfortable with command-line tools

#### 2.4 Operating Environment

DiffDash shall operate in:

* Node.js runtime environment (v20+)
* Command-line terminal environments on major operating systems (Linux, macOS, Windows)
* Git repositories (local and connected to remote repositories)

#### 2.5 Design and Implementation Constraints

As agreed by stakeholders:

* The software shall run in Node.js and be distributed via npmjs.com
* The software shall be written in TypeScript
* The coding style shall adhere to standards documented in planning/coding_style.md

#### 2.6 Assumptions and Dependencies

* Users shall have Git installed and configured
* Users shall have internet access for LLM API communication
* Users shall have valid API keys for their chosen LLM provider

### 3. Functional Requirements

#### 3.1 Git Repository Analysis

* The system shall detect when it is run within a Git repository
* The system shall identify staged changes in the Git repository
* The system shall extract meaningful information from staged changes for message generation
* The system shall provide options to automatically stage changes when none are detected

#### 3.2 Message Generation

* The system shall use LLMs to generate Git commit messages based on staged changes
* The system shall support multiple LLM providers (OpenAI, Anthropic, DeepSeek, Google, OpenRouter)
* The system shall format generated messages with a summary line followed by detailed explanations
* The system shall validate generated messages for quality and format compliance
* The system shall append a footer that identifies the commit as AI-assisted

#### 3.3 User Interaction

* The system shall display generated commit messages to users before committing
* The system shall allow users to accept, edit, or cancel the generated message
* The system shall provide clear terminal output with colorized, formatted messages
* The system shall display detailed error messages with recovery suggestions when errors occur

#### 3.4 Commit Operations

* The system shall create Git commits using the confirmed message
* The system shall support options to automatically commit changes without user confirmation
* The system shall optionally push commits to remote repositories
* The system shall support bypassing Git hooks when specified

#### 3.5 Configuration

* The system shall allow users to specify their preferred LLM provider and model
* The system shall support automation flags for non-interactive operation
* The system shall support constraint options to limit functionality
* The system shall provide debugging options for LLM inputs and outputs

### 4. Interface Requirements

#### 4.1 User Interface

* The system shall provide a command-line interface for all interactions
* The system shall use color-coded output to enhance readability
* The system shall provide keyboard-based confirmation mechanisms

#### 4.2 Software Interfaces

* The system shall interface with Git using appropriate libraries
* The system shall communicate with LLM APIs over HTTPS
* The system shall respect Git configuration files and settings

### 5. Performance Requirements

#### 5.1 Response Time

* The system shall start up in under 1 second on typical development machines
* The system shall detect and analyze staged changes in under 2 seconds

#### 5.2 Throughput

* The system shall efficiently handle repositories with up to 100 staged files
* The system shall process diffs of up to 10,000 lines of code

#### 5.3 Resource Utilization

* The system shall have minimal memory overhead (<100MB) during normal operation
* The system shall not significantly impact system performance while running

### 6. Quality Attributes

#### 6.1 Usability

* The system shall provide clear, concise error messages
* The system shall offer intuitive command-line options with sensible defaults
* The system shall include help text for all commands and options

#### 6.2 Reliability

* The system shall handle network interruptions gracefully during LLM API communication
* The system shall prevent data loss by validating repository state before operations
* The system shall recover from errors when possible and suggest remediation steps

#### 6.3 Security

* The system shall securely manage LLM API credentials
* The system shall not transmit sensitive information to LLM providers
* The system shall respect Git's security mechanisms

#### 6.4 Maintainability

* The system shall follow a modular design for easy maintenance
* The system shall follow TypeScript best practices for code quality
* The system shall include appropriate error handling and logging

#### 6.5 Portability

* The system shall operate consistently across supported operating systems
* The system shall handle different terminal environments appropriately

### 7. Constraints

#### 7.1 Regulatory

* The system shall comply with relevant open-source licensing requirements
* The system shall respect terms of service for integrated LLM APIs

#### 7.2 Technical

* The system shall be compatible with Node.js v20 and above
* The system shall run on standard command-line terminals
* The system shall work with Git version 2.0 and above

#### 7.3 Business

* The system shall be distributed as an npm package
* The system shall be open-source with documentation for contributions

### 8. Future Considerations

The following items are identified as potential future enhancements but are not required for the initial release:

* Timeouts for LLM API calls
* Configuration file support
* Message quality metrics and suggestions
* Integration as a pre-commit hook

## Software Architecture Document

### 1. Introduction and Goals

* **Purpose:** This document details the architecture of DiffDash, a TypeScript command-line tool that generates commit messages for staged changes using Large Language Models (LLMs). It serves as a reference for developers, maintainers, and stakeholders to understand the system's design and implementation.

* **Context:** DiffDash is a standalone tool that integrates with Git repositories to streamline the commit workflow. It analyzes staged changes, generates a descriptive commit message using LLMs, and facilitates the creation of well-documented commits. The tool operates in a command-line environment and interfaces with various LLM providers.

* **Architectural Goals and Constraints:**
  * **Quality Attributes:**
    * Performance: Minimize latency during startup and LLM API calls
    * Usability: Provide intuitive CLI with clear feedback and error messages
    * Maintainability: Follow a modular design with clear separation of concerns
    * Extensibility: Support multiple LLM providers with a unified interface
    * Reliability: Handle errors gracefully and provide recovery suggestions
  * **Constraints:**
    * Must operate in Node.js environment (v22+)
    * Must be written in TypeScript with strict type checking
    * Must adhere to coding style guidelines defined in planning/coding_style.md
    * Must work with Git repositories using simple-git library
    * Must integrate with LLM providers through Vercel AI SDK

### 2. Architectural Overview

* **High-Level View:**

  ```text
  +------------------+     +---------------------+     +------------------+
  |                  |     |                     |     |                  |
  | CLI Interface    +---->+ Core Application    +---->+ Git Operations   |
  | (Config Parsing) |     | (Workflow Control)  |     | (simple-git)     |
  |                  |     |                     |     |                  |
  +------------------+     +---------------------+     +------------------+
                                 |         ^
                                 v         |
  +------------------+     +---------------------+     +------------------+
  |                  |     |                     |     |                  |
  | Message          +<--->+ LLM Integration     +<--->+ User Interaction |
  | Validation       |     | (API Communication) |     | (Confirmation)   |
  |                  |     |                     |     |                  |
  +------------------+     +---------------------+     +------------------+
  ```

* **Architectural Style and Patterns:**
  * **Modular Monolith:** The application follows a modular design with separate libraries for specific functionalities, organized in a single deployment unit. This architecture was chosen for simplicity, ease of development, and minimal operational complexity while maintaining good separation of concerns.

  * **Functional Programming:** The codebase emphasizes pure functions with minimal side effects, promoting predictability and testability. Most operations return values rather than modifying state.

  * **Facade Pattern:** Complex subsystems (Git operations, LLM integration) are wrapped in simplified interfaces to provide a unified API for the core application.

  * **Command Pattern:** CLI arguments are processed into command objects that encapsulate all the information needed to perform an operation.

  * **Pipeline Pattern:** The main application workflow follows a sequence of distinct phases (open repository, check staged changes, generate message, commit changes, push to remote) forming a processing pipeline.

### 3. Component Descriptions

* **CLI Interface (lib_diffdash_config)**
  * **Responsibility:** Processes command-line arguments and environment variables into a structured configuration object.
  * **Interfaces:** Exports `process_config()` function that returns a DiffDashConfig object.
  * **Dependencies:** Relies on lib_arg_infer for argument parsing and lib_llm_config for LLM-specific configuration.
  * **Key Technologies:** TypeScript, custom argument parsing.

* **Core Application Flow (lib_diffdash_core)**
  * **Responsibility:** Orchestrates the overall workflow of the application through a sequence of phases.
  * **Interfaces:** Exports `sequence_work()` function that coordinates the entire process.
  * **Dependencies:** Depends on Git utilities, message generation, and user interaction components.
  * **Key Technologies:** Async/await, modular function composition.

* **Git Operations**
  * **Git Repository Access (lib_git_simple_utils)**
    * **Responsibility:** Provides access to Git repositories and core Git operations.
    * **Interfaces:** Functions for repository validation, commit retrieval, and remote operations.
    * **Dependencies:** simple-git library.
    * **Key Technologies:** Git commands, promise-based API.

  * **Staged Changes Handler (lib_git_simple_staging)**
    * **Responsibility:** Manages operations related to Git's staging area.
    * **Interfaces:** Functions to check for changes, generate diffs, and create commits.
    * **Dependencies:** simple-git library.
    * **Key Technologies:** Git diff command, staging operations.

* **Message Generation System**
  * **Commit Message Generator (lib_git_message_generator)**
    * **Responsibility:** Coordinates the generation, validation, and formatting of commit messages.
    * **Interfaces:** Exports `generate_message()` function that returns a formatted commit message.
    * **Dependencies:** LLM chat module, prompt construction, message validation.
    * **Key Technologies:** Prompt engineering, message formatting.

  * **Prompt Construction (lib_git_message_prompt)**
    * **Responsibility:** Builds system and user prompts for LLM interaction.
    * **Interfaces:** Functions to create structured prompts with diff information.
    * **Dependencies:** None.
    * **Key Technologies:** String formatting, prompt engineering.

  * **Message Validation (lib_git_message_validate)**
    * **Responsibility:** Validates generated messages against quality criteria.
    * **Interfaces:** Functions to check message format and content quality.
    * **Dependencies:** None.
    * **Key Technologies:** String processing, validation rules.

* **LLM Integration**
  * **LLM Communication (lib_llm_chat)**
    * **Responsibility:** Handles communication with LLM providers.
    * **Interfaces:** Exports `call_llm()` function that returns LLM responses.
    * **Dependencies:** Vercel AI SDK, LLM provider configurations.
    * **Key Technologies:** API communication, response handling.

  * **LLM Configuration (lib_llm_config)**
    * **Responsibility:** Manages provider-specific settings and credentials.
    * **Interfaces:** Functions for provider selection, model defaults, and API key retrieval.
    * **Dependencies:** Environment variables.
    * **Key Technologies:** Configuration management.

* **User Interaction**
  * **Message Display (lib_git_message_ui)**
    * **Responsibility:** Presents generated commit messages to users.
    * **Interfaces:** Functions to format and display messages.
    * **Dependencies:** Terminal UI components.
    * **Key Technologies:** Terminal formatting, text presentation.

  * **User Confirmation (lib_readline_ui)**
    * **Responsibility:** Obtains user confirmation for actions.
    * **Interfaces:** Functions for yes/no prompts.
    * **Dependencies:** Node.js readline.
    * **Key Technologies:** Interactive prompts, user input handling.

* **Utility Libraries**
  * **Error Handling (lib_abort)**
    * **Responsibility:** Manages graceful termination with error messages.
    * **Interfaces:** Functions to abort execution with formatted errors.
    * **Dependencies:** Terminal output.
    * **Key Technologies:** Error formatting, process termination.

  * **Terminal Output (lib_tell, lib_ansi)**
    * **Responsibility:** Provides formatted terminal output with colors and styling.
    * **Interfaces:** Functions for different message types (info, warning, error).
    * **Dependencies:** None.
    * **Key Technologies:** ANSI escape sequences, text formatting.

### 4. Data Architecture

* **Data Flow:**
  1. **Configuration Data:** Command-line arguments flow into a structured DiffDashConfig object.
  2. **Git Repository Data:** Staged changes information (diffstat, detailed diff) is extracted from Git.
  3. **Prompt Data:** Git data is formatted into structured prompts for LLM processing.
  4. **LLM Response Data:** Generated text from LLM is validated and formatted as a commit message.
  5. **User Input Data:** Confirmation choices determine workflow progression.
  6. **Commit Message Data:** Final formatted message flows to Git commit operation.

* **Data Storage:**
  * The application operates primarily with in-memory data and does not persist information beyond Git's standard commits.
  * No database or file-based storage is used directly by the application.
  * All state is either ephemeral (during a single execution) or handled by Git.

* **Data Model:**
  * **DiffDashConfig:** Structured representation of user-provided configuration and defaults.
  * **GitMessagePromptDetails:** Contains diffstat and diff information for prompt generation.
  * **LlmResponse:** Structured representation of LLM API responses with success indicators.
  * **MessageValidationResult:** Results of commit message validation with potential fixes.

### 5. Interface Architecture

* **External Interfaces:**
  * **Git Interface:** Communicates with Git repositories through the simple-git library.
  * **LLM Provider APIs:** Interfaces with OpenAI, Anthropic, DeepSeek, Google Gemini, and OpenRouter through the Vercel AI SDK.
  * **Environment Variables:** Reads API keys and other configuration from environment variables.

* **User Interface:**
  * **Command-Line Arguments:** Primary method for configuration and behavior control.
  * **Interactive Prompts:** Yes/no confirmation dialogs for key decision points.
  * **Formatted Output:** Color-coded, structured terminal output for different message types.
  * **Message Display:** Formatted presentation of generated commit messages.

* **Internal Interfaces:**
  * **Module Interfaces:** Clear function exports with explicit TypeScript typing.
  * **Configuration Object:** Structured DiffDashConfig passed between components.
  * **Function Parameters:** Destructured objects for complex parameter sets.
  * **Error Propagation:** Consistent error handling and propagation patterns.

### 6. Deployment Architecture

* **Deployment Diagram:**

  ```text
  +------------------------------------------------+
  |                                                |
  |  User's Local Environment                      |
  |                                                |
  |  +------------------------------------------+  |
  |  |                                          |  |
  |  |  DiffDash CLI Application                |  |
  |  |  (Node.js Runtime)                       |  |
  |  |                                          |  |
  |  +------------------+--------------------+  |  |       +---------------+
  |                     |                       |  |       |               |
  |  +------------------v--------------------+  |  |       | LLM Provider  |
  |  |                                       |  |  |       | APIs          |
  |  |  Local Git Repository                 |  |  +------>+  - OpenAI     |
  |  |                                       |  |          |  - Anthropic  |
  |  +------------------+--------------------+  |          |  - DeepSeek   |
  |                     |                       |          |  - Google     |
  |                     |                       |          |  - OpenRouter |
  |  +------------------v--------------------+  |          |               |
  |  |                                       |  |          +---------------+
  |  |  Remote Git Repository (Optional)     |  |
  |  |                                       |  |
  |  +---------------------------------------+  |
  |                                             |
  +---------------------------------------------+
  ```

* **Scalability and Availability Considerations:**
  * The application is designed as a single-user tool running locally, so traditional scaling is not a primary concern.
  * Availability depends on external service (LLM API) uptime and network connectivity.
  * The application handles API failures gracefully with informative error messages.
  * For scenarios with limited connectivity, future versions could incorporate local caching strategies.

### 7. Security Architecture

* **Key Security Principles:**
  * **API Key Management:** API keys are read from environment variables rather than being hard-coded.
  * **Repository Safety:** Validation checks ensure operations only run on valid Git repositories.
  * **LLM Prompt Safety:** Careful prompt construction to avoid exposing sensitive information.
  * **User Confirmation:** Critical operations require explicit user confirmation.
  * **Error Exposure:** Error messages provide useful information without exposing sensitive details.
  * **Git Hook Integration:** Support for --no-verify flag provides flexibility with pre-existing hook setups.

### 8. Quality Attributes Considerations

* **Performance:**
  * The application prioritizes startup performance by minimizing dependencies.
  * Git commands are executed directly through simple-git to avoid spawning multiple processes.
  * Prompt construction is optimized to minimize LLM token usage while providing sufficient context.
  * The application uses asynchronous patterns to avoid blocking operations.
  * Trade-off: The application's performance is inherently bounded by LLM API response times.

* **Usability:**
  * Comprehensive error messages guide users when problems occur.
  * Color coding differentiates message types (info, warning, error, success).
  * Interactive confirmation prompts have sensible defaults (yes/no).
  * Command-line arguments follow a consistent pattern with clear help text.
  * Progress indicators clarify the current operation and sequence.
  * Trade-off: The application prioritizes clarity over conciseness in its messaging.

* **Maintainability:**
  * Modular design with single-responsibility libraries.
  * Consistent function naming conventions (snake_case per coding_style.md).
  * Strict TypeScript typing with explicit return types.
  * Clear separation between Git operations, LLM interaction, and user interface.
  * Regular code formatting through Biome.
  * Trade-off: More files and interfaces to maintain but with clearer boundaries.

* **Extensibility:**
  * Support for multiple LLM providers through a unified interface.
  * Provider-specific details encapsulated in configuration modules.
  * Modular prompt construction allows for customization.
  * Configuration structure designed for future additions.
  * Trade-off: Some complexity in provider abstraction for the benefit of flexibility.

* **Reliability:**
  * Comprehensive validation of repository state before operations.
  * Fallback mechanisms for message validation (suggested fixes).
  * Graceful handling of API failures with informative messages.
  * User confirmation as a safeguard for critical operations.
  * Trade-off: Multiple validation steps add slight overhead but improve robustness.

### 9. Key Architectural Decisions and Rationale

* **Modular Monolith Architecture**
  * **Decision:** Implement as a modular monolith rather than microservices or a more complex architecture.
  * **Context:** The application needs to run as a command-line tool on users' local machines.
  * **Alternatives Considered:** More loosely coupled service-based architecture with separate processes.
  * **Rationale:** A modular monolith provides the benefits of clear separation of concerns while avoiding the complexity of inter-process communication and deployment overhead. It's well-suited for a CLI tool that runs as a single process with a clear linear workflow.

* **Vercel AI SDK for LLM Integration**
  * **Decision:** Use the Vercel AI SDK as an abstraction layer for LLM provider APIs.
  * **Context:** The application needs to support multiple LLM providers with different APIs.
  * **Alternatives Considered:** Direct API calls to each provider; custom abstraction layer.
  * **Rationale:** The Vercel AI SDK provides a unified interface for multiple providers, reducing code duplication and simplifying the addition of new providers. It handles streaming, prompt formatting, and response parsing consistently across providers.

* **simple-git for Git Operations**
  * **Decision:** Use the simple-git library for Git repository interaction.
  * **Context:** The application needs to interact with Git repositories for various operations.
  * **Alternatives Considered:** Direct command execution via child_process; libgit2 bindings.
  * **Rationale:** simple-git provides a clean Promise-based API that aligns well with the async/await patterns used throughout the codebase. It abstracts away the complexities of Git command syntax and output parsing while remaining lightweight and focused.

* **Functional Programming Style**
  * **Decision:** Emphasize pure functions with explicit inputs and outputs.
  * **Context:** The codebase needs to be maintainable and testable.
  * **Alternatives Considered:** More object-oriented approach with classes and methods.
  * **Rationale:** Functional programming promotes code that is easier to reason about, test, and refactor. The codebase's operations naturally fit a transform-data model where each function takes inputs, processes them, and returns outputs with minimal side effects.

* **Multi-Phase Workflow**
  * **Decision:** Structure the application flow as distinct phases (open, add, commit, push).
  * **Context:** The commit message generation process involves several discrete steps.
  * **Alternatives Considered:** Monolithic workflow function; event-based architecture.
  * **Rationale:** Breaking the workflow into phases creates clearer responsibility boundaries and makes the code more maintainable. Each phase has a specific purpose and can be tested independently. The linear sequence aligns well with Git's natural commit workflow.

* **Interactive Confirmation by Default**
  * **Decision:** Require user confirmation for critical actions with automation flags for bypassing.
  * **Context:** Creating commits and pushing changes are significant operations that should be deliberate.
  * **Alternatives Considered:** Always automatic; configuration file with preferences.
  * **Rationale:** Requiring explicit confirmation by default prevents accidental commits or pushes while still providing automation options for users who want them. This balances safety with convenience and gives users control over their workflow.

* **Combined Diffstat and Detailed Diff**
  * **Decision:** Include both a summary diffstat and detailed diff in the LLM prompt.
  * **Context:** LLMs need adequate context to generate meaningful commit messages.
  * **Alternatives Considered:** Diffstat only; detailed diff only; file content snapshots.
  * **Rationale:** Providing both diffstat (for high-level overview) and detailed diff (for specific changes) gives the LLM sufficient context to understand both the scope and details of changes. This approach has proven to produce higher quality messages based on experimentation.

* **Strict Message Validation**
  * **Decision:** Implement validation for generated messages with automatic fixes when possible.
  * **Context:** LLM outputs can sometimes deviate from desired format or quality standards.
  * **Alternatives Considered:** No validation; manual user editing only.
  * **Rationale:** Automatic validation ensures consistent message quality and format while reducing user effort. Providing automatic fixes for common issues (like missing blank lines) improves the user experience without requiring manual intervention for minor formatting issues.

### 10. Glossary and Terminology

* **CLI:** Command Line Interface, the text-based interface through which users interact with DiffDash.
* **Diffstat:** A summary of the changes in a Git diff, showing files changed and lines added/removed.
* **Diff:** Detailed representation of changes between files, showing exact lines added, modified, or deleted.
* **LLM:** Large Language Model, an AI model trained on vast text data to generate human-like text responses.
* **Staged Changes:** Files that have been added to Git's staging area (index) for inclusion in the next commit.
* **API Key:** A secret token used to authenticate with an LLM provider's API.
* **Prompt:** Carefully constructed text input sent to an LLM to guide its response generation.
* **Monolith:** A software architectural style where all components are part of a single deployable unit.
* **Module:** A distinct unit of code with clear responsibilities and interfaces.
* **Facade:** A design pattern that provides a simplified interface to a complex subsystem.

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

## Source Files

This document provides a comprehensive reference for all source files in the codebase. Each file entry includes a concise description of its purpose, functionality, and implementation.

### Programs

#### diffdash.ts

Main entry point for the DiffDash tool. Orchestrates the process of configuring the application, validating the Git repository, analyzing staged changes, generating commit messages, and obtaining user confirmation before committing changes.

### Libraries

#### General Libraries

##### lib_abort.ts

Provides functions for handling unrecoverable errors with graceful termination. Implements a standard pattern for displaying error messages to users before exiting the program. Ensures consistent error handling across the codebase with functions that can be used for different severity levels.

##### lib_ansi.ts

Manages ANSI escape sequences for terminal text formatting and colors. Provides constants and functions for applying text styles like bold, italic, and colored output. Implements terminal capability detection to ensure compatibility across different environments.

##### lib_arg_infer.ts

Implements advanced type inference for command-line arguments using TypeScript's type system. Provides automatic type derivation from function signatures for strongly-typed CLI interfaces. Creates a declarative pattern for defining command arguments with proper TypeScript typing.

##### lib_assert_defined.ts

Provides utility functions for ensuring values are defined before use. Implements a type-safe assertion function that throws a descriptive error when an undefined value is encountered. Helps prevent runtime errors from undefined values propagating through the application.

##### lib_char.ts

Defines constants for frequently used character literals to maintain consistency across the codebase. Provides named references for special characters, whitespace, and punctuation marks. Implements character classification functions for identifying character types and properties.

##### lib_datetime.ts

Provides comprehensive date and time manipulation utilities with timezone awareness. Implements functions for parsing, formatting, and comparing datetime values with proper locale support. Offers tools for handling time durations, intervals, and date calculations.

##### lib_debug.ts

Implements debugging utilities for capturing and displaying diagnostic information. Provides functions for conditional debugging output with severity levels and source identification. Includes tools for performance monitoring and measuring execution time of operations.

##### lib_enabled.ts

Implements feature flags and conditional enablement with configurable toggle mechanisms. Provides utilities for enabling or disabling functionality based on environment, configuration, or runtime conditions. Includes hierarchical feature flag inheritance and override capabilities.

##### lib_env.ts

Provides utilities for working with environment variables in a type-safe manner. Implements functions for retrieving environment variables with fallbacks, empty defaults, or aborting when missing. Includes type definitions for environment records and methods for setting environment values.

##### lib_error.ts

Provides error handling utilities for different error scenarios. Implements functions to ignore errors, log errors to the console, and abort program execution with error messages. Ensures consistent error handling behavior across the application.

##### lib_file_path.ts

Manages file path operations with cross-platform compatibility and normalization. Provides utilities for path manipulation, joining, and resolution with proper handling of path separators. Implements safe path traversal with directory boundary enforcement.

##### lib_git_message_generate.ts

Generates Git commit messages using Large Language Models with structured prompts about code changes. Coordinates the creation of system and user prompts with diffstat and diff information. Handles API communication with LLM providers and returns formatted commit message responses.

##### lib_git_message_prompt.ts

Constructs prompts for LLM-based Git commit message generation. Exports functions to create system and user prompts incorporating Git diff information, original messages, and custom instructions for LLM-based message generation.

##### lib_git_message_schema.ts

Defines the structure and formatting rules for Git commit messages using Zod schema validation. Implements a standardized message format with a summary line and optional detailed explanation lines. Provides utility functions to format compliant commit messages with proper spacing and bullet points.

##### lib_git_message_ui.ts

Implements user interface components for displaying Git commit messages with proper formatting. Provides functions to present commit messages in a visually appealing format with consistent styling. Utilizes the text block display utilities for terminal output.

##### lib_git_message_validate.ts

Validates Git commit messages against quality and formatting criteria. Checks for issues like empty messages, excessive length, or insufficient content. Returns validation results with explanations and suggested replacements for invalid messages.

##### lib_git_simple_open.ts

Provides functions for opening and validating Git repositories. Implements repository path resolution, existence checking, and validation against bare repositories. Exports the SimpleGit type for use throughout the codebase.

##### lib_git_simple_staging.ts

Provides utilities for working with Git staged changes in a repository. Implements functions to check for staged and unstaged changes, generate diffstat summaries, and retrieve detailed diffs of staged files. Includes functionality for staging all changes and committing staged.

##### lib_inspect.ts

Enhances object inspection and pretty printing for debugging and logging purposes. Provides customizable object serialization with depth control and circular reference handling. Implements colorized output formatting for different data types and structures.

##### lib_llm_chat.ts

Interfaces with Large Language Model APIs for conversational AI functionality. Provides a unified interface for sending messages to different LLM providers. Implements message history management and context handling for maintaining conversation state.

##### lib_llm_config.ts

Manages configuration settings for integrating with Large Language Model providers. Provides structured configuration objects for API endpoints, authentication, and model parameters. Implements validation and normalization of LLM configuration options.

##### lib_llm_model.ts

Manages LLM model details, availability, and access across different providers. Defines interfaces for model details and access patterns with functions to find models by name and check availability based on API keys. Provides utilities for obtaining model access information with fallback mechanisms between direct provider access and OpenRouter.

##### lib_llm_models_diff.ts

Defines and manages the available LLM models for the DiffDash tool. Provides a mapping of model names to their implementation details including provider, model code, and cost information. Exports functions for retrieving model details and type definitions for LLM models.

##### lib_llm_provider.ts

Provides utilities for working with different LLM providers including Anthropic, DeepSeek, Google, OpenAI, and OpenRouter. Exports functions to retrieve provider information, access API keys from environment variables, and create AI SDK language model instances. Serves as a central point for provider-specific operations and standardizes provider interfaces.

##### lib_llm_tokens.ts

Provides utilities for estimating token counts in text sent to large language models. Implements model-specific token counting for accurate cost estimation and context length management. Uses the tiktoken library for OpenAI models and fallback estimation methods for other providers.

##### lib_package_details.ts

Extracts and exports package information from package.json. Provides constants for the program name and version for use throughout the application.

##### lib_parse_number.ts

Provides utility functions for parsing string values into numbers with proper handling of undefined values. Implements functions for converting strings to integers or floating-point numbers with fallbacks for empty or undefined inputs.

##### lib_stdio.ts

Manages standard input/output streams with utilities for reading, writing, and redirecting content. Provides functions for working with stdin, stdout, and stderr with proper encoding handling. Implements TTY detection and special character handling for terminal interaction.

##### lib_string_types.ts

Defines TypeScript type definitions for string-related operations. Provides type aliases for common string manipulation patterns including maps, predicates, replacers, and record objects. Serves as a central location for string-related type definitions used throughout the codebase.

##### lib_tell.ts

Provides user-facing message display utilities with formatted output and color support. Implements functions for displaying informational, warning, error, and success messages. Offers utilities for structured output presentation with consistent styling.

##### lib_tui_block.ts

Implements text-based user interface components for displaying formatted blocks of text. Provides utilities for creating bordered text blocks with optional titles and custom widths. Includes text centering and padding functions for consistent terminal output formatting.

##### lib_tui_justify.ts

Provides text justification utilities for terminal user interfaces with left, right, and center alignment options. Implements padding and truncation with customizable behavior for complex text layouts. Includes special handling for zero-padded numeric displays.

##### lib_tui_readline.ts

Creates interactive command-line prompts for user input. Implements a confirm function that prompts users with yes/no questions and returns boolean results based on user responses. Uses ANSI formatting for improved readability.

##### lib_tui_truncate.ts

Provides text truncation utilities for handling long strings in terminal interfaces. Implements functions for plain truncation and truncation with ellipsis to indicate that text has been cut off. Ensures consistent handling of text that exceeds available display space.

##### lib_type_infer.ts

Contains TypeScript utility types for advanced type manipulations. Implements helper types like Expand for better type inference and display in editors.

#### DiffDash Libraries

##### lib_diffdash_config.ts

Manages configuration settings for the DiffDash commit message generation tool. Implements argument parsing with comprehensive command-line options for controlling LLM provider selection, debugging, and process behavior. Provides options to disable specific phases of the workflow, including adding changes, displaying status, and pushing commits. Processes user-provided arguments into a structured DiffDashConfig object with appropriate defaults.

##### lib_diffdash_core.ts

Implements the core application flow for the DiffDash tool with the main sequence of operations. Orchestrates repository validation, staged changes detection, status display, message generation, and commit creation in a logical workflow. Provides a detailed listing of files staged for commit with clear categorization of new, modified, renamed, and deleted files. Provides user confirmation prompts at key decision points and handles optional push operations after commit.

##### lib_diffdash_modify.ts

Provides utilities for modifying Git commit messages with prefixes, suffixes, and standardized footers. Implements functions to add text to the beginning or end of the first line of a commit message. Includes functionality to append a footer with timestamp, program name, version, and LLM model information.

## Task Breakdown and Checklist

This document outlines the sequence of development tasks to transform the current codebase into the software envisaged in the Software Requirements Specification.

### Core Functionality

### Testing

* [ ] Create unit tests for core components
* [ ] Implement integration tests with mock Git repositories
* [ ] Test interactive flows with simulated user input
* [ ] Test with various LLM providers and configurations

### Documentation

* [ ] Create usage examples with screenshots
* [ ] Create guide for integration with development workflows

### Performance and Polish

* [ ] Create installation and distribution process
