async function loadPosts() {
    console.log('Starting to load posts...'); // Debug log
    const postsContainer = document.getElementById('posts-container');
    
    if (!postsContainer) {
        console.error('Posts container not found!');
        return;
    }

    try {
        // Direct fetch of specific markdown files since we know their names
        const posts = [
            'posts/2024-10-29-wedding-speech.md',
            'posts/first-post.md'
        ];

        for (const postPath of posts) {
            try {
                const response = await fetch(postPath);
                if (!response.ok) {
                    console.error(`Failed to load ${postPath}`);
                    continue;
                }
                
                const text = await response.text();
                
                const postElement = document.createElement('article');
                postElement.className = 'post';
                
                // Parse front matter if it exists
                let content = text;
                let title = postPath.split('/').pop().replace('.md', '').replace(/-/g, ' ');
                
                if (text.startsWith('---')) {
                    const frontMatterEnd = text.indexOf('---', 3);
                    if (frontMatterEnd !== -1) {
                        const frontMatter = text.slice(3, frontMatterEnd);
                        content = text.slice(frontMatterEnd + 3);
                        // Extract title from front matter if it exists
                        const titleMatch = frontMatter.match(/title:\s*"(.+)"/);
                        if (titleMatch) {
                            title = titleMatch[1];
                        }
                    }
                }
                
                // Add title
                const titleElement = document.createElement('h3');
                titleElement.textContent = title;
                postElement.appendChild(titleElement);
                
                // Add content
                const contentElement = document.createElement('div');
                contentElement.className = 'post-content';
                contentElement.innerHTML = marked.parse(content);
                postElement.appendChild(contentElement);
                
                postsContainer.appendChild(postElement);
                console.log(`Successfully loaded ${postPath}`);
            } catch (error) {
                console.error(`Error loading ${postPath}:`, error);
            }
        }

        // If no posts were loaded
        if (postsContainer.children.length === 0) {
            postsContainer.innerHTML = '<p>No posts could be loaded at this time.</p>';
        }

    } catch (error) {
        console.error('Error in post loading process:', error);
        postsContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load posts. Please ensure all files exist and are accessible.</p>
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
    if (typeof marked === 'undefined') {
        console.error('Marked library not loaded!');
        return;
    }
    console.log('DOM loaded, initializing post loader...');
    loadPosts();
}); 