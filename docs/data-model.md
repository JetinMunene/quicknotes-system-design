# QuickNotes Data Model

## 1. Overview

QuickNotes is a note-taking application where users can create, update, delete, search, and organize notes using tags.

The database uses a relational SQL design because QuickNotes contains clear relationships between users, notes, and tags. A normalized relational structure helps maintain data consistency and makes operations such as filtering, joining, and counting records straightforward.

The main entities are:

- `users` — stores application users.
- `notes` — stores notes created by users.
- `tags` — stores tags belonging to users.
- `note_tags` — junction table connecting notes and tags.

---

# 2. Entity Relationship Overview

The relationships are:

```text
users
  |
  | 1
  |
  |------< many
  |
notes
  |
  | many
  |
  |------< note_tags >------|
                            |
                            | many
                            |
                           tags

-Relationships
Users → Notes
One user can create many notes.
This is a one-to-many relationship:
One User → Many Notes

-The notes.user_id foreign key identifies the owner of each note.
Users → Tags
One user can create many tags.
This is also a one-to-many relationship:
One User → Many Tags

-The tags.user_id foreign key identifies the user who owns each tag.
Notes ↔ Tags
A note can have multiple tags, and a tag can belong to multiple notes.
This is a many-to-many relationship.
A junction table called note_tags is used to represent this relationship:
notes ←→ note_tags ←→ tags

3. Database Entities
3.1 Users
The users table stores account information.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique user ID |
| `name` | VARCHAR(100) | NOT NULL | User's name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User's email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password |
| `created_at` | TIMESTAMP | NOT NULL | Account creation time |

3.2 Notes
The notes table stores notes created by users.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique note ID |
| `user_id` | INTEGER | NOT NULL, FOREIGN KEY | Owner of the note |
| `title` | VARCHAR(100) | NOT NULL | Note title |
| `body` | TEXT | NULL | Note content |
| `created_at` | TIMESTAMP | NOT NULL | Creation time |
| `updated_at` | TIMESTAMP | NOT NULL | Last update time |

The user_id column references users.id.


3.3 Tags
The tags table stores labels used to organize notes.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique tag ID |
| `user_id` | INTEGER | NOT NULL, FOREIGN KEY | Tag owner |
| `name` | VARCHAR(50) | NOT NULL | Tag name |
| `created_at` | TIMESTAMP | NOT NULL | Tag creation time |
The combination of user_id and name must be unique so that one user cannot create duplicate tags with the same name.

3.4 Note Tags
The note_tags table is a junction table that connects notes and tags.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `note_id` | INTEGER | PRIMARY KEY, FOREIGN KEY | Related note |
| `tag_id` | INTEGER | PRIMARY KEY, FOREIGN KEY | Related tag |
The combination of note_id and tag_id forms a composite primary key.
This prevents the same tag from being assigned to the same note more than once.

4. SQL Table Definitions
The following SQL statements create the complete database structure.

4.1 Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

4.2 Notes Table
CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

ON DELETE CASCADE means that when a user is deleted, their notes are also remove

4.3 Tags Table
CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tags_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_tag
        UNIQUE (user_id, name)
);

The unique constraint prevents one user from having duplicate tag names.
For example, the same user cannot have two separate tags called:
Work
Work

4.4 Note Tags Table
CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,

    PRIMARY KEY (note_id, tag_id),

    CONSTRAINT fk_note_tags_note
        FOREIGN KEY (note_id)
        REFERENCES notes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_note_tags_tag
        FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);

The composite primary key ensures that the same tag cannot be attached to the same note multiple times.

5. Indexes
Indexes improve query performance by allowing the database to locate records more efficiently.

Index for Notes by User
CREATE INDEX idx_notes_user_id
ON notes(user_id);

This index is useful because QuickNotes will frequently need to retrieve all notes belonging to a particular user.
For example:
SELECT *
FROM notes
WHERE user_id = 15;

Without an appropriate index, the database may need to scan many rows to find the user's notes.


Index for Note Tags
CREATE INDEX idx_note_tags_tag_id
ON note_tags(tag_id);

This index improves queries that search for all notes associated with a particular tag.
For example:
SELECT note_id
FROM note_tags
WHERE tag_id = 3;

Example SQL Queries

Query 1 — Get All Notes for a User
SELECT
    id,
    title,
    body,
    created_at,
    updated_at
FROM notes
WHERE user_id = 15
ORDER BY updated_at DESC;

This retrieves all notes belonging to user 15, with the most recently updated notes first.

Query 2 — Join Users and Notes
SELECT
    users.id AS user_id,
    users.name,
    notes.id AS note_id,
    notes.title,
    notes.created_at
FROM users
INNER JOIN notes
    ON users.id = notes.user_id
WHERE users.id = 15
ORDER BY notes.created_at DESC;

This demonstrates a SQL JOIN.
It combines information from the users and notes tables using the relationship between:
users.id

and
notes.user_id


Query 3 — Get Notes with Their Tags
SELECT
    notes.id AS note_id,
    notes.title,
    tags.id AS tag_id,
    tags.name AS tag_name
FROM notes
INNER JOIN note_tags
    ON notes.id = note_tags.note_id
INNER JOIN tags
    ON note_tags.tag_id = tags.id
WHERE notes.user_id = 15
ORDER BY notes.id;

This query demonstrates the many-to-many relationship.
The database joins:
notes
   ↓
note_tags
   ↓
tags

to retrieve the tags attached to each note.

Query 4 — Count Notes for Each User
SELECT
    users.id,
    users.name,
    COUNT(notes.id) AS note_count
FROM users
LEFT JOIN notes
    ON users.id = notes.user_id
GROUP BY users.id, users.name
ORDER BY note_count DESC;

This query counts how many notes each user has created.
A LEFT JOIN is used so that users with zero notes are also included.

Query 5 — Find Notes with a Specific Tag
SELECT
    notes.id,
    notes.title,
    notes.body
FROM notes
INNER JOIN note_tags
    ON notes.id = note_tags.note_id
INNER JOIN tags
    ON note_tags.tag_id = tags.id
WHERE tags.name = 'Work'
ORDER BY notes.updated_at DESC;

This retrieves notes associated with the Work tag.

7. Example Data Flow
When a user creates a note, the application performs the following logical operations:
1. User submits a new note
          |
          v
2. Application identifies the user
          |
          v
3. New record is inserted into notes
          |
          v
4. Note receives a unique ID
          |
          v
5. User can assign tags
          |
          v
6. Relationships are stored in note_tags
For Examlple:
User:
id = 15
name = "Alex"

Note:
id = 101
user_id = 15
title = "Study Azure"

Tags:
id = 1
user_id = 15
name = "Study"

id = 2
user_id = 15
name = "Cloud"

note_tags:
note_id = 101
tag_id = 1

note_id = 101
tag_id = 2

8. Data Integrity
The database uses several mechanisms to maintain data integrity.
Primary Keys
Every major entity has a unique primary key.
users.id
notes.id
tags.id

The note_tags table uses a composite primary key:
(note_id, tag_id)

Foreign Keys
Foreign keys maintain relationships between related tables.
Examples:
notes.user_id → users.id
tags.user_id → users.id
note_tags.note_id → notes.id
note_tags.tag_id → tags.id

Unique Constraints
The users.email column is unique.
The combination of: tags.user_id + tags.name


Cascading Deletes
If a user is deleted, their notes and tags can be automatically removed.
If a note or tag is deleted, its corresponding note_tags relationships are also removed.
This prevents orphaned relationship records.

9. Normalization
The database separates information into related tables instead of storing everything in one large table.
For example, tags are not stored repeatedly inside every note as a comma-separated string.
Instead:
This reduces duplicate data and makes it easier to:
- Add new tags
- Rename tags
- Search by tag
- Assign multiple tags to notes
- Remove tags
- Maintain consistent data
The design generally follows relational normalization principles by storing each type of information in its appropriate table.

10. SQL vs NoSQL
SQL is a good choice for QuickNotes because the application has well-defined relationships between users, notes, and tags.
A relational database provides:
- Primary and foreign key constraints
- Transactions
- Data consistency
- SQL joins
- Structured schemas
- Indexing
- Reliable relationship management
For example, retrieving a note and all its tags is naturally represented using SQL joins.
A NoSQL database could also be used, especially if the application needed highly flexible document structures or very large-scale distributed workloads. A document database could store a note and its tags together in a single document, reducing some join operations.
However, for the current QuickNotes requirements, SQL provides a simpler and more reliable way to represent the application's structured relationships.
A production implementation could use PostgreSQL or another managed relational database service to provide backups, replication, monitoring, and high availability.

11. Final Schema Summary
| Entity | Primary Key | Important Foreign Keys | Relationship |
|---|---|---|---|
| `users` | `id` | None | One user has many notes and tags |
| `notes` | `id` | `user_id` → `users.id` | Many notes belong to one user |
| `tags` | `id` | `user_id` → `users.id` | Many tags belong to one user |
| `note_tags` | `note_id, tag_id` | `note_id`, `tag_id` | Many-to-many bridge |
                    ┌──────────────┐
                    │    users     │
                    │──────────────│
                    │ PK id        │
                    │ name         │
                    │ email        │
                    └──────┬───────┘
                           │
                    1      │      many
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌──────────────┐      ┌──────────────┐
        │    notes     │      │     tags     │
        │──────────────│      │──────────────│
        │ PK id        │      │ PK id        │
        │ FK user_id   │      │ FK user_id   │
        │ title        │      │ name         │
        │ body         │      └──────┬───────┘
        └──────┬───────┘             │
               │                     │
               │      many-to-many   │
               │                     │
               └───────┐   ┌─────────┘
                       ▼   ▼
                 ┌──────────────┐
                 │  note_tags   │
                 │──────────────│
                 │ PK note_id   │
                 │ PK tag_id    │
                 └──────────────┘

                 