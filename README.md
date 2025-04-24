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
