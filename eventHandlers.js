// eventHandlers.js
import { sendBookmarksToServer } from "./serverCommunication.js";
import { simplifyBookmarkData } from "./bookmarkUtils.js";

const debugMode = true;

function safelyGetElementById(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Element with id '${id}' not found.`);
  return element;
}

function removeBookmarksRecursively(bookmarkItems) {
  return Promise.all(
    bookmarkItems.map((item) => {
      if (item.children) {
        // Recursively remove children first
        return removeBookmarksRecursively(item.children).then(() => {
          // After all children are removed, remove the folder itself if it's not a root folder
          if (item.id !== "0" && item.id !== "1" && item.id !== "2") {
            // Assuming "0", "1", and "2" are IDs of root folders
            return browser.bookmarks.remove(item.id);
          }
        });
      } else {
        // Remove the bookmark
        return browser.bookmarks.remove(item.id);
      }
    }),
  );
}

function setBookmarksInBrowser(sortedBookmarks) {
  if (typeof browser.bookmarks === "undefined") {
    console.error("browser.bookmarks API is not available");
    return;
  }

  // Remove all non-root bookmarks and folders
  browser.bookmarks
    .getTree()
    .then((bookmarkItems) => {
      return removeBookmarksRecursively(bookmarkItems[0].children);
    })
    .then(() => {
      console.log("All non-root bookmarks and folders removed.");

      // Here we use a promise array to track the bookmarks creation promises
      let creationPromises = [];

      // Add sorted bookmarks
      Object.entries(sortedBookmarks).forEach(([category, bookmarks]) => {
        let folderCreationPromise = browser.bookmarks
          .create({ title: category })
          .then((newFolder) => {
            bookmarks.forEach((bookmark) => {
              creationPromises.push(
                browser.bookmarks.create({
                  parentId: newFolder.id,
                  title: bookmark.name,
                  url: bookmark.url,
                }),
              );
            });
          });

        creationPromises.push(folderCreationPromise);
      });

      // Wait for all bookmarks and folders to be created
      Promise.all(creationPromises).then(() => {
        console.log("Bookmarks added to browser.");
      });
    })
    .catch((error) => {
      console.error("Error setting bookmarks in the browser:", error);
    });
}

function initializeUI() {
  const sortButton = safelyGetElementById("saveBookmarksButton");
  const indicator = safelyGetElementById("waitingIndicator");
  const errorContainer = safelyGetElementById("errorContainer");

  sortButton.addEventListener("click", () => {
    indicator.style.display = "block";
    errorContainer.style.display = "none";

    browser.bookmarks.getTree().then((bookmarkItems) => {
      const simplifiedBookmarks = bookmarkItems
        .flatMap((item) => item.children ? item.children.flatMap(simplifyBookmarkData) : simplifyBookmarkData(item))
        .map((simplifiedBookmark) => ({ ...simplifiedBookmark, tags: ["Bookmarks Menu"] }));

      sendBookmarksToServer(simplifiedBookmarks)
        .then((sortedBookmarks) => {
          if (!sortedBookmarks || typeof sortedBookmarks !== 'object') { // Check if response is not valid
            throw new Error('Received invalid response from the server.');
          }
          console.log('Bookmarks successfully sent to the server and received response.');
          return setBookmarksInBrowser(sortedBookmarks);
        })
        .then(() => {
          console.log('Bookmarks added to the browser successfully.');
        })
        .catch((error) => {
          console.error('Error processing bookmarks:', error);
          errorContainer.textContent = error.message || 'An unexpected error occurred. Please try again later.';
          errorContainer.style.display = "block";
        })
        .finally(() => {
          indicator.style.display = "none";
        });
    });
  });
}

document.addEventListener("DOMContentLoaded", initializeUI);
