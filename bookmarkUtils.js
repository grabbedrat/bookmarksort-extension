// bookmarkUtils.js

// This file provides utility functions for working with bookmark data.

// Simplifies the raw bookmark data from the browser into a manageable structure.
export function simplifyBookmarkData(bookmarkItem, parentTags = []) {
  let simplifiedBookmarks = [];

  // Check if the bookmarkItem is an actual bookmark with a URL and push it into the array.
  if (bookmarkItem.url) {
    simplifiedBookmarks.push({
      name: bookmarkItem.title,
      url: bookmarkItem.url,
      tags: parentTags, // Array of parent folder names acting as tags
    });
  }

  // If the bookmarkItem has children, recursively simplify each child and concatenate the results.
  if (bookmarkItem.children) {
    bookmarkItem.children.forEach((child) => {
      const tagsForChild = [...parentTags, bookmarkItem.title].filter(Boolean); // Avoid adding empty titles
      simplifiedBookmarks.push(...simplifyBookmarkData(child, tagsForChild));
    });
  }

  return simplifiedBookmarks;
}
