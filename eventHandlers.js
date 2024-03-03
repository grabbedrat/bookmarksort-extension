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
      if (["menu________", "toolbar_____", "unfiled_____", "mobile______"].includes(item.id)) {
        return Promise.resolve();
      }
      if (item.children) {
        return removeBookmarksRecursively(item.children).then(() => {
          if (item.id !== "0" && item.id !== "1" && item.id !== "2") {
            return browser.bookmarks.remove(item.id);
          }
        });
      } else {
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

  browser.bookmarks
    .getTree()
    .then((bookmarkItems) => {
      return removeBookmarksRecursively(bookmarkItems[0].children);
    })
    .then(() => {
      console.log("All non-root bookmarks and folders removed.");

      let creationPromises = [];

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

      Promise.all(creationPromises).then(() => {
        console.log("Bookmarks added to browser.");
      });
    })
    .catch((error) => {
      console.error("Error setting bookmarks in the browser:", error);
    });
}

async function initializeUI() {
  const sortButton = safelyGetElementById("saveBookmarksButton");
  const indicator = safelyGetElementById("waitingIndicator");
  const errorContainer = safelyGetElementById("errorContainer");

  sortButton.addEventListener("click", async () => {
    try {
      indicator.style.display = "block";
      errorContainer.style.display = "none";

      const bookmarkItems = await browser.bookmarks.getTree();

      const simplifiedBookmarks = bookmarkItems
        .flatMap((item) =>
          item.children
            ? item.children.flatMap(simplifyBookmarkData)
            : simplifyBookmarkData(item),
        )
        .map((simplifiedBookmark) => ({
          ...simplifiedBookmark,
          tags: ["Bookmarks Menu"],
        }));

      const sortedBookmarks = await sendBookmarksToServer(simplifiedBookmarks);

      if (!sortedBookmarks || typeof sortedBookmarks !== "object") {
        throw new Error("Received invalid response from the server.");
      }

      console.log(
        "Bookmarks successfully sent to the server and received response.",
      );

      await setBookmarksInBrowser(sortedBookmarks);
      console.log("Bookmarks added to the browser successfully.");
    } catch (error) {
      console.error("Error processing bookmarks:", error);
      errorContainer.textContent =
        error.message ||
        "An unexpected error occurred. Please try again later.";
      errorContainer.style.display = "block";
    } finally {
      indicator.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", initializeUI);
