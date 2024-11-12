async function loadPosts() {
    console.log('Starting to load posts...'); // Debug log
    const postsContainer = document.getElementById('posts-container');
    
    if (!postsContainer) {
        console.error('Posts container not found!');
        return;
    }

    try {
        const response = await fetch('https://api.github.com/repos/M-Brond/LBB/contents/posts');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const files = await response.json();
        
        if (!Array.isArray(files)) {
            throw new TypeError('Expected an array of files');
        }

        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const postResponse = await fetch(file.download_url);
                const text = await postResponse.text();
                
                const postElement = document.createElement('article');
                postElement.className = 'post';
                
                // Add title
                const titleElement = document.createElement('h3');
                titleElement.textContent = file.name.replace('.md', '').replace(/-/g, ' ');
                postElement.appendChild(titleElement);
                
                // Add content
                const contentElement = document.createElement('div');
                contentElement.className = 'post-content';
                contentElement.innerHTML = marked.parse(text);
                postElement.appendChild(contentElement);
                
                postsContainer.appendChild(postElement);
                console.log(`Post ${file.name} successfully rendered`);
            }
        }

    } catch (error) {
        console.error('Error in post loading process:', error);
        postsContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load posts. Please check:</p>
                <ul>
                    <li>The repository is public</li>
                    <li>The files exist in the posts directory</li>
                    <li>You're on the main branch</li>
                </ul>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    }
}

// Add some basic styling for error messages
const style = document.createElement('style');
style.textContent = `
    .error-message {
        padding: 20px;
        background-color: #fff3f3;
        border: 1px solid #ffa7a7;
        border-radius: 5px;
        margin: 20px 0;
    }
    .post {
        margin-bottom: 2rem;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .post h3 {
        margin-bottom: 1rem;
        color: #333;
    }
    .post-content {
        line-height: 1.6;
    }
`;
document.head.appendChild(style);

// Wait for DOM and marked library to be ready
document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    if (typeof marked === 'undefined') {
        console.error('Marked library not loaded!');
        postsContainer.innerHTML = '<p>Error: Marked library not loaded. Please check your HTML includes the marked.js script.</p>';
        return;
    }
    console.log('DOM loaded, initializing post loader...');
    loadPosts();
}); 