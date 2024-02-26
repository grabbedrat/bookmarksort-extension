// bookmarkUtils.js
export function simplifyBookmarkData(bookmarkItem, parentTags = []) {
    console.log('simplifyBookmarkData');
    let simplifiedBookmarks = [];

    if (bookmarkItem.url) {
        simplifiedBookmarks.push({
            name: bookmarkItem.title,
            url: bookmarkItem.url,
            tags: parentTags,
        });
    }
    
    if (bookmarkItem.children) {
        bookmarkItem.children.forEach(child => {
            const tagsForChildren = [...parentTags, bookmarkItem.title].filter(Boolean);
            simplifiedBookmarks.push(...simplifyBookmarkData(child, tagsForChildren));
        });
    }

    return simplifiedBookmarks;
}

