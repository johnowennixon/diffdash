# Software Architecture Document

## 1. Introduction and Goals

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

## 2. Architectural Overview

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

## 3. Component Descriptions

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

## 4. Data Architecture

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

## 5. Interface Architecture

* **External Interfaces:**
  * **Git Interface:** Communicates with Git repositories through the simple-git library.
  * **LLM Provider APIs:** Interfaces with Anthropic, DeepSeek, Google Gemini, OpenAI, and OpenRouter through the Vercel AI SDK.
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

## 6. Deployment Architecture

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
  |  |  Local Git Repository                 |  |  +------>+  - Anthropic  |
  |  |                                       |  |          |  - DeepSeek   |
  |  +------------------+--------------------+  |          |  - Google     |
  |                     |                       |          |  - OpenAI     |
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

## 7. Security Architecture

* **Key Security Principles:**
  * **API Key Management:** API keys are read from environment variables rather than being hard-coded.
  * **Repository Safety:** Validation checks ensure operations only run on valid Git repositories.
  * **LLM Prompt Safety:** Careful prompt construction to avoid exposing sensitive information.
  * **User Confirmation:** Critical operations require explicit user confirmation.
  * **Error Exposure:** Error messages provide useful information without exposing sensitive details.
  * **Git Hook Integration:** Support for --no-verify flag provides flexibility with pre-existing hook setups.

## 8. Quality Attributes Considerations

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

## 9. Key Architectural Decisions and Rationale

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

## 10. Glossary and Terminology

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
