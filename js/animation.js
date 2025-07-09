/**
 * portfolio-animations.js - Fixed smooth animations that won't hide content
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initAnimations();
    initStatCounters();
    initProjectImageEffects();
    initSmoothScrolling();
    initLightbox();
});

/**
 * Initialize scroll-based animations using Intersection Observer
 */
function initAnimations() {
    // Elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When element is visible
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation to child elements if container
                if (entry.target.classList.contains('tech-highlight-grid') || 
                    entry.target.classList.contains('project-image-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                }
                
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Project-specific sections that might not have the class
    const projectSections = document.querySelectorAll(
        '.project-section, .project-info-item, .project-thumb, ' +
        '.main-project-image, .tech-highlight-item, .result-item'
    );
    
    projectSections.forEach(element => {
        if (!element.classList.contains('animate-on-scroll')) {
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        }
    });
}

/**
 * Initialize stat counters
 */
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const options = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Store original target if not already
                if (!el.hasAttribute('data-original')) {
                    el.setAttribute('data-original', el.textContent);
                }
                
                const originalValue = parseInt(el.getAttribute('data-original').replace(/\D/g, '')) || 0;
                
                // Start animation
                animateCounter(el, 0, originalValue);
                
                // Unobserve after starting animation
                observer.unobserve(el);
            }
        });
    }, options);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Animate counter from start to end value
 */
function animateCounter(element, start, end) {
    // Safety check to ensure we're working with numbers
    start = isNaN(start) ? 0 : start;
    end = isNaN(end) ? 0 : end;
    
    const duration = 1500; // 1.5 seconds
    const stepTime = 20; // Update every 20ms
    const totalSteps = duration / stepTime;
    let currentStep = 0;
    
    // Handle zero or invalid cases
    if (end <= 0) {
        element.textContent = '0';
        return;
    }
    
    const interval = setInterval(() => {
        currentStep++;
        
        const progress = currentStep / totalSteps;
        // Use easing function for smoother animation
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        
        const currentValue = Math.floor(start + (end - start) * easedProgress);
        element.textContent = currentValue;
        
        if (currentStep >= totalSteps) {
            clearInterval(interval);
            element.textContent = end; // Ensure we end on exact value
        }
    }, stepTime);
}

/**
 * Initialize project image hover effects
 */
function initProjectImageEffects() {
    const projectImages = document.querySelectorAll('.project-thumb, .main-project-image');
    
    projectImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = 'var(--shadow-lg)';
            
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.05)';
            }
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = '';
            }
        });
    });
}

/**
 * Initialize smooth scrolling
 */
function initSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize lightbox for project images
 */
function initLightbox() {
    const projectImages = document.querySelectorAll('.project-thumb img, .main-project-image img');
    
    // Create lightbox elements if they don't exist
    if (!document.querySelector('.portfolio-lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'portfolio-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-container">
                <button class="close-lightbox"><i class="fas fa-times"></i></button>
                <img src="" alt="Project Image" class="lightbox-image">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Add lightbox styles
        const style = document.createElement('style');
        style.textContent = `
            .portfolio-lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            
            .portfolio-lightbox.active {
                opacity: 1;
                visibility: visible;
            }
            
            .lightbox-container {
                position: relative;
                max-width: 90%;
                max-height: 90vh;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .portfolio-lightbox.active .lightbox-container {
                transform: scale(1);
            }
            
            .lightbox-image {
                display: block;
                max-width: 100%;
                max-height: 85vh;
                border-radius: 4px;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
            }
            
            .close-lightbox {
                position: absolute;
                top: -40px;
                right: 0;
                width: 30px;
                height: 30px;
                background-color: white;
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: transform 0.3s ease;
                z-index: 1;
            }
            
            .close-lightbox:hover {
                transform: rotate(90deg);
            }
            
            .lightbox-caption {
                color: white;
                text-align: center;
                padding: 10px 0;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
        
        // Open lightbox when clicking on project images
        projectImages.forEach(image => {
            image.addEventListener('click', function() {
                const lightbox = document.querySelector('.portfolio-lightbox');
                const lightboxImage = lightbox.querySelector('.lightbox-image');
                const lightboxCaption = lightbox.querySelector('.lightbox-caption');
                
                // Get image source and caption
                let imgSrc = this.src;
                let caption = '';
                
                // Try to get parent project title
                const projectTitle = this.closest('.project-case-study')?.querySelector('h2')?.textContent;
                caption = projectTitle || 'Project Image';
                
                // Set image and caption
                lightboxImage.src = imgSrc;
                lightboxCaption.textContent = caption;
                
                // Show lightbox
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close lightbox when clicking close button or outside
        const closeLightbox = document.querySelector('.close-lightbox');
        const lightboxEl = document.querySelector('.portfolio-lightbox');
        
        closeLightbox.addEventListener('click', function() {
            lightboxEl.classList.remove('active');
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 300);
        });
        
        lightboxEl.addEventListener('click', function(e) {
            if (e.target === lightboxEl) {
                lightboxEl.classList.remove('active');
                setTimeout(() => {
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    }
}

// Add default animation CSS
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    /* Base animation styles that won't hide content permanently */
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Different animations for different elements */
    .stat-number {
        transition: color 0.3s ease;
    }
    
    .project-thumb, .main-project-image {
        transition: transform 0.5s ease, box-shadow 0.5s ease;
    }
    
    .project-thumb img, .main-project-image img {
        transition: transform 0.5s ease;
    }
    
    .tech-highlight-item, .project-info-item {
        transition: transform 0.5s ease, border-color 0.5s ease;
    }
    
    /* Fix for any elements that might have been hidden */
    .project-case-study, 
    .project-section, 
    .tech-highlight-item, 
    .project-info-item, 
    .portfolio-stat-box, 
    .stat-number,
    .result-item {
        display: block !important;
        opacity: 1;
    }
`;
document.head.appendChild(animationStyle);