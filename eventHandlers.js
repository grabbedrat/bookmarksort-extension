// eventHandlers.js
import { sendBookmarksToServer } from './serverCommunication.js';

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveBookmarksButton')?.addEventListener('click', () => {
        const indicator = document.getElementById('waitingIndicator');
        indicator.style.display = 'block';
        sendBookmarksToServer().finally(() => indicator.style.display = 'none');
    });
});