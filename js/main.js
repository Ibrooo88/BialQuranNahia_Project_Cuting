// Main JavaScript File

// DOM Elements
const alertBox = document.getElementById('alert-box');
const studentImage = document.getElementById('main-image');
const fileInput = document.getElementById('file-input');

// Global Variables
let currentStudentId = 'STUDENT_ID'; // This should be set from the server

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initImageUpload();
    initNotifications();
    initTabs();
    
    // Load initial data
    loadStudentData();
    loadNotifications();
});

// Image Upload Functionality
function initImageUpload() {
    if (fileInput) {
        fileInput.addEventListener('change', function(event) {
            previewImage(event);
            uploadImage(event);
        });
    }
}

// Preview Image before Upload
function previewImage(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            studentImage.src = e.target.result;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Upload Image to Server
function uploadImage(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    fetch(`/api/students/${currentStudentId}/upload-image/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('تم بنجاح', 'تم تحديث الصورة بنجاح', 'success');
        } else {
            showNotification('خطأ', 'فشل في تحميل الصورة', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('خطأ', 'حدث خطأ أثناء تحميل الصورة', 'error');
    });
}

// Initialize Tabs
function initTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            switchTab(tabType);
        });
    });
}

// Switch Between Tabs
function switchTab(tabType) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`${tabType}-tab`).classList.remove('hidden');
    
    // Add active class to clicked tab
    document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');
    
    // Load data for the selected tab if needed
    if (tabType === 'upcoming') {
        loadUpcomingSessions();
    } else if (tabType === 'completed') {
        loadCompletedSessions();
    } else if (tabType === 'cancelled') {
        loadCancelledSessions();
    }
}

// Load Student Data
function loadStudentData() {
    fetch(`/api/students/${currentStudentId}/`)
        .then(response => response.json())
        .then(data => {
            updateStudentUI(data);
        })
        .catch(error => {
            console.error('Error loading student data:', error);
        });
}

// Update Student UI
function updateStudentUI(studentData) {
    // Update student name
    const nameElement = document.getElementById('student-name');
    if (nameElement) {
        nameElement.textContent = studentData.name || 'الطالب';
    }
    
    // Update student email
    const emailElement = document.getElementById('student-email');
    if (emailElement) {
        emailElement.textContent = studentData.email || '';
    }
    
    // Update student image if available
    if (studentData.image_url && studentImage) {
        studentImage.src = studentData.image_url;
    }
    
    // Update other student details as needed
}

// Initialize Notifications
function initNotifications() {
    // Check for new notifications periodically
    setInterval(checkForNewNotifications, 300000); // Every 5 minutes
}

// Check for New Notifications
function checkForNewNotifications() {
    fetch('/api/notifications/latest/')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                data.forEach(notification => {
                    showNotification(notification.title, notification.message, notification.type || 'info');
                });
            }
        })
        .catch(error => {
            console.error('Error checking for notifications:', error);
        });
}

// Show Notification
function showNotification(title, message, type = 'info') {
    // You can use a library like SweetAlert2 or create your own notification UI
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: title,
            text: message,
            icon: type,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        // Fallback to browser notifications if available
        if (Notification.permission === 'granted') {
            new Notification(title, { body: message });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    }
}

// Load Notifications
function loadNotifications() {
    fetch('/api/notifications/')
        .then(response => response.json())
        .then(data => {
            updateNotificationsUI(data);
        })
        .catch(error => {
            console.error('Error loading notifications:', error);
        });
}

// Update Notifications UI
function updateNotificationsUI(notifications) {
    const notificationsContainer = document.getElementById('notifications-container');
    if (!notificationsContainer) return;
    
    notificationsContainer.innerHTML = '';
    
    if (notifications.length === 0) {
        notificationsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">لا توجد إشعارات</p>';
        return;
    }
    
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `p-4 border-b ${!notification.read ? 'bg-blue-50' : ''}`;
        notificationElement.innerHTML = `
            <h4 class="font-semibold">${notification.title}</h4>
            <p class="text-sm text-gray-600">${notification.message}</p>
            <div class="text-xs text-gray-400 mt-1">${formatDate(notification.timestamp)}</div>
        `;
        
        notificationElement.addEventListener('click', () => {
            markNotificationAsRead(notification.id);
            // Handle notification click (e.g., navigate to relevant page)
        });
        
        notificationsContainer.appendChild(notificationElement);
    });
}

// Mark Notification as Read
function markNotificationAsRead(notificationId) {
    fetch(`/api/notifications/${notificationId}/mark-as-read/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update UI to show notification as read
            const notificationElement = document.querySelector(`[data-notification-id="${notificationId}"]`);
            if (notificationElement) {
                notificationElement.classList.remove('bg-blue-50');
            }
        }
    })
    .catch(error => {
        console.error('Error marking notification as read:', error);
    });
}

// Format Date
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
}

// Get CSRF Token
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

// Export functions that need to be available globally
window.StudentDashboard = {
    switchTab,
    showNotification,
    loadStudentData,
    uploadImage
};
