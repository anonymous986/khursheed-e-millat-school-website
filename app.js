// Initialize data from localStorage
function initData() {
    // Load student of the month
    const studentData = JSON.parse(localStorage.getItem('studentOfMonth') || '{}');
    if (studentData.name) {
        updateStudentDisplay(studentData);
    }
    
    // Load gallery photos
    const galleryPhotos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
    displayGallery(galleryPhotos);
}

// Update student of the month display
function updateStudentDisplay(data) {
    const nameSpan = document.querySelector('#student-name span');
    const classSpan = document.querySelector('#student-class span');
    const photoImg = document.getElementById('student-photo');
    
    if (nameSpan) nameSpan.textContent = data.name || '';
    if (classSpan) classSpan.textContent = data.class || '';
    
    if (data.photo) {
        photoImg.src = data.photo;
        photoImg.style.display = 'block';
    } else {
        photoImg.style.display = 'none';
    }
}

// Display gallery photos (main page - no delete buttons)
function displayGallery(photos) {
    const gallery = document.getElementById('photo-gallery');
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    if (photos.length === 0) {
        gallery.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666;">No photos in gallery yet.</p>';
        return;
    }
    
    photos.forEach((photoUrl, index) => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = photoUrl;
        img.alt = `Gallery Photo ${index + 1}`;
        img.onerror = function() {
            imgDiv.remove();
        };
        
        imgDiv.appendChild(img);
        gallery.appendChild(imgDiv);
    });
}

// Initialize on page load
initData();

