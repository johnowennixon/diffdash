# Diffdash

A command-line tool to generate high-quality commit messages for staged changes using AI.

## Features

- Automatically analyzes staged changes in a Git repository
- Generates detailed commit messages using an LLM (OpenAI, Anthropic, or Google)
- Displays messages with helpful syntax highlighting
- Allows users to accept, edit, or cancel commits
- Adds a footer to track AI assistance
- Includes diffstat summaries in the context

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
diffdash --llm-provider anthropic --llm-model claude-3-opus-20240229

# Customize the prompt
diffdash --user-prompt-suffix "Include information about the purpose of these changes."

# Debug options
diffdash --debug-llm-inputs --debug-llm-outputs
```

## API Keys

Diffdash requires API keys for the LLM providers. These can be provided as environment variables:

```bash
# For OpenAI (default provider)
export OPENAI_API_KEY=your-api-key

# For Anthropic
export ANTHROPIC_API_KEY=your-api-key

# For Google
export GOOGLE_API_KEY=your-api-key
```

Or passed as command-line arguments:

```bash
diffdash --llm-provider openai --openai-api-key your-api-key
```

## Command Line Options

| Option | Description |
|--------|-------------|
| `--repo-path` | Path to the Git repository (defaults to current directory) |
| `--llm-provider` | LLM provider to use (openai, anthropic, google) |
| `--llm-model` | LLM model to use from the selected provider |
| `--openai-api-key` | OpenAI API key |
| `--anthropic-api-key` | Anthropic API key |
| `--google-api-key` | Google API key |
| `--system-prompt` | Custom system prompt for the LLM |
| `--user-prompt-prefix` | Text to include at the beginning of the user prompt |
| `--user-prompt-suffix` | Text to include at the end of the user prompt |
| `--min-message-length` | Minimum length for commit messages |
| `--max-message-length` | Maximum length for commit messages |
| `--debug-llm-inputs` | Show prompts sent to the LLM |
| `--debug-llm-outputs` | Show raw outputs from the LLM |
| `--verbose` | Enable verbose output |

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