// serverCommunication.js
export async function sendBookmarksToServer(bookmarks) {
  if (bookmarks.length === 0) {
    console.warn("Bookmarks payload is empty. No bookmarks to send.");
    return; // If you don't want to send an empty array, you can return early.
  }

  // Construct the payload
  const payload = bookmarks;
  console.log("Attempting to send bookmarks to server");
  try {
    const response = await fetch("http://127.0.0.1:5000/cluster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Response timeout check (assuming the timeout is 5000 milliseconds)
    const timeoutId = setTimeout(() => {
      console.error("Server response timeout exceeded");
      throw new Error("Server response timeout exceeded");
    }, 5000);

    // Check if the server response is ok (status code 2xx)
    if (!response.ok) {
      clearTimeout(timeoutId);
      const errorText = await response.text();
      console.error(`Server responded with non-2xx status: ${response.status}`);
      console.error(`Server error message: ${errorText}`);
      throw new Error(`Server error: ${response.status} ${errorText}`);
    }

    clearTimeout(timeoutId);

    // If the response is ok, parse the response body as JSON
    const data = await response.json();
    console.log(
      "Successfully sent bookmarks to server and received response"
    );

    // Return the parsed response data
    return data;
  } catch (error) {
    console.error("Exception sending bookmarks to server:", error);
    // Log the stack trace for better debugging
    console.error(error.stack);
    throw error;
  }
}
