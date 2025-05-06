// Main Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize side menu functionality
    initializeSideMenu();
    
    // Initialize theme functionality
    initializeTheme();
    
    // Initialize notifications
    initializeNotifications();
});

// Side Menu Functionality
function initializeSideMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const mainContent = document.querySelector('.main-content');

    if (menuToggle && sideMenu) {
        menuToggle.addEventListener('click', () => {
            sideMenu.classList.add('active');
            if (menuOverlay) {
                menuOverlay.classList.add('active');
            }
            if (mainContent) {
                mainContent.classList.add('side-menu-active');
            }
            document.body.classList.add('menu-open');
        });
    }

    if (closeMenu && sideMenu) {
        closeMenu.addEventListener('click', () => {
            sideMenu.classList.remove('active');
            if (menuOverlay) {
                menuOverlay.classList.remove('active');
            }
            if (mainContent) {
                mainContent.classList.remove('side-menu-active');
            }
            document.body.classList.remove('menu-open');
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            sideMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            if (mainContent) {
                mainContent.classList.remove('side-menu-active');
            }
            document.body.classList.remove('menu-open');
        });
    }

    // Handle menu item active states
    const menuItems = document.querySelectorAll('.menu-item a');
    const currentPath = window.location.pathname;

    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.parentElement.classList.add('active');
        }
    });

    // Handle responsive behavior
    function handleResponsiveNav() {
        const width = window.innerWidth;
        
        if (width >= 992) {
            // Desktop view
            sideMenu?.classList.add('active');
            menuOverlay?.classList.remove('active');
            mainContent?.classList.add('side-menu-active');
        } else {
            // Mobile view
            sideMenu?.classList.remove('active');
            menuOverlay?.classList.remove('active');
            mainContent?.classList.remove('side-menu-active');
        }
    }

    // Initialize responsive behavior
    handleResponsiveNav();
    window.addEventListener('resize', handleResponsiveNav);
}

// Theme Functionality
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    } else {
        // If no saved preference, use system preference
        document.body.classList.toggle('dark-mode', prefersDarkScheme.matches);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('dark-mode', e.matches);
        }
    });
}

// Notification System
function initializeNotifications() {
    // Check for notification permission
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
}

// Utility Functions
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }, 100);
}

// Handle loading states
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// CSRF Token handling for AJAX requests
function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Setup AJAX CSRF token
function setupAjaxCsrf() {
    const csrftoken = getCsrfToken();
    if (csrftoken) {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
    }
}

// Add loading animation styles
const style = document.createElement('style');
style.textContent = `
    .loading {
        position: relative;
        pointer-events: none;
    }

    .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 1.5em;
        height: 1.5em;
        margin: -0.75em 0 0 -0.75em;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: loading-spinner 0.6s linear infinite;
    }

    @keyframes loading-spinner {
        to {
            transform: rotate(360deg);
        }
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        background: white;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #10B981;
    }

    .notification-error {
        border-left: 4px solid #EF4444;
    }

    .notification-info {
        border-left: 4px solid #3B82F6;
    }
`;

document.head.appendChild(style); 