export function setupFilters() {
  const filterButtons = document.querySelectorAll('#project-filters button');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');
      const projects = document.querySelectorAll('.project-card');

      projects.forEach(project => {
        const categories = project.getAttribute('data-category').split(' ');
        project.style.display = (filter === 'all' || categories.includes(filter)) ? 'block' : 'none';
      });
    });
  });
}
