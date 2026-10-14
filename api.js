
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const statusElement = document.getElementById("status");
const notesList = document.getElementById("notes-list");

// Make API requests reusable and report unsuccessful HTTP responses.
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
}

// Display a status message and its appropriate visual style.
function showStatus(message, type = "info") {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
}

// Display a friendly empty state when there are no notes.
function showEmptyState() {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = "No notes found. There are no notes to display.";
    notesList.appendChild(item);
}

// Safely display notes using textContent instead of innerHTML.
function renderNotes(notes) {
    notesList.replaceChildren();

    if (notes.length === 0) {
        showEmptyState();
        return;
    }

    notes.forEach((note) => {
        const item = document.createElement("li");
        item.className = "note-card";

        const title = document.createElement("h3");
        title.textContent = note.title || "Untitled note";

        const body = document.createElement("p");
        body.textContent = note.body || "No note content available.";

        item.append(title, body);
        notesList.appendChild(item);
    });
}

// GET: Load the first 10 notes from JSONPlaceholder.
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

loadButton.addEventListener("click", loadNotes);
