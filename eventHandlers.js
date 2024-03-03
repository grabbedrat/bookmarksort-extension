// eventHandlers.js

// This file contains the event handlers and DOM manipulation logic
// for the BookmarkSorter Firefox extension.

import { sendBookmarksToServer } from "./serverCommunication.js";

// Helper function to get an element by ID with error handling.
function safelyGetElementById(
  id,
  createIfNotFound = false,
  createFunction = null,
) {
  const element = document.getElementById(id);
  if (element) {
    return element;
  }
  if (createIfNotFound && typeof createFunction === "function") {
    return createFunction();
  }
  throw new Error(
    `Element with id '${id}' not found and no creation function provided.`,
  );
}

// Helper function to append a child element safely with error handling.
function safeAppendChild(parent, child) {
  try {
    parent.appendChild(child);
  } catch (error) {
    console.error("Error appending child element:", error);
    throw error;
  }
}

// This function initializes the UI elements and their event listeners.
function initializeUI() {
  const saveButton = safelyGetElementById("saveBookmarksButton");
  const indicator = safelyGetElementById("waitingIndicator");
  let errorContainer = null;
  try {
    errorContainer = safelyGetElementById("errorContainer");
  } catch {
    errorContainer = createErrorContainer(); // Create only if not present.
  }

  let backupCheckbox = null;
  try {
    backupCheckbox = safelyGetElementById("backupCheckbox");
  } catch {
    backupCheckbox = createBackupCheckbox(true); // Create only if not present, defaulting to checked.
  }

  // Attach event listener to the save button.
  saveButton.addEventListener("click", () =>
    handleSaveButtonClick(indicator, errorContainer, backupCheckbox),
  );
}

// This function is called when the 'Save Bookmarks' button is clicked.
function handleSaveButtonClick(indicator, errorContainer, backupCheckbox) {
  indicator.style.display = "block"; // Show waiting indicator
  errorContainer.style.display = "none"; // Hide previous errors

  sendBookmarksToServer(backupCheckbox.checked)
    .then(updateBookmarksOnPage)
    .catch((error) => {
      console.error("Error sending bookmarks to server:", error);
      showErrorMessage(
        errorContainer,
        "Failed to save bookmarks. Please try again later.",
      );
    })
    .finally(() => {
      indicator.style.display = "none"; // Hide waiting indicator after operation
    });
}

// Creates the error container if it wasn't found in the DOM.
function createErrorContainer() {
  const container = document.createElement("div");
  container.id = "errorContainer";
  container.style.display = "none";
  container.classList.add("error-container");
  document.body.appendChild(container);
  return container;
}

// Displays an error message to the user.
function showErrorMessage(container, message) {
  container.textContent = message;
  container.style.display = "block";
}

// Creates the backup checkbox if it wasn't found in the DOM.
function createBackupCheckbox(checked) {
  const label = document.createElement("label");
  label.textContent = " Backup before sending (recommended)";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "backupCheckbox";
  checkbox.checked = checked;
  label.insertBefore(checkbox, label.firstChild);
  document.body.appendChild(label);
  return checkbox;
}

// Updates the UI with sorted bookmarks received from the server.
function updateBookmarksOnPage(bookmarkClusters) {
  let container = null;
  try {
    container = safelyGetElementById("bookmarksContainer");
  } catch {
    container = document.createElement("div");
    container.id = "bookmarksContainer";
    document.body.appendChild(container);
  }

  // Clear the previous container content.
  container.innerHTML = "";

  Object.entries(bookmarkClusters).forEach(([clusterName, bookmarks]) => {
    const clusterDiv = document.createElement("div");
    const clusterHeading = document.createElement("h3");
    clusterHeading.textContent = clusterName;
    clusterDiv.appendChild(clusterHeading);

    bookmarks.forEach((bookmark) => {
      const bookmarkElement = document.createElement("p");
      const bookmarkLink = document.createElement("a");
      bookmarkLink.href = bookmark.url;
      bookmarkLink.textContent = bookmark.name;
      bookmarkElement.appendChild(bookmarkLink);
      safeAppendChild(clusterDiv, bookmarkElement);
    });

    safeAppendChild(container, clusterDiv);
  });
}

// Initialize the UI when the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", initializeUI);
