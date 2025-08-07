import { blogPosts } from '../data/blogs.js';

export function renderBlogPosts() {
  const list = document.querySelector('.blog-list');
  list.innerHTML = '';

  blogPosts.forEach(post => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${post.link}">
        <h2>${post.title}</h2>
        <p class="description">${post.description}</p>
      </a>
    `;
    list.appendChild(li);
  });
}
