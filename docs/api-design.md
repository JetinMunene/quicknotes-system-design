# QuickNotes API Design

## 1. Overview

QuickNotes is a RESTful note-taking service that allows authenticated users to create, view, update, delete, and organize notes.

The API is designed for a production web and mobile application serving up to 1 million users.

The API uses JSON for request and response bodies and follows standard HTTP methods and status codes.

### Base URL

```text
https://api.quicknotes.com/v1

Authentication
Protected endpoints require an authenticated user.
Clients send a bearer access token using the Authorization header:
Authorization: Bearer <access-token>

| Method | Path | Description | Success Status |
|---|---|---|---:|
| GET | `/notes` | List notes belonging to the authenticated user | 200 |
| GET | `/notes/{id}` | Retrieve one note by ID | 200 |
| POST | `/notes` | Create a new note | 201 |
| PUT | `/notes/{id}` | Replace an existing note | 200 |
| PATCH | `/notes/{id}` | Partially update a note | 200 |
| DELETE | `/notes/{id}` | Delete a note | 204 |
| GET | `/tags` | List tags belonging to the authenticated user | 200 |
| POST | `/tags` | Create a new tag | 201 |

3. GET /notes
Returns a list of notes belonging to the authenticated user.

Request:
GET /v1/notes
Authorization: Bearer <access-token>
Accept: application/json

Optional Query Parameters:
?page=1
&limit=20
&tag=javascript
&search=api

Example:
GET /v1/notes?page=1&limit=20&search=api

Success Response
Status: 200 OK
{
  "data": [
    {
      "id": 101,
      "title": "Learning REST APIs",
      "body": "Review HTTP methods and status codes.",
      "userId": 7,
      "createdAt": "2026-10-15T08:00:00Z",
      "updatedAt": "2026-10-15T08:00:00Z"
    },
    {
      "id": 102,
      "title": "JavaScript Practice",
      "body": "Practice fetch and async functions.",
      "userId": 7,
      "createdAt": "2026-10-15T09:00:00Z",
      "updatedAt": "2026-10-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2
  }
}

4. GET /notes/{id}
Returns a single note.
Request
GET /v1/notes/101
Authorization: Bearer <access-token>
Accept: application/json

Success Response
Status: 200 OK
{
  "id": 101,
  "title": "Learning REST APIs",
  "body": "Review HTTP methods and status codes.",
  "userId": 7,
  "createdAt": "2026-10-15T08:00:00Z",
  "updatedAt": "2026-10-15T08:00:00Z"
}

5. POST /notes
Creates a new note for the authenticated user.
Request
POST /v1/notes
Authorization: Bearer <access-token>
Content-Type: application/json

Request Body
{
  "title": "Learning REST APIs",
  "body": "Review HTTP methods and status codes."
}

Validation Rules
- title is required.
- title must contain at least one non-whitespace character.
- title must not exceed 100 characters.
- body is optional.
- The authenticated user's ID is obtained from the access token rather than supplied by the client.
Success Response
Status: 201 Created
{
  "id": 103,
  "title": "Learning REST APIs",
  "body": "Review HTTP methods and status codes.",
  "userId": 7,
  "createdAt": "2026-10-15T10:00:00Z",
  "updatedAt": "2026-10-15T10:00:00Z"
}

The response should also include a Location header pointing to the newly created resource: Location: /v1/notes/103

6. PUT /notes/{id}
Replaces an existing note.
Request
PUT /v1/notes/103
Authorization: Bearer <access-token>
Content-Type: application/json

Request Body
{
  "title": "Updated REST API Notes",
  "body": "Review HTTP methods, status codes and authentication."
}

Success Response
Status: 200 OK
{
  "id": 103,
  "title": "Updated REST API Notes",
  "body": "Review HTTP methods, status codes and authentication.",
  "userId": 7,
  "createdAt": "2026-10-15T10:00:00Z",
  "updatedAt": "2026-10-15T10:30:00Z"
}

7. PATCH /notes/{id}
Partially updates an existing note.
Request
PATCH /v1/notes/103
Authorization: Bearer <access-token>
Content-Type: application/json

Request Body
{
  "title": "Updated REST API Notes"
}

Success Response
Status: 200 OK
{
  "id": 103,
  "title": "Updated REST API Notes",
  "body": "Review HTTP methods, status codes and authentication.",
  "userId": 7,
  "createdAt": "2026-10-15T10:00:00Z",
  "updatedAt": "2026-10-15T10:35:00Z"
}

PATCH is useful when the client needs to change only one or a few fields instead of sending the complete note.

DELETE /notes/{id}
Deletes a note belonging to the authenticated user.
Request
DELETE /v1/notes/103
Authorization: Bearer <access-token>

Success Response
Status: 204 No Content
The server successfully deletes the note and returns no response body.

GET /tags
Returns tags belonging to the authenticated user.
Request
GET /v1/tags
Authorization: Bearer <access-token>
Accept: application/json

Success Response
Status: 200 OK
{
  "data": [
    {
      "id": 1,
      "name": "javascript"
    },
    {
      "id": 2,
      "name": "school"
    },
    {
      "id": 3,
      "name": "projects"
    }
  ]
}

10. POST /tags
Creates a new tag.
Request
POST /v1/tags
Authorization: Bearer <access-token>
Content-Type: application/json

Request Body
{
  "name": "web-development"
}

Success Response
Status: 201 Created
{
  "id": 4,
  "name": "web-development",
  "userId": 7
}

11. Error Status Codes
The API uses standard HTTP status codes to communicate the result of a request.

| Status | Meaning | Example |
|---:|---|---|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | User does not have permission |
| 404 | Not Found | Requested note does not exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failure |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server failure |
| 503 | Service Unavailable | Temporary service outage |


12. Error Response Format
The API should return a consistent JSON structure for errors.
Example: 400 Bad Request
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request contains invalid data.",
    "details": [
      {
        "field": "title",
        "message": "Title is required."
      }
    ]
  }
}

Example: 401 Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required."
  }
}

Example: 403 Forbidden
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource."
  }
}

Example: 404 Not Found
{
  "error": {
    "code": "NOTE_NOT_FOUND",
    "message": "The requested note was not found."
  }
}

Example: 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred. Please try again later."
  }
}

The API should avoid exposing database errors, stack traces, passwords, tokens, or other internal implementation details to clients.

13. Authentication and Authorization
QuickNotes requires authentication for operations involving a user's private notes.
The server identifies the user from the authenticated access token.
For example:
Authorization: Bearer <access-token>

A user can only read, update, or delete notes that they are authorized to access.
The API must not trust a userId supplied by the client when determining ownership of a new note. Instead, the backend obtains the authenticated user's ID from the authentication context.
This prevents users from creating or modifying notes belonging to another user.

14. Pagination
The /notes endpoint supports pagination to prevent large responses.
Example:
GET /v1/notes?page=2&limit=20

The server should enforce a maximum page size, such as 100 notes per request.
Pagination helps control response size, memory usage, database workload, and network bandwidth as the number of notes grows.

15. API Design Principles
The QuickNotes API follows these principles:
- Resources are represented using nouns such as /notes and /tags.
- HTTP methods describe the operation being performed.
- JSON is used for request and response bodies.
- HTTP status codes communicate success or failure.
- Authentication is required for private user data.
- Authorization ensures users can only access resources they are permitted to use.
-  Pagination prevents excessively large responses.
- Consistent error responses make client-side error handling easier.
- The API is versioned using /v1.
- User input is validated on the server even when client-side validation is also performed.

17. Conclusion
The QuickNotes API provides a predictable RESTful interface for managing notes and tags.
The design separates the practice API used by the frontend during development from the production API that the backend team will implement.
The API uses standard HTTP methods, appropriate status codes, JSON request and response bodies, authentication, authorization, validation, pagination, and consistent error handling to provide a secure and scalable foundation for the QuickNotes service.