// Load existing student data if available
window.addEventListener('DOMContentLoaded', function() {
    const existingData = JSON.parse(localStorage.getItem('studentOfMonth') || '{}');
    if (existingData.name) {
        document.getElementById('new-student-name').value = existingData.name;
        document.getElementById('new-student-class').value = existingData.class;
    }
    
    // Load and display gallery photos
    const galleryPhotos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
    displayGallery(galleryPhotos);
});

// Display gallery photos with delete buttons
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
        
        // Add delete button
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
        photos.splice(index, 1);
        localStorage.setItem('galleryPhotos', JSON.stringify(photos));
        displayGallery(photos);
        alert('Photo deleted successfully!');
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
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Uploading...';
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
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }).catch(function(error) {
            alert('Error processing photo: ' + error.message);
            submitBtn.textContent = originalText;
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
    
    alert('Student of the Month updated successfully!');
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
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Uploading...';
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
            
            alert('Photo added to gallery successfully!');
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
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

