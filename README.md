markdown

# Bookmark Sorter Extension

A Firefox extension that sorts your bookmarks using a backend Flask server.

## Features

- Automatically sort bookmarks
- Option to backup bookmarks before sorting

## Installation

Download and load this extension via the `about:debugging` page in Firefox.

## Usage

- Open extension popup
- Select backup option (recommended)
- Click "Save Bookmarks"

## API Endpoint

`/cluster`: Receives and returns sorted bookmarks as JSON.
