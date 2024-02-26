// serverCommunication.js
import { simplifyBookmarkData } from './bookmarkUtils.js';

export async function sendBookmarksToServer() {
    try {
        const bookmarkItems = await browser.bookmarks.getTree();
        //console.log('Bookmark items:', bookmarkItems);
        const simplifiedBookmarks = simplifyBookmarkData(bookmarkItems[0]);
        //console.log('Simplified bookmarks:', simplifiedBookmarks);
        const bookmarksData = JSON.stringify(simplifiedBookmarks);
        //console.log('Sending data to server:', bookmarksData);

        const response = await fetch('http://localhost:5000/cluster', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: bookmarksData,
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        } else {
            console.log('Bookmarks received by server successfully.');
        }

        const data = await response.json();

        // Check if the server response is in the expected format or validates correctly
        // Assuming a simple validation for this example; adjust based on your actual data structure and requirements
        //if (data && Array.isArray(data)) {
          //  await removeAllBookmarks();
            await createBookmarksFromJSON(data);
            console.log('Bookmarks updated successfully.');
        //} else {
        //    throw new Error('Invalid data format received from server');
        //}
    } catch (error) {
        console.error('Error:', error);
    }
}

// Removes all user-created bookmarks while preserving the root folders
function removeAllBookmarks() {
    return browser.bookmarks.getTree()
        .then(bookmarkItems => {
            // Flatten the tree to get all bookmark IDs except for the root folders
            const allBookmarkIds = [];
            const traverseBookmarks = (items) => {
                items.forEach(item => {
                    // Check if the item is a root folder by ensuring it doesn't have a parentId
                    if (item.parentId) {
                        allBookmarkIds.push(item.id);
                    }
                    if (item.children) {
                        traverseBookmarks(item.children);
                    }
                });
            };
            traverseBookmarks(bookmarkItems);

            // Remove each bookmark or folder found
            const removalPromises = allBookmarkIds.map(id => browser.bookmarks.removeTree(id));
            return Promise.all(removalPromises);
        });
}


// Creates bookmarks and folders from a structured JSON object
function createBookmarksFromJSON(bookmarksData) {
    console.log('Creating bookmarks from JSON:', bookmarksData);
    const createBookmark = (parentId, { name, url }) => {
        return browser.bookmarks.create({
            parentId,
            title: name,
            url
        });
    };

    const createFolderAndBookmarks = (folderName, bookmarks) => {
        return browser.bookmarks.create({ title: folderName })
            .then(folder => {
                // Create all bookmarks in this folder
                const bookmarkPromises = bookmarks.map(bookmark => createBookmark(folder.id, bookmark));
                return Promise.all(bookmarkPromises);
            });
    };

    // Process each folder and its bookmarks
    const folderPromises = Object.entries(bookmarksData).map(([folderName, bookmarks]) => 
        createFolderAndBookmarks(folderName, bookmarks)
    );
    console.log('Folder promises:', folderPromises);
    return Promise.all(folderPromises);
}