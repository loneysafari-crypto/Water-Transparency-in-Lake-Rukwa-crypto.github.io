// script.js - Improved Version
const form = document.getElementById('commentForm');
const commentsList = document.getElementById('commentsList');

// === REPLACE WITH YOUR ACTUAL GOOGLE APPS SCRIPT URL ===
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwFoTMYQvUGMzdCB5KjjVm3egwMKBYu6hq37HgM1SxeIUHWMenpNS4sa-ZcR1Rs_VMFiw/exec";

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !message) {
        alert("Name and message are required!");
        return;
    }

    const loadingBtn = document.querySelector('button[type="submit"]');
    loadingBtn.textContent = "Submitting...";
    loadingBtn.disabled = true;

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ name, email, message }),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.status === "success") {
            alert("✅ Thank you! Your feedback has been submitted successfully.");
            form.reset();
            loadRecentComments(); // Refresh comments after submission
        } else {
            alert("❌ Failed to submit comment. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("Connection error. Please check your internet connection and try again.");
    } finally {
        loadingBtn.textContent = "Submit Feedback";
        loadingBtn.disabled = false;
    }
});

// ==================== LOAD RECENT COMMENTS ====================
async function loadRecentComments() {
    commentsList.innerHTML = "<p>Loading comments...</p>";

    try {
        const response = await fetch(SCRIPT_URL + "?action=getComments");
        const data = await response.json();

        if (data.status === "success" && data.comments.length > 0) {
            let html = '';

            data.comments.forEach(comment => {
                const date = new Date(comment.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                html += `
                    <div class="comment-card">
                        <div class="comment-header">
                            <strong>${comment.name}</strong>
                            <small>${date}</small>
                        </div>
                        <p class="comment-message">${comment.message}</p>
                    </div>
                `;
            });

            commentsList.innerHTML = html;
        } else {
            commentsList.innerHTML = "<p>No comments yet. Be the first to share your feedback!</p>";
        }
    } catch (error) {
        console.error(error);
        commentsList.innerHTML = "<p>Unable to load comments at the moment.</p>";
    }
}

// Load comments when page loads
window.addEventListener('load', loadRecentComments);