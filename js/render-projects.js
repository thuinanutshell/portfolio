import { projects } from '../data/projects.js';

function createProjectCard(project) {
  const card = document.createElement('a');
  card.href = project.link;
  card.target = '_blank';
  card.className = 'project-card';
  card.dataset.category = project.category;

  card.innerHTML = `
    <h3>${project.title} <span class="subtitle">– ${project.subtitle}</span></h3>
    <div class="tags">
      ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
    </div>
    <p>${project.description}</p>
  `;

  return card;
}

export function renderProjects() {
  const container = document.getElementById('projects-grid');
  container.innerHTML = ''; // Clear any existing content

  projects.forEach(project => {
    const card = createProjectCard(project);
    container.appendChild(card);
  });
}
