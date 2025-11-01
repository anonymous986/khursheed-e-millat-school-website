// Global variables for lightbox
let currentGalleryPhotos = [];
let currentLightboxIndex = 0;

// Initialize data from localStorage
function initData() {
    // Load student of the month
    const studentData = JSON.parse(localStorage.getItem('studentOfMonth') || '{}');
    if (studentData.name) {
        updateStudentDisplay(studentData);
    }
    
    // Load gallery photos
    const galleryPhotos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
    currentGalleryPhotos = galleryPhotos;
    displayGallery(galleryPhotos);
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize lightbox
    initLightbox();
    
    // Listen for storage changes (for real-time updates)
    window.addEventListener('storage', handleStorageChange);
    
    // Check for updates every 2 seconds (for same-window updates)
    setInterval(checkForUpdates, 2000);
}

// Handle storage changes from other tabs/windows
function handleStorageChange(e) {
    if (e.key === 'studentOfMonth') {
        const studentData = JSON.parse(e.newValue || '{}');
        updateStudentDisplay(studentData);
        showSuccessMessage('Student of the Month updated!');
    } else if (e.key === 'galleryPhotos') {
        const galleryPhotos = JSON.parse(e.newValue || '[]');
        currentGalleryPhotos = galleryPhotos;
        displayGallery(galleryPhotos);
        showSuccessMessage('Gallery updated!');
    }
}

// Check for updates in localStorage
function checkForUpdates() {
    const studentData = JSON.parse(localStorage.getItem('studentOfMonth') || '{}');
    const galleryPhotos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
    
    if (galleryPhotos.length !== currentGalleryPhotos.length) {
        currentGalleryPhotos = galleryPhotos;
        displayGallery(galleryPhotos);
    }
}

// Update student of the month display with animation
function updateStudentDisplay(data) {
    const nameSpan = document.querySelector('#student-name span');
    const classSpan = document.querySelector('#student-class span');
    const photoImg = document.getElementById('student-photo');
    
    // Animate name update
    if (nameSpan && data.name) {
        nameSpan.style.opacity = '0';
        nameSpan.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            nameSpan.textContent = data.name || '';
            nameSpan.style.transition = 'all 0.5s ease';
            nameSpan.style.opacity = '1';
            nameSpan.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animate class update
    if (classSpan && data.class) {
        classSpan.style.opacity = '0';
        classSpan.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            classSpan.textContent = data.class || '';
            classSpan.style.transition = 'all 0.5s ease';
            classSpan.style.opacity = '1';
            classSpan.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // Animate photo update
    if (photoImg) {
        if (data.photo) {
            photoImg.style.opacity = '0';
            photoImg.style.transform = 'scale(0.8)';
            setTimeout(() => {
                photoImg.src = data.photo;
                photoImg.style.display = 'block';
                photoImg.style.transition = 'all 0.5s ease';
                photoImg.style.opacity = '1';
                photoImg.style.transform = 'scale(1)';
            }, 300);
        } else {
            photoImg.style.display = 'none';
        }
    }
}

// Display gallery photos with staggered animations
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
        
        // Add click event for lightbox
        imgDiv.addEventListener('click', () => openLightbox(index));
        
        // Add keyboard navigation hint
        imgDiv.setAttribute('tabindex', '0');
        imgDiv.setAttribute('role', 'button');
        imgDiv.setAttribute('aria-label', `View gallery photo ${index + 1}`);
        imgDiv.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
        
        imgDiv.appendChild(img);
        gallery.appendChild(imgDiv);
    });
}

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

// Initialize lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (!lightbox || !lightboxImg) return;
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Open lightbox
    window.openLightbox = function(index) {
        if (currentGalleryPhotos.length === 0) return;
        currentLightboxIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // Update lightbox image
    function updateLightboxImage() {
        if (currentGalleryPhotos.length === 0) return;
        lightboxImg.src = currentGalleryPhotos[currentLightboxIndex];
    }
    
    // Navigation
    function showNext() {
        currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryPhotos.length;
        updateLightboxImage();
    }
    
    function showPrev() {
        currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryPhotos.length) % currentGalleryPhotos.length;
        updateLightboxImage();
    }
    
    // Event listeners
    closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
    
    prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });
    
    nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });
}

// Show success message
function showSuccessMessage(message) {
    const successMsg = document.getElementById('success-message');
    if (!successMsg) return;
    
    successMsg.textContent = message;
    successMsg.classList.add('show');
    
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 3000);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initData);
} else {
    initData();
}

