document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const menuToggle = document.getElementById('menuToggle');
  const closeMenu = document.getElementById('closeMenu');
  const sideMenu = document.querySelector('.side-menu');
  const mainWrapper = document.querySelector('.main-content');
  
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);
  
  // Toggle side menu
  function toggleSideMenu() {
    sideMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    if (mainWrapper) {
      mainWrapper.classList.toggle('side-menu-active');
    }
    overlay.classList.toggle('active');
    
    // We don't need to toggle overflow anymore since body is always hidden
    // Just focus on accessibility
    if (sideMenu.classList.contains('active')) {
      // Trap focus in side menu when open
      menuToggle.setAttribute('aria-expanded', 'true');
      document.getElementById('closeMenu').focus();
    } else {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  }
  
  // Event listeners for menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleSideMenu);
  }
  if (closeMenu) {
    closeMenu.addEventListener('click', toggleSideMenu);
  }
  overlay.addEventListener('click', toggleSideMenu);
  
  // Add accessibility attributes
  if (menuToggle) {
    menuToggle.setAttribute('aria-label', 'Open menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'side-menu');
  }
  if (closeMenu) {
    closeMenu.setAttribute('aria-label', 'Close menu');
  }
  
  // Menu item click event for mobile (auto-close menu)
  const menuItems = document.querySelectorAll('.menu-item a');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      if (window.innerWidth < 992 && sideMenu.classList.contains('active')) {
        toggleSideMenu();
      }
    });
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Close menu automatically on mobile when resizing
      if (window.innerWidth < 992 && sideMenu.classList.contains('active')) {
        toggleSideMenu();
      }
    }, 250);
  });
  
  // Active menu item based on current URL
  function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    
    menuItems.forEach(item => {
      // Remove active class from all items
      item.parentElement.classList.remove('active');
      
      // Get the href value
      const href = item.getAttribute('href');
      
      // Set active class if the href matches current path
      if (href === currentPath || 
          (currentPath === '/' && href === '/') || 
          (href !== '/' && currentPath.includes(href))) {
        item.parentElement.classList.add('active');
      }
    });
  }
  
  // Call on page load
  setActiveMenuItem();
  
  // Navbar scroll behavior
  let lastScrollTop = 0;
  const navbar = document.querySelector('.top-navbar');
  
  // We still want to handle shadow on inner container scrolls
  document.querySelectorAll('.video-container, .interaction-panel').forEach(container => {
    container.addEventListener('scroll', function() {
      const scrollTop = container.scrollTop;
      
      // Add shadow when scrolled
      if (scrollTop > 10) {
        navbar.style.boxShadow = 'var(--shadow-lg)';
      } else {
        navbar.style.boxShadow = 'var(--shadow-md)';
      }
    });
  });
  
  // Notification badge animation
  const notificationBadge = document.querySelector('.notification-badge');
  if (notificationBadge && parseInt(notificationBadge.textContent) > 0) {
    notificationBadge.classList.add('pulse');
  }
}); 