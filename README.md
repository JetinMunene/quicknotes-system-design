
# QuickNotes System Design

A web-based note-taking application prototype and system design capstone project. QuickNotes demonstrates REST API operations, relational database design, and a scalable architecture for a service intended to support one million registered users.

## Project Overview

QuickNotes allows users to load notes from an API, create new notes, and delete notes through a simple browser interface.

The project combines a working frontend API client with technical documentation describing how a production-ready QuickNotes service could be designed and scaled.

### Key Features

- Fetch and display notes using HTTP GET.
- Create notes using HTTP POST.
- Delete notes using HTTP DELETE.
- Validate note titles before submission.
- Display loading, success, error, and empty states.
- Disable relevant buttons while requests are processing.
- Safely display user-facing text using DOM `textContent`.
- Document REST API endpoints and error responses.
- Design a relational data model for users, notes, and tags.
- Propose a scalable architecture with caching, multiple application servers, database replication, and background workers.

## Technology Stack

- **HTML5** — page structure and forms.
- **CSS3** — layout and styling.
- **JavaScript** — asynchronous API requests and DOM updates.
- **Fetch API** — HTTP communication.
- **JSONPlaceholder** — demonstration API for GET, POST, and DELETE.
- **SQL** — proposed relational database design.
- **Git and GitHub** — version control and project hosting.
- **Markdown and Mermaid** — technical documentation and architecture diagrams.

## Project Structure

```text
quicknotes-system-design/
├── index.html
├── api.js
├── style.css
├── README.md
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## How to Run the Application

### Prerequisites

You need:

- A modern web browser.
- An internet connection to reach the demonstration API.
- A code editor such as Visual Studio Code (optional, but recommended).

### Option 1: Open in a Browser

1. Clone or download this repository.
2. Open the project folder.
3. Double-click `index.html`.
4. Click **Load Notes** to fetch notes from the API.
5. Use the form to create a note.
6. Click a note's **Delete** button to remove it from the current page.

### Option 2: Use Visual Studio Code Live Server

1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension if necessary.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. Test the application's GET, POST, and DELETE features.

### API Configuration

The demonstration client uses:

```javascript
const API_URL = "https://jsonplaceholder.typicode.com/posts";
```

The application fetches up to ten notes using the `_limit=10` query parameter.

**Important:** JSONPlaceholder is a testing API. POST requests simulate creating records, and DELETE requests simulate deletion. Changes are not permanently stored by the service. A created note may therefore disappear after reloading the page, and a deleted note may return when the original records are fetched again.

The documented production API in `docs/api-design.md` is a proposed design and is not the same as the JSONPlaceholder demonstration API.

## System Design Documentation

### 1. API Design

[Read the API Design Document](docs/api-design.md)

This document defines the proposed REST API, endpoint methods, request and response examples, authentication, pagination, and error handling.

### 2. Data Model

[Read the Data Model Document](docs/data-model.md)

This document describes the users, notes, tags, and note_tags tables, their primary and foreign keys, their relationships, SQL table definitions, indexes, and example queries.

### 3. System Architecture

[Read the Architecture Document](docs/architecture.md)

This document covers functional and non-functional requirements, estimated traffic and storage for one million registered users, the architecture diagram, request flows, caching, database scaling, security, monitoring, tradeoffs, and reliability.

## API Operations Demonstrated

| HTTP Method | Operation | Purpose |
|---|---|---|
| GET | Retrieve notes | Fetch and display notes |
| POST | Create a note | Submit a new note to the API |
| DELETE | Delete a note | Send a delete request for a note |

The browser client handles request errors and displays status messages to the user.

## What I Learned

Through this project, I learned how to:

1. **Work with REST APIs:** Use asynchronous JavaScript and the Fetch API to make GET, POST, and DELETE requests, handle HTTP errors, and process JSON responses.
2. **Design relational databases:** Model one-to-many and many-to-many relationships using primary keys, foreign keys, junction tables, constraints, indexes, and SQL joins.
3. **Plan for scalability:** Estimate requests per second and storage requirements, then design an architecture with load balancing, caching, database replication, and background processing.
4. **Improve application reliability:** Use loading states, error handling, health checks, backups, monitoring, and redundancy to improve the user experience and system resilience.
5. **Document technical decisions:** Explain API contracts, database structures, architecture components, and tradeoffs using Markdown and diagrams.
6. **Use version control:** Organize work into meaningful Git commits and publish the project to GitHub.

## Future Improvements

Possible improvements include:

- Replace JSONPlaceholder with a real backend API.
- Add user registration and secure authentication.
- Persist notes in a SQL database.
- Implement note editing and tag management.
- Add search, filtering, and pagination.
- Introduce automated tests and continuous integration.
- Deploy the production application to cloud infrastructure.
- Add monitoring, backups, and automated recovery procedures.

## Project Status

The frontend is a demonstration client using JSONPlaceholder. The API design, database model, and scalable architecture are documented as a system design proposal; they do not imply that the complete production backend has been implemented.

## Author

**GitHub:** [JetinMunene](https://github.com/JetinMunene)

---

