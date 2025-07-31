// Theme Toggle with Physics
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const chain = document.querySelector('.chain');
    const bulb = document.querySelector('.bulb');
    let isDragging = false;
    let startY = 0;
    let initialHeight = 40;
    let pullThreshold = 1;
    let lastPullTime = 0;
    const pullCooldown = 200;

    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        themeToggle.classList.add('pulling');
        
        setTimeout(() => {
            themeToggle.classList.remove('pulling');
        }, pullCooldown);
    }

    // Remove the onclick from HTML and add it here
    themeToggle.removeAttribute('onclick');
    
    // Add mousedown and touchstart listeners to the chain
    chain.addEventListener('mousedown', handleDragStart);
    chain.addEventListener('touchstart', handleDragStart, { passive: false });

    function handleDragStart(e) {
        const now = Date.now();
        if (now - lastPullTime < pullCooldown) return;
        
        isDragging = true;
        chain.classList.add('pulling');
        startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        initialHeight = parseInt(getComputedStyle(chain).height);
        
        if (e.type === 'mousedown') {
            window.addEventListener('mousemove', handleDrag, { passive: false });
            window.addEventListener('mouseup', handleDragEnd);
        } else {
            window.addEventListener('touchmove', handleDrag, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
            window.addEventListener('touchcancel', handleDragEnd);
        }

        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrag(e) {
        if (!isDragging) return;
        
        const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        const pull = currentY - startY;
        const newHeight = Math.max(initialHeight, initialHeight + pull);
        const maxPull = initialHeight + 8;
        
        chain.style.height = `${Math.min(newHeight, maxPull)}px`;
        
        const pullProgress = (newHeight - initialHeight) / (maxPull - initialHeight);
        const rotationAngle = pullProgress * -5;
        bulb.style.transform = `rotate(${rotationAngle}deg)`;
        themeToggle.style.transform = `rotate(${rotationAngle * 0.5}deg)`;
        
        if (pullProgress > 0.1 && !chain.classList.contains('will-toggle')) {
            chain.classList.add('will-toggle');
        } else if (pullProgress <= 0.1 && chain.classList.contains('will-toggle')) {
            chain.classList.remove('will-toggle');
        }
        
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDragEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        const finalHeight = parseInt(getComputedStyle(chain).height);
        const didPullEnough = finalHeight >= initialHeight + pullThreshold;
        
        chain.classList.remove('pulling');
        chain.classList.remove('will-toggle');
        
        if (didPullEnough) {
            lastPullTime = Date.now();
            toggleTheme();
        }
        
        chain.style.height = `${initialHeight}px`;
        bulb.style.transform = '';
        themeToggle.style.transform = '';
        
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDrag);
        window.removeEventListener('touchend', handleDragEnd);
        window.removeEventListener('touchcancel', handleDragEnd);
        
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // Update click handler to be more responsive
    bulb.addEventListener('click', (e) => {
        if (!isDragging) {
            const now = Date.now();
            if (now - lastPullTime < pullCooldown) return;
            
            lastPullTime = now;
            toggleTheme();
            e.stopPropagation(); // Prevent event from bubbling
        }
    });

    // Remove the old click handler and add a new one for the chain
    chain.addEventListener('click', (e) => {
        if (!isDragging) {
            const now = Date.now();
            if (now - lastPullTime < pullCooldown) return;
            
            lastPullTime = now;
            toggleTheme();
            e.stopPropagation(); // Prevent event from bubbling
        }
    });

    // Add initial animation with larger swing
    setTimeout(() => {
        themeToggle.style.animation = 'hangingBulb 4s ease-in-out infinite';
    }, 1000);
}

document.addEventListener('DOMContentLoaded', initThemeToggle);

function updateMainImage(thumbElement, newSrc) {
    const mainImage = document.getElementById('mainHackathonImage');
    const allThumbs = document.querySelectorAll('.gallery-thumb');
    
    // Remove active class from all thumbnails
    allThumbs.forEach(thumb => thumb.classList.remove('active'));
    
    // Add active class to clicked thumbnail
    thumbElement.classList.add('active');
    
    // Fade out current image
    mainImage.style.opacity = '0';
    
    // Switch image and fade in
    setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = '1';
    }, 300);
}

// Add keyboard navigation for images
document.addEventListener('keydown', (e) => {
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'events') {
        const activeThumb = document.querySelector('.gallery-thumb.active');
        if (activeThumb) {
            const allThumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
            const currentIndex = allThumbs.indexOf(activeThumb);
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                const prevThumb = allThumbs[currentIndex - 1];
                updateMainImage(prevThumb, prevThumb.src);
            } else if (e.key === 'ArrowRight' && currentIndex < allThumbs.length - 1) {
                const nextThumb = allThumbs[currentIndex + 1];
                updateMainImage(nextThumb, nextThumb.src);
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const firstLine = document.querySelector('.first-line');
    const secondLine = document.querySelector('.second-line');
    const cursor1 = document.querySelector('#cursor1');
    const cursor2 = document.querySelector('#cursor2');
    
    function positionCursor(typewriter, cursor, duration, delay = 0) {
        const startTime = performance.now();
        
        function updatePosition() {
            const elapsed = performance.now() - startTime - (delay * 1000);
            if (elapsed < 0) {
                cursor.style.left = '0px';
                requestAnimationFrame(updatePosition);
                return;
            }
            
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const textWidth = typewriter.offsetWidth;
            const cursorPosition = Math.min(textWidth * progress, textWidth);
            
            cursor.style.left = `${cursorPosition}px`;
            
            if (progress < 1) {
                requestAnimationFrame(updatePosition);
            }
        }
        
        requestAnimationFrame(updatePosition);
    }

    positionCursor(firstLine, cursor1, 2, 0);
    positionCursor(secondLine, cursor2, 3, 2);

    // Add tab switching functionality
    const aboutTabs = document.querySelectorAll('.about-tab');
    const aboutContents = document.querySelectorAll('.about-content');

    aboutTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            aboutTabs.forEach(t => t.classList.remove('active'));
            // Hide all content sections
            aboutContents.forEach(content => {
                content.style.display = 'none';
            });

            // Add active class to clicked tab
            tab.classList.add('active');
            // Show corresponding content
            const contentId = `${tab.dataset.tab}-content`;
            const content = document.getElementById(contentId);
            if (content) {
                content.style.display = 'block';
            }
        });
    });

    // Initialize the first tab as active
    const firstTab = aboutTabs[0];
    if (firstTab) {
        firstTab.click();
    }
});

document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetPage = e.target.getAttribute('data-page');
        if (targetPage) {
            e.preventDefault();
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            const targetPageElement = document.getElementById(targetPage);
            targetPageElement.classList.add('active');
            document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
});

document.querySelectorAll('.about-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetContent = tab.getAttribute('data-tab') + '-content';
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetContent).classList.add('active');
        document.querySelectorAll('.about-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Initialize the first tab as active
document.querySelector('.about-tab.active').click();

let viewCount = 1;
setInterval(() => {
    viewCount++;
    document.getElementById('viewCount').textContent = viewCount;
}, 5000);

let uptimeSeconds = 0;
setInterval(() => {
    uptimeSeconds++;
    const minutes = Math.floor(uptimeSeconds / 60);
    const seconds = uptimeSeconds % 60;
    document.getElementById('uptime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}, 1000);

function updateEyePosition(clientX, clientY) {
    const eyes = document.querySelectorAll('.eye');
    eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(clientY - eyeCenterY, clientX - eyeCenterX);
        const maxDistance = 4;
        const distance = Math.min(maxDistance, Math.sqrt(Math.pow(clientX - eyeCenterX, 2) + Math.pow(clientY - eyeCenterY, 2)) / 20);
        
        const pupil = eye.querySelector('.pupil');
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
}

document.addEventListener('mousemove', (e) => {
    updateEyePosition(e.clientX, e.clientY);
});

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    updateEyePosition(touch.clientX, touch.clientY);
});

document.addEventListener('mouseleave', () => {
    const pupils = document.querySelectorAll('.pupil');
    pupils.forEach(pupil => {
        pupil.style.transform = 'translate(-50%, -50%)';
    });
});

document.addEventListener('touchend', () => {
    const pupils = document.querySelectorAll('.pupil');
    pupils.forEach(pupil => {
        pupil.style.transform = 'translate(-50%, -50%)';
    });
});