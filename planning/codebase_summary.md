# Codebase Summary

Diffdash is a TypeScript command-line tool that generates high-quality commit messages for staged changes using large language models (LLMs). It analyzes the current staged changes, creates a well-crafted commit message, and allows the user to accept, edit, or cancel the commit.

## Core Features

- Analyzes staged changes in a Git repository
- Generates descriptive commit messages using LLMs (OpenAI, Anthropic, Google Gemini)
- Displays the generated message with syntax highlighting
- Provides an interactive workflow to accept, edit, or cancel the commit
- Adds specialized footers to identify AI-assisted commits
- Supports message editing using the user's default editor
- Includes comprehensive validation to ensure quality messages

## Architecture

The codebase follows a modular design with specialized libraries:

1. **Core Execution Flow** (`diffdash.ts`):
   - Main entry point that orchestrates the entire process
   - Handles configuration, validation, user confirmation, and commit creation

2. **Git Operations** (`lib_git_*.ts`):
   - Repository access and validation
   - Staged changes analysis and diff formatting
   - Commit message generation and validation
   - Commit creation with generated message

3. **LLM Integration** (`lib_llm_*.ts`):
   - API communication with multiple LLM providers via Vercel AI SDK
   - Dynamic prompt generation incorporating diff context
   - Response validation and error handling

4. **User Interaction**:
   - Interactive confirmation with options to accept, edit, or cancel
   - Editor integration for message editing
   - Message validation with automatic fixes for common issues

5. **User Experience**:
   - Rich command-line interface with comprehensive options
   - Color-coded output with syntax highlighting for commit messages
   - Clear status messages during the process
   - Debug channels for LLM inputs/outputs

## Technology Stack

- TypeScript with strict type checking
- Node.js (v22+)
- simple-git for Git operations
- Vercel AI SDK for LLM interactions
- Biome for linting and formatting

## Development Status

The project has completed most implementation tasks, with remaining work focused on:
- Comprehensive testing
- Detailed documentation
- Performance optimization for large repositories
- Installation and distribution process
