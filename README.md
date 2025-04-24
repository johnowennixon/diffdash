# DiffDash

A command-line tool to generate Git commit messages using AI.

## Features

- Automatically analyzes staged changes in a Git repository
- Prompts to stage all changes when no staged changes are detected
- Generates detailed commit messages using an LLM (OpenAI, Anthropic, Google, or OpenRouter)
- Adds a footer to track AI assistance
- Prompts the users to accept or cancel the commit
- Offers to push changes to remote after successful commit

## Installation

```bash
# Clone the repository
git clone https://github.com/johnowennixon/diffdash.git
cd diffdash

# Install dependencies
pnpm install

# Build the project
pnpm build

# Link for development
pnpm link --global
```

## Usage

```bash
# Basic usage (uses defaults)
diffdash

# Specify LLM provider
diffdash --llm-provider openai

# Specify model
diffdash --llm-provider anthropic --llm-model claude-3.5-sonnet

# Use a specific model with OpenRouter
diffdash --llm-provider openrouter --llm-model google/gemini-2.5-flash-preview

# Automatically stage all changes, but still prompt for commit and push
diffdash --auto-add

# Automatically stage and commit changes, but still prompt for push
diffdash --auto-add --auto-commit

# Fully automated workflow (stage, commit, and push without prompts)
diffdash --auto-add --auto-commit --auto-push

# Generate message for already staged changes only (won't stage any new changes)
diffdash --disable-add

# Generate message and commit, but don't push or prompt to push
diffdash --disable-push

# Combine auto and disable options (auto-commit but don't allow adding or pushing)
diffdash --disable-add --auto-commit --disable-push

# Skip git hooks when pushing
diffdash --no-verify

# Fast, fully automated workflow without hooks
diffdash --auto-add --auto-commit --auto-push --no-verify

# Debug options
diffdash --debug-llm-inputs --debug-llm-outputs
```

## API Keys

DiffDash requires API keys for the LLM providers. These must be provided as environment variables:

```bash
# For OpenAI
export OPENAI_API_KEY=your-api-key

# For Anthropic
export ANTHROPIC_API_KEY=your-api-key

# For Google Gemini
export GEMINI_API_KEY=your-api-key

# For OpenRouter
export OPENROUTER_API_KEY=your-api-key
```

## Command Line Options

| Option | Description |
|--------|-------------|
| `--llm-provider` | LLM provider to use (openai, anthropic, google, openrouter) |
| `--llm-model` | LLM model to use from the selected provider (optional) |
| `--auto-add` | Automatically stage all changes without prompting |
| `--auto-commit` | Automatically commit changes without confirmation |
| `--auto-push` | Automatically push changes after commit without prompting |
| `--disable-add` | Disable adding unstaged changes (takes priority over --auto-add) |
| `--disable-push` | Disable pushing changes (takes priority over --auto-push) |
| `--no-verify` | Bypass git hooks when pushing with the --no-verify flag |
| `--debug-llm-inputs` | Show prompts sent to the LLM |
| `--debug-llm-outputs` | Show raw outputs from the LLM |

## Development

```bash
# Lint the code
pnpm lint

# Fix formatting issues
pnpm run fix:biome

# Build the project
pnpm build
```

## License

0BSD
