// ==================== AUTHENTICATION ====================
// Admin Credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Check if user is authenticated
function isAuthenticated() {
    const session = sessionStorage.getItem('adminLoggedIn');
    return session === 'true';
}

// Set authentication session
function setAuthenticated(value) {
    if (value) {
        sessionStorage.setItem('adminLoggedIn', 'true');
    } else {
        sessionStorage.removeItem('adminLoggedIn');
    }
}

// Show login form
function showLogin() {
    const loginSection = document.getElementById('login-section');
    const adminContent = document.getElementById('admin-content');
    if (loginSection) {
        loginSection.classList.remove('hidden');
        loginSection.style.display = 'flex';
        loginSection.style.visibility = 'visible';
        loginSection.style.opacity = '1';
    }
    if (adminContent) {
        adminContent.style.display = 'none';
        adminContent.style.visibility = 'hidden';
    }
}

// Show admin panel
function showAdminPanel() {
    const loginSection = document.getElementById('login-section');
    const adminContent = document.getElementById('admin-content');
    if (loginSection) {
        loginSection.classList.add('hidden');
        loginSection.style.display = 'none';
        loginSection.style.visibility = 'hidden';
    }
    if (adminContent) {
        adminContent.style.display = 'block';
        adminContent.style.visibility = 'visible';
    }
}

// Handle login
function handleLogin(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        setAuthenticated(true);
        showAdminPanel();
        showSuccessMessage('Login successful! Welcome to Admin Panel.');
        return true;
    } else {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = 'Invalid username or password. Please try again.';
            errorDiv.classList.add('show');
            setTimeout(() => {
                errorDiv.classList.remove('show');
            }, 4000);
        }
        return false;
    }
}

// Handle logout
function handleLogout() {
    setAuthenticated(false);
    showLogin();
    // Clear form fields
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    showSuccessMessage('Logged out successfully.');
}

// Initialize authentication on page load
function initAuth() {
    const loginSection = document.getElementById('login-section');
    const adminContent = document.getElementById('admin-content');
    
    // Ensure elements exist before proceeding
    if (!loginSection || !adminContent) {
        console.error('Login section or admin content not found');
        return;
    }
    
    // Check authentication status
    if (isAuthenticated()) {
        showAdminPanel();
    } else {
        // Ensure login is visible - force visibility
        loginSection.style.display = 'flex';
        loginSection.style.visibility = 'visible';
        loginSection.style.opacity = '1';
        loginSection.classList.remove('hidden');
        adminContent.style.display = 'none';
        adminContent.style.visibility = 'hidden';
    }
}

// ==================== UTILITY FUNCTIONS ====================
// Show success message
function showSuccessMessage(message) {
    const successMsg = document.getElementById('success-message');
    if (!successMsg) {
        // Fallback to alert if element doesn't exist
        alert(message);
        return;
    }
    
    successMsg.textContent = message;
    successMsg.classList.add('show');
    
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 3000);
}

// Add fadeOut animation for deletions
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// Load existing student data if available (only when authenticated)
function loadAdminData() {
    const existingData = JSON.parse(localStorage.getItem('studentOfMonth') || '{}');
    if (existingData.name) {
        const nameInput = document.getElementById('new-student-name');
        const classInput = document.getElementById('new-student-class');
        if (nameInput) nameInput.value = existingData.name;
        if (classInput) classInput.value = existingData.class;
    }
    
    // Load and display gallery photos
    const galleryPhotos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
    displayGallery(galleryPhotos);
}

// Initialize mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Ensure login section is visible by default - force it
    const loginSection = document.getElementById('login-section');
    const adminContent = document.getElementById('admin-content');
    
    if (loginSection) {
        loginSection.style.display = 'flex';
        loginSection.style.visibility = 'visible';
        loginSection.style.opacity = '1';
        loginSection.classList.remove('hidden');
    }
    if (adminContent) {
        adminContent.style.display = 'none';
        adminContent.style.visibility = 'hidden';
    }
    
    // Initialize authentication after ensuring default state
    // Small delay to ensure DOM is fully rendered
    setTimeout(function() {
        initAuth();
    }, 50);
    
    // If authenticated, load admin data
    if (isAuthenticated()) {
        loadAdminData();
        initScrollAnimations();
    }
    
    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            
            if (handleLogin(username, password)) {
                // Load admin data after successful login
                loadAdminData();
                initScrollAnimations();
            }
        });
    }
    
    // Logout button handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                handleLogout();
            }
        });
    }
});

// Initialize scroll-triggered animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Display gallery photos with delete buttons and animations
function displayGallery(photos) {
    const gallery = document.getElementById('photo-gallery');
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    if (photos.length === 0) {
        gallery.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666; animation: fadeIn 0.8s ease-out;">No photos in gallery yet.</p>';
        return;
    }
    
    photos.forEach((photoUrl, index) => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'gallery-item';
        imgDiv.style.animationDelay = `${index * 0.1}s`;
        
        const img = document.createElement('img');
        img.src = photoUrl;
        img.alt = `Gallery Photo ${index + 1}`;
        img.onerror = function() {
            imgDiv.remove();
        };
        
        // Add delete button with animation
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-photo-btn';
        deleteBtn.onclick = function() {
            if (confirm('Are you sure you want to delete this photo?')) {
                deleteGalleryPhoto(index);
            }
        };
        
        imgDiv.appendChild(img);
        imgDiv.appendChild(deleteBtn);
        gallery.appendChild(imgDiv);
    });
}

// Delete gallery photo
function deleteGalleryPhoto(index) {
    try {
        const photos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
        const photoItem = document.querySelectorAll('.gallery-item')[index];
        if (photoItem) {
            photoItem.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                photos.splice(index, 1);
                localStorage.setItem('galleryPhotos', JSON.stringify(photos));
                displayGallery(photos);
                showSuccessMessage('Photo deleted successfully!');
            }, 300);
        } else {
            photos.splice(index, 1);
            localStorage.setItem('galleryPhotos', JSON.stringify(photos));
            displayGallery(photos);
            showSuccessMessage('Photo deleted successfully!');
        }
    } catch (error) {
        alert('Error deleting photo: ' + error.message);
    }
}

// Handle Student of the Month form submission
document.getElementById('student-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('new-student-name').value.trim();
    const classValue = document.getElementById('new-student-class').value.trim();
    const photoFile = document.getElementById('new-student-photo').files[0];
    
    if (!name || !classValue) {
        alert('Please fill in both name and class.');
        return;
    }
    
    const studentData = {
        name: name,
        class: classValue
    };
    
    // Handle photo upload
    if (photoFile) {
        const form = document.getElementById('student-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Uploading...';
        submitBtn.disabled = true;
        
        compressImage(photoFile).then(function(compressedPhoto) {
            studentData.photo = compressedPhoto;
            try {
                saveStudentData(studentData);
            } catch (storageError) {
                if (storageError.name === 'QuotaExceededError' || storageError.code === 22) {
                    alert('Storage limit reached! Please try with a smaller image.');
                } else {
                    alert('Error saving: ' + storageError.message);
                }
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }).catch(function(error) {
            alert('Error processing photo: ' + error.message);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
        return;
    } else {
        // Keep existing photo if no new one is uploaded
        const existingData = JSON.parse(localStorage.getItem('studentOfMonth') || '{}');
        if (existingData.photo) {
            studentData.photo = existingData.photo;
        }
        saveStudentData(studentData);
    }
});

// Save student data
function saveStudentData(data) {
    localStorage.setItem('studentOfMonth', JSON.stringify(data));
    
    // Clear photo input only
    document.getElementById('new-student-photo').value = '';
    
    showSuccessMessage('Student of the Month updated successfully!');
}

// Compress image function
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to compressed base64
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Handle Gallery form submission
document.getElementById('gallery-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const photoFile = document.getElementById('new-gallery-photo').files[0];
    
    if (!photoFile) {
        alert('Please select a photo to upload.');
        return;
    }
    
    // Show loading message
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Uploading...';
    submitBtn.disabled = true;
    
    try {
        // Compress the image before storing
        const compressedPhoto = await compressImage(photoFile);
        
        // Try to save to localStorage
        try {
            const photos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
            photos.push(compressedPhoto);
            localStorage.setItem('galleryPhotos', JSON.stringify(photos));
            displayGallery(photos);
            
            // Clear form
            document.getElementById('new-gallery-photo').value = '';
            
            showSuccessMessage('Photo added to gallery successfully!');
        } catch (storageError) {
            // Handle storage quota exceeded
            if (storageError.name === 'QuotaExceededError' || storageError.code === 22) {
                alert('Storage limit reached! Please delete some photos to free up space.');
            } else {
                alert('Error saving photo: ' + storageError.message);
            }
        }
    } catch (error) {
        alert('Error processing photo: ' + error.message);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

