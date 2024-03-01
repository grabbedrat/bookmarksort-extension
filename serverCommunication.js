// serverCommunication.js
export async function sendBookmarksToServer(backup = true) {
    try {
        // Assuming bookmarks are stored in a local variable or can be fetched from your application's state
        const bookmarks = getBookmarksFromApplicationState(); // You need to define this function
        
        // Implement backup logic here if backup is true
        if (backup) {
            console.log('Backup is enabled - backing up bookmarks...');
            backupBookmarks(bookmarks); // Backs up bookmarks to localStorage or another storage mechanism
        }

        // Convert bookmarks to JSON
        const bookmarksJson = JSON.stringify(bookmarks);

        // Send bookmarks to the server
        const response = await fetch('https://your-server-endpoint.com/api/bookmarks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bookmarksJson,
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        // Handle response from the server
        const result = await response.json();
        console.log('Bookmarks successfully sent to the server:', result);
        displaySuccessMessage('Bookmarks successfully backed up and sent to the server.');

    } catch (error) {
        console.error('Error:', error);
        displayErrorMessage(error.message); // Display error message on UI
    }
}

function backupBookmarks(bookmarks) {
    // Here we're using localStorage for simplicity, but you might use IndexedDB or another method for larger data sets
    localStorage.setItem('bookmarksBackup', JSON.stringify(bookmarks));
    console.log('Bookmarks backed up locally.');
}

function getBookmarksFromApplicationState() {
    // Placeholder for fetching bookmarks from your application's state or storage
    // This needs to be implemented based on how your application manages bookmarks
    return []; // Return an array of bookmarks
}

function displayErrorMessage(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = `Error: ${message}`; // Set error message
    errorContainer.style.display = 'block'; // Show the error message
}

function displaySuccessMessage(message) {
    const successContainer = document.getElementById('successContainer') || createSuccessContainer();
    successContainer.textContent = message; // Set success message
    successContainer.style.display = 'block'; // Show the success message
}

function createSuccessContainer() {
    const container = document.createElement('div');
    container.id = 'successContainer';
    container.style.display = 'none'; // Hidden by default
    container.style.color = 'green'; // Success color
    document.body.appendChild(container);
    return container;
}
