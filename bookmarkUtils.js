// Functions related to bookmark processing

function stripUnneededInfo(bookmarkItem) {
    delete bookmarkItem.id;
    delete bookmarkItem.index;
    delete bookmarkItem.parentId;

    if (bookmarkItem.children) {
        bookmarkItem.children.forEach(child => stripUnneededInfo(child));
    }
}

function saveBookmarksToFile(bookmarkItems) {
    const bookmarksData = JSON.stringify(bookmarkItems, null, 2);
    const blob = new Blob([bookmarksData], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks_backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export { stripUnneededInfo, saveBookmarksToFile };
