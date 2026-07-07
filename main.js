document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Active Nav Link Highlight based on current page URL
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    const itemHref = item.getAttribute('href');
    if (itemHref === pageName || (pageName === '' && itemHref === 'index.html')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Page Transition: Add fade-in animation to body or main element
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('fade-in');
  }
});
