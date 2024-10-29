// Ensure marked is available
if (typeof marked === 'undefined') {
    console.error('Marked library is not loaded!');
}

async function loadPosts() {
    console.log('Starting to load posts...'); // Debug log
    const postsContainer = document.getElementById('posts-container');
    
    if (!postsContainer) {
        console.error('Posts container not found!');
        return;
    }

    try {
        const username = 'M-Brond';
        const repo = 'LBB';
        
        console.log(`Fetching posts from https://api.github.com/repos/${username}/${repo}/contents/posts`);
        
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/posts`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const files = await response.json();
        console.log('Found files:', files); // Debug log

        if (files.length === 0) {
            postsContainer.innerHTML = '<p>No posts found in the posts directory.</p>';
            return;
        }

        for (const file of files) {
            if (file.name.endsWith('.md')) {
                console.log(`Loading post: ${file.name}`); // Debug log
                
                const postContent = await fetch(file.download_url);
                if (!postContent.ok) {
                    console.error(`Failed to load ${file.name}`);
                    continue;
                }
                
                const text = await postContent.text();
                
                const postElement = document.createElement('article');
                postElement.className = 'post';
                
                // Add a title based on the filename
                const titleElement = document.createElement('h3');
                titleElement.textContent = file.name.replace('.md', '').replace(/-/g, ' ');
                postElement.appendChild(titleElement);
                
                // Add the content
                const contentElement = document.createElement('div');
                contentElement.className = 'post-content';
                contentElement.innerHTML = marked.parse(text);
                postElement.appendChild(contentElement);
                
                postsContainer.appendChild(postElement);
                console.log(`Successfully loaded ${file.name}`); // Debug log
            }
        }

        // If no markdown files were found
        if (postsContainer.children.length === 0) {
            postsContainer.innerHTML = '<p>No markdown posts found in the posts directory.</p>';
        }

    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load posts. Please ensure:</p>
                <ul>
                    <li>The repository is public</li>
                    <li>The posts directory exists</li>
                    <li>There are .md files in the posts directory</li>
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
    .error-message ul {
        margin: 10px 0;
        padding-left: 20px;
    }
`;
document.head.appendChild(style);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing post loader...'); // Debug log
    loadPosts();
}); 