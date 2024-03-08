document.addEventListener('DOMContentLoaded', () => {
    fetch('../components/header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            const commentLink = document.querySelector('.comment-link');
            if (!document.getElementById('commentSection') && commentLink) {
                commentLink.style.display = 'none';
            }
        });

    fetch('../components/footer.html')
        .then(response => response.text())
        .then(data => document.body.insertAdjacentHTML('beforeend', data));

    const commentToggle = document.querySelector('.comment-toggle');
    const commentList = document.getElementById('commentList');
    const commentForm = document.getElementById('commentForm');
    const articleId = document.location.pathname.split('/').pop(); // Identifiant unique de l'article

    if (commentToggle && commentList) {
        commentList.style.display = 'none';
        commentToggle.addEventListener('click', () => {
            const isHidden = commentList.style.display === 'none';
            commentList.style.display = isHidden ? 'block' : 'none';
            commentToggle.textContent = isHidden ? '▼' : '►';
        });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const commentInput = document.getElementById('commentInput');
            const commentText = commentInput.value.trim();
            if (commentText) {
                const comment = { text: commentText, id: new Date().getTime() };
                addComment(comment);
                commentInput.value = '';
                saveComment(articleId, comment);
            }
        });
    }

    function toggleTranscript() {
        var transcript = document.getElementById("transcript");
        if (transcript.style.display === "none") {
            transcript.style.display = "block";
        } else {
            transcript.style.display = "none";
        }
    }
    
    function addComment(comment) {
        const commentItem = document.createElement('li');
        commentItem.className = 'comment'; // Utiliser la classe pour le style
        commentItem.textContent = comment.text;
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-comment'; // Utiliser la classe pour le style
        deleteButton.textContent = '✖';
        deleteButton.onclick = function() { deleteComment(comment.id); };
    
        commentItem.appendChild(deleteButton);
        commentList.appendChild(commentItem);
    }

    function saveComment(articleId, comment) {
        let comments = JSON.parse(localStorage.getItem(articleId) || '[]');
        comments.push(comment);
        localStorage.setItem(articleId, JSON.stringify(comments));
    }

    function loadComments(articleId) {
        let comments = JSON.parse(localStorage.getItem(articleId) || '[]');
        comments.forEach(comment => {
            addComment(comment);
        });
    }

    function deleteComment(commentId) {
        let comments = JSON.parse(localStorage.getItem(articleId));
        comments = comments.filter(comment => comment.id !== commentId);
        localStorage.setItem(articleId, JSON.stringify(comments));
        // Rafraîchir les commentaires affichés
        commentList.innerHTML = '';
        loadComments(articleId);
    }
    loadComments(articleId);
});
