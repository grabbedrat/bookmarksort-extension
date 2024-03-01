// eventHandlers.js
import { sendBookmarksToServer } from './serverCommunication.js';

document.addEventListener('DOMContentLoaded', function() {
    // Find or create the elements for displaying errors and handling backups
    const errorContainer = document.getElementById('errorContainer') || createErrorContainer();
    const backupCheckbox = document.getElementById('backupCheckbox') || createBackupCheckbox(true); // true to auto-check it

    document.getElementById('saveBookmarksButton')?.addEventListener('click', () => {
        const indicator = document.getElementById('waitingIndicator');
        indicator.style.display = 'block';
        errorContainer.style.display = 'none'; // Hide error on new attempt
        sendBookmarksToServer(backupCheckbox.checked).finally(() => indicator.style.display = 'none');
    });
});

function createErrorContainer() {
    const container = document.createElement('div');
    container.id = 'errorContainer';
    container.style.display = 'none'; // Hidden by default
    container.style.color = 'red'; // Error color
    document.body.appendChild(container);
    return container;
}

function createBackupCheckbox(checked) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'backupCheckbox';
    checkbox.checked = checked;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' Backup before sending (recommended)'));
    document.body.appendChild(label);
    return checkbox;
}
