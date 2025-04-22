# Lessons Learned

- Improve LLM understanding of binary file changes with diffstat summaries
- Use specialized libraries like Vercel AI SDK instead of direct API calls for better maintainability and easy integration of new LLM providers (OpenAI, Anthropic, Google Gemini)
- Design LLM interaction libraries to be general-purpose and reusable
- Pass application-specific parameters (like system prompts) from the application layer rather than hardcoding them in the LLM library
