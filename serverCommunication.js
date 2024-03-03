// serverCommunication.js

// This file provides the functionality for communicating with the server
// to send bookmarks data for sorting and receive the sorted result.

// Sends the bookmarks data to the server for sorting. Optionally backs up bookmarks if indicated.
export function sendBookmarksToServer(bookmarks, backup = false) {
  // Construct the payload to include bookmarks and the backup flag.
  const payload = {
    bookmarks: bookmarks,
    backup: backup,
  };

  // Make an HTTP POST request to the server's /cluster endpoint.
  return fetch("/cluster", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        // If the server response is not OK, throw an error with the status.
        throw new Error(
          `Server responded with status code: ${response.status}`,
        );
      }
      // When the server responds with OK, parse the JSON response.
      return response.json();
    })
    .catch((error) => {
      // Log the error in the console for debugging purposes.
      console.error("Error sending bookmarks to server:", error);
      // Rethrow the error for further handling by the caller.
      throw error;
    });
}
