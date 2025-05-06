// Settings Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize range input displays
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
        const display = input.nextElementSibling;
        if (display) {
            display.textContent = input.value;
            input.addEventListener('input', () => {
                display.textContent = input.value;
            });
        }
    });

    // Theme toggle functionality
    const darkModeToggle = document.getElementById('darkMode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode', this.checked);
            localStorage.setItem('darkMode', this.checked);
        });
    }

    // Settings form submission with validation
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Validate settings
            if (parseFloat(data.detection_sensitivity) < 0 || parseFloat(data.detection_sensitivity) > 1) {
                showNotification('Detection sensitivity must be between 0 and 1', 'error');
                return;
            }

            // Send settings to server
            fetch('/api/settings/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showNotification('Settings saved successfully', 'success');
                } else {
                    showNotification('Failed to save settings', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred while saving settings', 'error');
            });
        });
    }
});

// History Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date filters
    const dateFilters = document.querySelectorAll('.dropdown-item[href*="filter"]');
    dateFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            const filterValue = this.getAttribute('href').split('=')[1];
            
            fetch(`/api/history?filter=${filterValue}`)
                .then(response => response.json())
                .then(data => {
                    updateHistoryTable(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                    showNotification('Failed to load history data', 'error');
                });
        });
    });

    // Initialize video clip previews
    const clipLinks = document.querySelectorAll('a[href*="video_clip"]');
    clipLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const videoUrl = this.getAttribute('href');
            showVideoPreview(videoUrl);
        });
    });
});

// Analytics Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts if they exist
    if (document.getElementById('accuracyChart')) {
        initializeAccuracyChart();
    }
    if (document.getElementById('gesturesChart')) {
        initializeGesturesChart();
    }

    // Add chart responsiveness
    window.addEventListener('resize', function() {
        if (window.accuracyChart) {
            window.accuracyChart.resize();
        }
        if (window.gesturesChart) {
            window.gesturesChart.resize();
        }
    });
});

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 100);
}

function getCookie(name) {
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

function updateHistoryTable(data) {
    const tbody = document.querySelector('.history-table tbody');
    if (!tbody) return;

    tbody.innerHTML = data.records.map(record => `
        <tr>
            <td>
                <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center">
                        <h6 class="history-gesture mb-0">${record.gesture}</h6>
                    </div>
                </div>
            </td>
            <td>
                <div class="progress-wrapper">
                    <div class="progress-info">
                        <span class="progress-percentage">${(record.confidence * 100).toFixed(2)}%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar" style="width: ${record.confidence * 100}%"></div>
                    </div>
                </div>
            </td>
            <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                    ${new Date(record.timestamp).toLocaleDateString()}
                </span>
            </td>
            <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                    ${new Date(record.timestamp).toLocaleTimeString()}
                </span>
            </td>
            <td class="align-middle">
                ${record.video_clip ? `
                    <a href="${record.video_clip}" class="text-secondary font-weight-bold text-xs" target="_blank">
                        View Clip
                    </a>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function showVideoPreview(videoUrl) {
    const modal = document.createElement('div');
    modal.className = 'video-preview-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <video controls>
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    `;

    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Add these styles to your CSS
const style = document.createElement('style');
style.textContent = `
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

    .video-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .video-preview-modal .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }

    .video-preview-modal video {
        max-width: 100%;
        max-height: 80vh;
    }

    .video-preview-modal .close-modal {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    }
`;

document.head.appendChild(style); 