// serverCommunication.js
export async function sendBookmarksToServer(bookmarks) {
  if (bookmarks.length === 0) {
    console.warn("Bookmarks payload is empty. No bookmarks to send.");
    return; // If you don't want to send an empty array, you can return early.
  }

  // Construct the payload
  const payload = bookmarks;
  console.log("Sending bookmarks to server");
  try {
    // Attempt to send the payload to the server using the fetch API
    const response = await fetch("http://127.0.0.1:5000/cluster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if the server response is ok (status code 2xx)
    if (!response.ok) {
      // Log specific error for any response outside the 2xx range
      console.error(`Server responded with status code: ${response.status}`);
      throw new Error(`Server responded with status code: ${response.status}`);
    }

    // If the response is ok, parse the response body as JSON
    const data = await response.json();
    console.log("Successfully sent bookmarks to server and received response:", JSON.stringify(data, null, 2));

    // Return the parsed response data
    return data;
  } catch (error) {
    // Log the error if the request fails
    console.error("Error sending bookmarks to server:", error);
    throw error; // Rethrow the error for further handling if needed
  }
}