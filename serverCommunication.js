// serverCommunication.js
export async function sendBookmarksToServer(backup = true) {
    try {
        // Assuming bookmarks are stored in a local variable or can be fetched from your application's state
        const bookmarks = await getBookmarksFromApplicationState(); // You need to define this function
        
        // Implement backup logic here if backup is true
        if (backup) {
            console.log('Backup is enabled - backing up bookmarks...');
            backupBookmarks(bookmarks); // Backs up bookmarks to localStorage or another storage mechanism
        }

        console.log('Pre-json bookmark data (returned from getfromappstate: ):', bookmarks);

        // Convert bookmarks to JSON
        const bookmarksJson = JSON.stringify(bookmarks);

        console.log('Sending bookmarks to the server:', bookmarksJson);

        // Send bookmarks to the server
        const response = await fetch('http://127.0.0.1:5000/cluster', {
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

async function getBookmarksFromApplicationState() {
    try {
        // Get the entire bookmark tree
        const bookmarkTree = await browser.bookmarks.getTree();

        // Process the bookmark tree to extract individual bookmarks
        const bookmarks = [];
        processBookmarkTree(bookmarkTree, bookmarks);

        console.log('getBookmarksFromAppState Returns', bookmarks);
        return bookmarks;
    } catch (error) {
        console.error('Error retrieving bookmarks:', error);
        throw new Error('Failed to retrieve bookmarks');
    }
}

// Recursive function to process the bookmark tree
function processBookmarkTree(bookmarkTree, bookmarks) {
    for (let node of bookmarkTree) {
        if (node.url) {
            // If the node has a URL, it's a bookmark
            bookmarks.push({
                name: node.title,
                url: node.url,
                // You can add more properties like tags if necessary
            });
        } else if (node.children) {
            // If the node has children, it's a folder
            processBookmarkTree(node.children, bookmarks);
        }
        // Ignore other types of nodes like separators
    }
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
