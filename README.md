# BookmarkSort Extension

## Overview

The BookmarkSort extension is a powerful tool to organize and enrich your bookmark experience on the web. It semantically sorts your bookmarks, making it easier for you to find and manage the web links you've saved. With a user-friendly interface, the extension works seamlessly in your browser, giving your bookmarks a structured and tidy arrangement.

## Features

- **Semantic Sorting**: Sorts bookmarks based on their content and utility.

(uses firefox api to retrieve and set bookmarks)

## Getting Started

1. **Install Extension**: Download and install the BookmarkSort extension from the browser's extension store.
2. **Navigate to Extension**: Click on the BookmarkSort icon in your browser toolbar.
3. **Sort & Save**: Use the 'Save Bookmarks' button to sort and save your bookmarks on the server.

## API Endpoint

The extension communicates with a server-side API that processes and sorts the bookmarks. Here’s how the data is handled:

### `/cluster` Endpoint

Receives and returns JSON data of bookmarks. Each bookmark must contain "name" and "url" fields, and optional "tags".

#### Input Format Example

```json
[
  {
    "name": "Mozilla Support",
    "url": "https://support.mozilla.org/products/firefox",
    "tags": ["Bookmarks Menu", "Mozilla Firefox"]
  },
  {
    "name": "OpenAI Chat",
    "url": "https://chat.openai.com/?model=gpt-4",
    "tags": ["Bookmarks Toolbar"]
  },
  // More bookmarks...
]
```

#### Output Format Example

```json
{
  "Data Cleaning and Analysis Resources": [
    {
      "name": "GitHub - DataCleaning",
      "url": "https://github.com/datacleaning"
    },
    {
      "name": "Cleaning Data with ChatGPT - LunaBrain",
      "url": "https://lunabrain.com/blog/clean-data-with-chatgpt"
    }
    // More sorted bookmarks...
  ],
  // Additional categories...
}
```

The server processes bookmarks data and sorts it into categories, returning a JSON object with categories as keys and lists of bookmarks as values.

## Installation

The extension can be installed manually by loading the unpacked extension in developer mode in the browser or via official extension distribution platforms, such as the Chrome Web Store or Firefox Add-ons.