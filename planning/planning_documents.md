# Planning Documents

Not all these file will exist - but if they do, this is what they should contain and who is allowed to edit them.

### planning/codebase_summary.md
A non-definitive overview of the codebase, describing its structure, program categories, library categories, technical characteristics, and key features.

AI coding agents may be asked to keep this file up-to-date.

### planning/coding_style.md
Detailed coding style guidelines covering file naming, formatting, functions, variables, types, imports, and error handling practices that all contributors should follow.

AI coding agents should not edit this file unless explicitly requested.

### planning/development_tasks.md
A checklist of planned tasks that need to be accomplished to meet the requirements. The tasks may be grouped into phases.

AI coding agents may maintain this document to be consistent with the progress towards completion. In particular, they should check tasks off when they are sure the task is complete.

### planning/editing_guidelines.md
Basic instructions for linting, building, and fixing formatting issues in the codebase to ensure code quality.

AI coding agents should not edit this file unless explicitly requested.

### planning/other_files.md
Documentation of all non-source, non-planning files in the codebase, explaining their purpose and functionality.

Files are grouped by type - executables and libraries - and often into groups within that. All files are listed in alphabetic order within their group.

AI coding agents may be asked to keep this file up-to-date.

### planning/planning_documents.md
Documentation of all planning files that might be in the codebase, explaining their purpose and functionality.

All files are listed in alphabetic order.

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
