Please read as much of this codebase as you need and then draft `planning/software_architecture_document.md`.

The Software Architecture Document serves as a comprehensive blueprint for the software system, outlining its high-level structure, key components, and their interactions. It details the chosen architectural style and design patterns, explains how the architecture addresses critical quality attributes like performance, scalability, and security, and provides an overview of the data, interface, and deployment architectures. Crucially, it also documents the significant architectural decisions made, along with the rationale and trade-offs considered, providing a shared understanding of the system's fundamental design for all stakeholders and guiding the subsequent development efforts.

I appreciate that you are not familiar with the design team and consequently do not really know the nuances of their decisions. However I need you to make your best guess of how they made their decision based on your experience and the software that has already been developed.

Assume that the Software Requirements Specification and Coding Style documents you find hereabouts are available - but nothing else. They can be referenced, but do not elaborate on their content.

Here is a template for the Software Architecture Document (SAD) - feel free to improve it:

# Software Architecture Document

## 1. Introduction and Goals

* **Purpose:** Clearly states the document's objective, scope, and intended audience (e.g., development team, stakeholders, testers). Defines the system aspects covered.
* **Context:** Briefly describes the system being architected, its business objectives, and its relationship with other systems.
* **Architectural Goals and Constraints:** Outlines the key quality attributes the architecture aims to achieve (derived from SRS non-functional requirements) such as performance, scalability, security, usability, maintainability. Includes technical and business constraints influencing architectural decisions.

## 2. Architectural Overview

* **High-Level View:** Diagram(s) illustrating the major components, subsystems, or modules and their relationships, providing a "big picture" understanding.
* **Architectural Style and Patterns:** Identifies the chosen architectural style(s) (e.g., microservices, monolithic, event-driven) and significant design patterns (e.g., MVC, observer). Briefly explains the rationale for their selection and how they address architectural goals.

## 3. Component Descriptions

* **Identification of Major Components:** Details the key building blocks of the system. For each component:
    * **Name and Responsibility:** Clear name and concise description of its primary function.
    * **Interfaces:** Defines exposed and consumed interfaces (APIs, data formats, protocols).
    * **Dependencies:** Identifies other components it relies on.
    * **Key Technologies (High-Level):** Mentions primary technologies used (e.g., "uses a relational database," "implements a RESTful API"). Avoids specific library/framework versions.

## 4. Data Architecture

* **Data Flow:** Describes how data moves through the system.
* **Data Storage:** Outlines data storage mechanisms (e.g., relational, NoSQL, file systems) and the types of data stored in each.
* **Data Model (Conceptual/Logical):** High-level representation of main data entities and their relationships. Detailed schemas are usually in a separate Database Design Document.

## 5. Interface Architecture

* **External Interfaces:** Describes interactions with external systems (e.g., third-party APIs, other internal applications). Includes protocols, data formats, and security considerations.
* **User Interface (High-Level):** Outlines the overall structure and key interaction patterns. Detailed UI specifications (wireframes, mockups) are typically separate.
* **Internal Interfaces:** Describes communication between different components within the system.

## 6. Deployment Architecture

* **Deployment Diagram (High-Level):** Illustrates how system components will be deployed in the target environment (e.g., servers, containers, cloud services).
* **Scalability and Availability Considerations:** Briefly describes how the architecture supports scalability and high availability.

## 7. Security Architecture (Overview)

* **Key Security Principles:** Outlines main security considerations and architectural decisions (e.g., authentication, authorization, data encryption). Detailed specifications are in a separate Security Architecture Document.

## 8. Quality Attributes Considerations (in detail)

* For each critical quality attribute (e.g., performance, scalability, maintainability):
    * **How the Architecture Addresses It:** Explains architectural choices made to achieve the desired level.
    * **Trade-offs:** Discusses any trade-offs between different quality attributes.

## 9. Key Architectural Decisions and Rationale

* Explicitly documents significant architectural decisions. For each decision:
    * **The Decision:** Clear statement of the chosen approach.
    * **Context:** The problem or requirement leading to the decision.
    * **Alternatives Considered:** Briefly mentions other evaluated options.
    * **Rationale:** Reasons for selecting the chosen option, highlighting benefits and trade-offs.

## 10. Glossary and Terminology

* Defines any specific terms or acronyms used in the document for clarity.
