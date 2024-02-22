// Importing sendBookmarksToServer function
import { sendBookmarksToServer } from './servercommunication.js';

function toggleWaitingIndicator(show) {
    const indicator = document.getElementById('waitingIndicator');
    indicator.style.display = show ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveBookmarksButton');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            toggleWaitingIndicator(true);
            sendBookmarksToServer().finally(() => {
                toggleWaitingIndicator(false);
            });
        });
    }
});
