// Handling communication with the server
import { stripUnneededInfo, saveBookmarksToFile } from './bookmarkUtils.js';

function sendBookmarksToServer() {
    return browser.bookmarks.getTree().then(bookmarkItems => {
        bookmarkItems.forEach(item => stripUnneededInfo(item));
        saveBookmarksToFile(bookmarkItems); // Optionally comment out if saving locally is not needed before sending

        const bookmarksData = JSON.stringify(bookmarkItems, null, 2);
        return fetch('http://localhost:5000/cluster', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: bookmarksData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            const processedBookmarkData = JSON.stringify(data, null, 2);
            const blob = new Blob([processedBookmarkData], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "processed_bookmarks.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error:', error));
    });
}

export { sendBookmarksToServer };