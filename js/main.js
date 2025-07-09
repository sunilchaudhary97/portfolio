/**
 * Main JavaScript for Sunil Chaudhary's Portfolio
 * Includes animations, cursor effects, mobile menu and more
 */

// Wait for document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initAnimations();
    initSmoothScrolling();
    initCursorParticles();
    initMobileMenu();
    initHeaderScroll();
    initBackToTop();
    initTestimonialSlider();
    initPortfolioFilter();
    initPopupImages();
    
    // Add the new hero image animation
    initHeroImageAnimation();
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(preloader);

    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(preloader);
        }, 500);
    }, 800);
});

/**
 * Initialize animations for elements
 */
function initAnimations() {
    // Find all elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-slide-in-right, .animate-fade-in.delay-1, .animate-fade-in.delay-2, .animate-fade-in.delay-3');
    
    // Create intersection observer to trigger animations when elements are in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add 'active' class when element is in viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Stop observing after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe all elements with animation classes
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add animation classes to elements that should animate on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionElements = section.querySelectorAll('h2, .section-subtitle, .section-description, .services-grid, .work-grid, .blog-grid');
        
        sectionElements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.style.transitionDelay = `${index * 0.1}s`;
        });
    });
    
    // Create observer for section animations
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animateElements = entry.target.querySelectorAll('.animate-on-scroll');
                animateElements.forEach(el => {
                    el.classList.add('visible');
                });
            }
        });
    }, { threshold: 0.1 });
    
    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    // Get all links that start with # but not #only
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const nav = document.querySelector('.nav-menu');
                if (nav.classList.contains('show')) {
                    nav.classList.remove('show');
                    document.querySelector('.mobile-menu-toggle').classList.remove('active');
                }
                
                // Smooth scroll to element
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Create particles that follow cursor
 */
function initCursorParticles() {
    const particles = [];
    const particleCount = 15;
    const colors = ['#00c896', '#3d5afe', '#ff4081'];
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particleContainer.appendChild(particle);
        
        particles.push({
            element: particle,
            x: 0,
            y: 0,
            size: Math.floor(Math.random() * 5) + 3,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2
        });
    }
    
    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let moveTimeout;
    
    // Update mouse position on move
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        // Reset moving flag after timeout
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);
    });
    
    // Animation loop
    function animateParticles() {
        if (isMoving) {
            particles.forEach(particle => {
                // Calculate distance from mouse
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                
                // Move towards mouse with easing
                particle.x += dx * 0.1;
                particle.y += dy * 0.1;
                
                // Add random movement
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Update position
                particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
                particle.element.style.width = `${particle.size}px`;
                particle.element.style.height = `${particle.size}px`;
            });
        }
        requestAnimationFrame(animateParticles);
    }
    
    // Start animation
    animateParticles();
    
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Hide particles on touch devices
    if (isTouchDevice) {
        particleContainer.style.display = 'none';
    }
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Toggle mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuToggle.classList.toggle('active');
            
            // Toggle menu icon
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Handle dropdown menus on mobile
    dropdowns.forEach(dropdown => {
        // Create dropdown toggle for mobile
        const link = dropdown.querySelector('a');
        const dropdownToggle = document.createElement('span');
        dropdownToggle.className = 'dropdown-toggle';
        dropdownToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        
        if (window.innerWidth < 992) {
            link.appendChild(dropdownToggle);
        }
        
        // Toggle dropdown menu on click (mobile only)
        link.addEventListener('click', function(e) {
            if (window.innerWidth < 992) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Rotate chevron icon
                const icon = dropdownToggle.querySelector('i');
                if (dropdown.classList.contains('active')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0)';
                }
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-toggle') && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            menuToggle.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Update menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            navMenu.classList.remove('show');
            const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
            dropdownToggles.forEach(toggle => toggle.parentNode.removeChild(toggle));
        } else {
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('a');
                if (!link.querySelector('.dropdown-toggle')) {
                    const dropdownToggle = document.createElement('span');
                    dropdownToggle.className = 'dropdown-toggle';
                    dropdownToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
                    link.appendChild(dropdownToggle);
                }
            });
        }
    });
}

/**
 * Initialize header scroll behavior
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    
    let currentIndex = 0;
    
    // Hide all testimonials except the first one
    testimonials.forEach((item, index) => {
        if (index !== 0) {
            item.style.display = 'none';
        }
    });
    
    // Function to show testimonial by index
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(item => {
            item.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show selected testimonial
        testimonials[index].style.display = 'block';
        dots[index].classList.add('active');
        
        // Animate content
        testimonials[index].querySelector('.testimonial-content').classList.add('animate-fade-in');
        testimonials[index].querySelector('.testimonial-author').classList.add('animate-slide-up');
        
        // Update current index
        currentIndex = index;
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Previous button click
    prevBtn.addEventListener('click', () => {
        let index = currentIndex - 1;
        if (index < 0) index = testimonials.length - 1;
        showTestimonial(index);
    });
    
    // Next button click
    nextBtn.addEventListener('click', () => {
        let index = currentIndex + 1;
        if (index >= testimonials.length) index = 0;
        showTestimonial(index);
    });
    
    // Auto slide every 5 seconds
    setInterval(() => {
        let index = currentIndex + 1;
        if (index >= testimonials.length) index = 0;
        showTestimonial(index);
    }, 5000);
}

/**
 * Initialize portfolio filter
 */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filter = btn.getAttribute('data-filter');
            
            // Filter work items
            workItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    if (item.getAttribute('data-category').includes(filter)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

/**
 * Initialize lightbox for portfolio images
 */
function initPopupImages() {
    const zoomButtons = document.querySelectorAll('.work-zoom');
    
    if (zoomButtons.length > 0) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close"><i class="fas fa-times"></i></button>
                <img src="" alt="Project Image" class="lightbox-image">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        
        // Open lightbox on click
        zoomButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const imgSrc = button.getAttribute('href');
                const caption = button.closest('.work-item').querySelector('h3').textContent;
                
                lightboxImage.src = imgSrc;
                lightboxCaption.textContent = caption;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close lightbox
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close on click outside
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Form validation
 */
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        const requiredFields = form.querySelectorAll('[required]');
        let valid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                valid = false;
                field.classList.add('error');
                
                // Add error message if it doesn't exist
                let errorMsg = field.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This field is required';
                    field.parentNode.insertBefore(errorMsg, field.nextSibling);
                }
            } else {
                field.classList.remove('error');
                
                // Remove error message if it exists
                const errorMsg = field.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
        
        if (!valid) {
            e.preventDefault();
        }
    });
});

/**
 * Add CSS for dynamic elements
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Preloader */
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--darker-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid transparent;
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Cursor Particles */
        .particle-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        }
        
        .cursor-particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
        }
        
        /* Animation Classes */
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .animate-on-scroll.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Mobile Menu Toggle */
        .mobile-menu-toggle.active i {
            transform: rotate(90deg);
        }
        
        /* Dropdown Toggle */
        .dropdown-toggle {
            margin-left: 5px;
            transition: transform 0.3s ease;
        }
        
        /* Lightbox */
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            border: 3px solid white;
            border-radius: var(--border-radius-lg);
        }
        
        .lightbox-caption {
            position: absolute;
            bottom: -40px;
            left: 0;
            width: 100%;
            padding: 10px;
            color: white;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: var(--border-radius-md);
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            width: 30px;
            height: 30px;
            background-color: white;
            color: black;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .lightbox-close:hover {
            transform: rotate(90deg);
        }
        
        /* Form Error Styles */
        .error {
            border-color: var(--danger-color) !important;
            box-shadow: 0 0 0 1px var(--danger-color);
        }
        
        .error-message {
            color: var(--danger-color);
            font-size: 0.8rem;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);
}

// Add dynamic styles
addDynamicStyles();

/**
 * Initialize Hero Image Animation
 */
function initHeroImageAnimation() {
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        // Add animation classes when the image is loaded
        heroImage.onload = function() {
            heroImage.classList.add('animate-zoom-in');
            
            // Add floating animation after initial reveal
            setTimeout(() => {
                heroImage.classList.add('animate-float');
            }, 1500);
        };
        
        // Fallback in case the image is already loaded
        if (heroImage.complete) {
            heroImage.classList.add('animate-zoom-in');
            setTimeout(() => {
                heroImage.classList.add('animate-float');
            }, 1500);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Get all expand buttons
    const expandButtons = document.querySelectorAll('.blog-expand-btn');
    const collapseButtons = document.querySelectorAll('.blog-collapse-btn');
    
    // Add click event to expand buttons
    expandButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent event bubbling
            e.stopPropagation();
            
            // Get parent blog content
            const blogContent = this.closest('.blog-content') || this.closest('.featured-content');
            
            // Get the full content and show it
            const fullContent = blogContent.querySelector('.blog-full-content');
            fullContent.style.display = 'block';
            
            // Hide expand button, show collapse button
            this.style.display = 'none';
            blogContent.querySelector('.blog-collapse-btn').style.display = 'inline-block';
            
            // If it's in a card, expand the card
            const blogCard = this.closest('.blog-card');
            if (blogCard) {
                blogCard.classList.add('expanded');
            }
            
            // For featured post
            const featuredPost = this.closest('.featured-post');
            if (featuredPost) {
                featuredPost.classList.add('expanded');
            }
            
            // Scroll to position the expanded card at a comfortable reading position
            const offset = 80; // Adjust as needed for your header height
            const cardTop = (blogCard || featuredPost).getBoundingClientRect().top;
            const scrollPosition = cardTop + window.pageYOffset - offset;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Add click event to collapse buttons
    collapseButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent event bubbling
            e.stopPropagation();
            
            // Get parent blog content
            const blogContent = this.closest('.blog-content') || this.closest('.featured-content');
            
            // Hide the full content
            const fullContent = blogContent.querySelector('.blog-full-content');
            fullContent.style.display = 'none';
            
            // Show expand button, hide collapse button
            this.style.display = 'none';
            blogContent.querySelector('.blog-expand-btn').style.display = 'inline-block';
            
            // If it's in a card, collapse the card
            const blogCard = this.closest('.blog-card');
            if (blogCard) {
                blogCard.classList.remove('expanded');
            }
            
            // For featured post
            const featuredPost = this.closest('.featured-post');
            if (featuredPost) {
                featuredPost.classList.remove('expanded');
            }
        });
    });
});

 