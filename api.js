const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const submitButton = document.getElementById("submit-btn");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const statusElement = document.getElementById("status");
const notesList = document.getElementById("notes-list");

// Reusable API request function.
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
}

// Display status messages.
function showStatus(message, type = "info") {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
}

// Display an empty state.
function showEmptyState() {
    const item = document.createElement("li");

    item.className = "empty-state";
    item.textContent = "No notes found. There are no notes to display.";

    notesList.appendChild(item);
}

// Create a note element safely.
function createNoteElement(note) {
    const item = document.createElement("li");
    item.className = "note-card";

    const title = document.createElement("h3");
    title.textContent = note.title || "Untitled note";

    const body = document.createElement("p");
    body.textContent = note.body || "No note content available.";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.id = note.id;

    deleteButton.addEventListener("click", () => {
        deleteNote(note.id, item, deleteButton);
    });

    item.append(title, body, deleteButton);

    return item;
}

// Display multiple notes.
function renderNotes(notes) {
    notesList.replaceChildren();

    if (notes.length === 0) {
        showEmptyState();
        return;
    }

    notes.forEach((note) => {
        notesList.appendChild(createNoteElement(note));
    });
}

// GET: Load the first 10 notes.
async function loadNotes() {
    loadButton.disabled = true;

    showStatus("Loading notes...", "loading");

    try {
        const response = await request(`${API_URL}?_limit=10`);
        const notes = await response.json();

        renderNotes(notes);

        if (notes.length === 0) {
            showStatus("The server returned no notes.", "info");
        } else {
            showStatus(
                `Loaded ${notes.length} notes from the server.`,
                "success"
            );
        }
    } catch (error) {
        console.error("Unable to load notes:", error);

        notesList.replaceChildren();

        showStatus(
            "Sorry, we couldn't load notes. Check your internet connection and try again.",
            "error"
        );
    } finally {
        loadButton.disabled = false;
    }
}

// POST: Create a new note.
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validate title.
    if (!title) {
        showStatus("Please enter a note title.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        showStatus(
            "The title must be 100 characters or fewer.",
            "error"
        );
        titleInput.focus();
        return;
    }

    submitButton.disabled = true;

    showStatus("Creating note...", "loading");

    try {
        const response = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        const createdNote = await response.json();

        // Add the newly created note to the top of the list.
        const noteElement = createNoteElement(createdNote);

        // Remove the empty-state message if one is currently displayed.
        const emptyState = notesList.querySelector(".empty-state");

        if (emptyState) {
            notesList.replaceChildren();
        }

        notesList.prepend(noteElement);

        showStatus(
            `Note created (status ${response.status}, id ${createdNote.id}).`,
            "success"
        );

        noteForm.reset();
    } catch (error) {
        console.error("Unable to create note:", error);

        showStatus(
            "Sorry, we couldn't create the note. Please try again.",
            "error"
        );
    } finally {
        submitButton.disabled = false;
    }
}

// DELETE: Remove a note from JSONPlaceholder and the page.
async function deleteNote(noteId, noteElement, deleteButton) {
    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    showStatus(`Deleting note ${noteId}...`, "loading");

    try {
        const response = await request(`${API_URL}/${noteId}`, {
            method: "DELETE"
        });

        /*
         * JSONPlaceholder simulates DELETE requests but does not permanently
         * remove data from its database. We therefore remove the note from
         * the current page after receiving a successful response.
         */

        if (response.ok) {
            noteElement.remove();

            if (notesList.children.length === 0) {
                showEmptyState();
                showStatus("Note deleted successfully.", "success");
            } else {
                showStatus(
                    `Note ${noteId} deleted successfully (status ${response.status}).`,
                    "success"
                );
            }
        }
    } catch (error) {
        console.error("Unable to delete note:", error);

        deleteButton.disabled = false;
        deleteButton.textContent = "Delete";

        showStatus(
            "Sorry, we couldn't delete the note. Please try again.",
            "error"
        );
    }
}

loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);