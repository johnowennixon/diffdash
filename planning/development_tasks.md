# Development Tasks

This document outlines the sequence of development tasks to transform the current codebase from a Git history rewriting tool into a tool that generates commit messages for staged changes using LLMs.

## Core Functionality

### Refactoring and Structure
    - [ ] Update package.json to reflect new project name and purpose
    - [ ] Create new main entry point (diffdash.ts) focused on single commit flow
    - [ ] Refactor configuration handler to remove history rewriting options
    - [ ] Create simplified Git utility functions for staged changes

### Staged Changes Analysis
    - [ ] Implement function to detect and validate staged changes
    - [ ] Create function to generate diffstat for staged changes
    - [ ] Create function to get detailed diff for staged changes
    - [ ] Add branch and recent commit context collection

### Message Generation
    - [ ] Adapt prompt generation for staged changes context
    - [ ] Update message validator for commit messages
    - [ ] Simplify footer generation (remove version comparison logic)
    - [ ] Ensure proper LLM provider configuration and error handling

### User Interaction
    - [ ] Create interactive message display with syntax highlighting
    - [ ] Implement user confirmation flow (accept/edit/cancel)
    - [ ] Add message editing capabilities with editor integration
    - [ ] Implement final confirmation after edits

### Git Operations
    - [ ] Create function to commit staged changes with given message
    - [ ] Add proper error handling for Git operations
    - [ ] Implement dry-run option to preview without committing

## Testing
    - [ ] Create unit tests for core components
    - [ ] Implement integration tests with mock Git repositories
    - [ ] Test interactive flows with simulated user input
    - [ ] Test with various LLM providers and configurations

## Documentation
    - [ ] Create comprehensive README
    - [ ] Document command-line options
    - [ ] Create usage examples with screenshots
    - [ ] Create guide for integration with development workflows
    - [ ] Document footer format and customization options

## Performance and Polish
    - [ ] Ensure fast startup and minimal latency
    - [ ] Add colorized output for better user experience
    - [ ] Implement clear error messages and recovery suggestions
    - [ ] Create installation and distribution process

## Additional Features
    - [ ] Add support for custom message templates
    - [ ] Implement conventional commits option
    - [ ] Add pre-commit hook installation option
    - [ ] Create configuration file support for persistent settings
