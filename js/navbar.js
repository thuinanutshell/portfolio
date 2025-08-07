async function loadNavbar() {
  try {
    const response = await fetch('../shared/navbar.html');
    const navbarHTML = await response.text();
    
    // Insert navbar into header container
    const headerContainer = document.getElementById('header-container') || document.getElementById('main-container');
    
    // Create navbar container if it doesn't exist
    let navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) {
      navbarContainer = document.createElement('div');
      navbarContainer.id = 'navbar-container';
      headerContainer.insertBefore(navbarContainer, headerContainer.firstChild);
    }
    
    navbarContainer.innerHTML = navbarHTML;
    
    // Set active link based on current page
    setActiveNavLink();
  } catch (error) {
    console.error('Error loading navbar:', error);
  }
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('#navbar a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

export { loadNavbar };

// Load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', loadNavbar);