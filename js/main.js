async function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    
    try {
        // Fetch the list of posts from the posts directory
        const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/posts');
        const files = await response.json();
        
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const postContent = await fetch(file.download_url);
                const text = await postContent.text();
                
                const postElement = document.createElement('article');
                postElement.className = 'post';
                postElement.innerHTML = marked.parse(text);
                
                postsContainer.appendChild(postElement);
            }
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadPosts); 