Please read as much of this codebase as you need and then draft `planning/software_requirements_specification.md`.

This serves as the definitive source of information that describes the functionality, performance, and qualities of the software product to be developed. Its primary goal is to clearly and unambiguously articulate what the software must do to meet the needs of its stakeholders, without imposing specific design or implementation choices. This document acts as a contract between the development team and the stakeholders, ensuring a shared understanding of the product's scope and requirements. It will be used as the foundation for design, development, testing, and ultimately, the acceptance of the final product.

I appreciate that you are not familiar with the stakeholders and consequently do not really know what they want. However I need you to make your best guess of what they did want based on the software that has already been developed.

Software Requirements Specifications do not include details of the technical implementation. However you may assume that the stakeholders decided that:
- The software would run in Node.js and be distributed using npmjs.com
- The software would be written in TypeScript
- The coding style you find in these planning documents was agreed (you must not elaborate on its content - just reference the document)

Here is some more information on how to write a Software Requirements Specification (SRS):

**Focus on "What," Not "How":**
Explicitly state that the SRS will concentrate on the observable behavior and capabilities of the software from the user's perspective and the system's interactions with its environment.
Emphasize that it will describe what tasks users can perform, what data the system will handle, and what qualities the system must possess, rather than detailing the internal components, technologies, or algorithms to be used.

**Functional Requirements at a Logical Level:**
Describe functional requirements using use cases, user stories with acceptance criteria, or logical data flows. These techniques focus on the interaction and the outcome without specifying the underlying mechanisms.
For example, instead of saying "The system will use a REST API to communicate with the database," say "The system shall allow authorized users to retrieve customer order details."

**Non-Functional Requirements Focused on Qualities:**
Clearly define non-functional requirements (performance, security, usability, etc.) in terms of measurable outcomes and constraints rather than specific technologies or architectural patterns.
For example, instead of saying "The system will use a three-tier architecture for scalability," say "The system shall be able to handle 100 concurrent users with an average response time of under 2 seconds for key transactions."

**Interface Requirements Describing Interactions:**
For interface requirements (user interface, external system interfaces), focus on what information is exchanged, the format, and the interaction protocols at a high level.
For example, describe the data fields that need to be displayed on a user screen or the data format for exchanging information with an external system, without specifying the UI framework or the exact API implementation.

**Data Requirements Describing Information:**
Define the types of data the system will store, manage, and process, as well as any constraints on data integrity and security.
Avoid specifying the database schema or data storage technology in the SRS. For example, describe the attributes of a "Customer" entity rather than the columns in a specific database table.

**Postpone Design Decisions:**
Explicitly state that architectural and design decisions will be addressed in subsequent design documents based on the requirements outlined in the SRS.
The development team will use the SRS as input to determine the most appropriate architecture and technologies to meet the specified needs.

**Use Clear and Unambiguous Language:**
Employ precise terminology and avoid vague or subjective statements that could be interpreted in multiple ways and lead to design assumptions.
