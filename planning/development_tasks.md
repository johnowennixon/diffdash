# Development Tasks

This document outlines the sequence of development tasks to transform the current codebase from a Git history rewriting tool into a tool that generates commit messages for staged changes using LLMs.

## Core Functionality

### Refactoring and Structure
    - [x] Update package.json to reflect new project name and purpose
    - [x] Create new main entry point (diffdash.ts) focused on single commit flow
    - [x] Refactor configuration handler to remove history rewriting options
    - [x] Create simplified Git utility functions for staged changes

### Staged Changes Analysis
    - [x] Implement function to detect and validate staged changes
    - [x] Create function to generate diffstat for staged changes
    - [x] Create function to get detailed diff for staged changes

### Message Generation
    - [x] Adapt prompt generation for staged changes context
    - [x] Update message validator for commit messages
    - [x] Simplify footer generation (remove version comparison logic)
    - [x] Ensure proper LLM provider configuration and error handling
    - [x] Add support for OpenRouter as an LLM provider

### User Interaction
    - [x] Create interactive message display with syntax highlighting
    - [x] Implement user confirmation flow (accept/cancel)

### Git Operations
    - [x] Create function to commit staged changes with given message
    - [x] Add proper error handling for Git operations
    - [ ] Implement dry-run option to preview without committing

## Testing
    - [ ] Create unit tests for core components
    - [ ] Implement integration tests with mock Git repositories
    - [ ] Test interactive flows with simulated user input
    - [ ] Test with various LLM providers and configurations

## Documentation
    - [x] Create comprehensive README
    - [x] Document command-line options
    - [ ] Create usage examples with screenshots
    - [ ] Create guide for integration with development workflows
    - [x] Document footer format and customization options

## Performance and Polish
    - [x] Ensure fast startup and minimal latency
    - [x] Add colorized output for better user experience
    - [x] Implement clear error messages and recovery suggestions
    - [ ] Create installation and distribution process

## Additional Features
    - [x] Add support for custom message templates
    - [ ] Implement conventional commits option
    - [ ] Add pre-commit hook installation option
    - [ ] Create configuration file support for persistent settings
