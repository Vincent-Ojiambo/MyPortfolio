// DOM Elements
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const navbar = document.querySelector('#navbar');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const backToTopButton = document.querySelector('#back-to-top');
const projectCards = document.querySelectorAll('.project-card');
const skillCards = document.querySelectorAll('.skill-card');

// Smooth scroll to section with offset for fixed header
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerOffset = 80; // Height of your header
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Handle navigation link clicks
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if (target === '#') return;
        
        smoothScrollTo(target);
        
        // Close mobile menu if open
        if (mobileMenu.classList.contains('hidden') === false) {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
});

// Active section highlighting
function updateActiveSection() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Update desktop nav
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('text-indigo-600', 'dark:text-indigo-400');
                link.classList.add('text-gray-700', 'dark:text-gray-300');
                link.querySelector('span:last-child').style.width = '0';
            });
            
            const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.remove('text-gray-700', 'dark:text-gray-300');
                activeLink.classList.add('text-indigo-600', 'dark:text-indigo-400');
                activeLink.querySelector('span:last-child').style.width = '100%';
            }
            
            // Update mobile nav
            document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.classList.remove('text-indigo-600', 'dark:text-indigo-400');
                link.classList.add('text-gray-700', 'dark:text-gray-300');
                const dot = link.querySelector('span:last-child');
                if (dot) dot.style.opacity = '0';
            });
            
            const activeMobileLink = document.querySelector(`.mobile-nav-link[data-section="${sectionId}"]`);
            if (activeMobileLink) {
                activeMobileLink.classList.remove('text-gray-700', 'dark:text-gray-300');
                activeMobileLink.classList.add('text-indigo-600', 'dark:text-indigo-400');
                const dot = activeMobileLink.querySelector('span:last-child');
                if (dot) dot.style.opacity = '1';
            }
        }
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
        // Initialize components
    initTheme();
    
    // Initialize back to top button visibility
    toggleBackToTop();
    
    // Add event listeners
    if (backToTopButton) backToTopButton.addEventListener('click', scrollToTop);
    
    // Add card hover effects
    addCardHoverEffect();
    
    // Initialize mobile menu
    if (mobileMenuButton) mobileMenuButton.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Initialize animations
    animateSkills();
    initAnimations();
    
    // Initial check for elements in viewport and active section
    checkScroll();
    updateActiveSection();
    
    // Add scroll event listener for active section
    window.addEventListener('scroll', () => {
        toggleBackToTop();
        updateActiveSection();
    });
});

// Initialize theme (kept for compatibility, but does nothing)
function initTheme() {
    // Ensure light theme is always active
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
}



// Show/hide back to top button based on scroll position
function toggleBackToTop() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
    } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
    }
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add hover effect to cards
function addCardHoverEffect() {
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        });
    });

    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.03)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    document.body.style.overflow = mobileMenu.classList.contains('hidden') ? 'auto' : 'hidden';
    
    // Toggle menu icon between bars and times
    const menuIcon = mobileMenuButton.querySelector('i');
    if (menuIcon) {
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        } else {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        }
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    const icon = mobileMenuButton.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

// Initialize header components
function initHeader() {
    // Mobile menu button
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = 'auto';
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Theme toggles
    const themeToggles = [themeToggle, mobileThemeToggle, mobileThemeToggleMenu];
    themeToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', toggleTheme);
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Back to top button
    window.addEventListener('scroll', toggleBackToTop);
    if (backToTopButton) {
        backToTopButton.addEventListener('click', scrollToTop);
    }
}

// Initialize header components when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
} else {
    initHeader();
}

// Add hover effects to cards
addCardHoverEffect();

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // Smooth scroll to section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class based on scroll position
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
    
    // Update active section in navigation
    updateActiveSection();
});

// Update active section in navigation
function updateActiveSection() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Initialize active section on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize back to top button visibility
    toggleBackToTop();
    
    updateActiveSection();
    
    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(element => {
        element.style.opacity = '0';
    });
    
    // Initial check for elements in viewport
    checkScroll();
});

// Check if elements are in viewport for animations
function checkScroll() {
    const windowHeight = window.innerHeight;
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Throttle scroll events for better performance
let isScrolling;
window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        checkScroll();
    }, 50);
});

// Form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            
            // Simulate form submission (replace with actual fetch/axios call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'mt-4 p-4 bg-green-100 text-green-700 rounded-lg';
            successMessage.innerHTML = 'Thank you for your message! I will get back to you soon.';
            this.appendChild(successMessage);
            
            // Reset form
            this.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
            
        } catch (error) {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'mt-4 p-4 bg-red-100 text-red-700 rounded-lg';
            errorMessage.textContent = 'Something went wrong. Please try again later.';
            this.appendChild(errorMessage);
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
            
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip if it's a link to the contact form
    if (anchor.getAttribute('href') === '#contact-form') return;
    
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// The contact form submission handler is defined earlier in the file

// Animate elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Animate skills when they come into view
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate skill items
                entry.target.classList.add('visible');
                
                // Animate progress bars
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const width = progressBar.getAttribute('data-width');
                    progressBar.style.width = `${width}%`;
                }
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe each skill item
    skillItems.forEach((item, index) => {
        // Add staggered delay for each item
        item.style.transitionDelay = `${index * 100}ms`;
        observer.observe(item);
    });
}

// Initialize animations for elements with the animate-on-scroll class
function initAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .skill-card');
    
    animatedElements.forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    });
    
    // Initial check for elements in viewport
    animateOnScroll();
    
    // Check for elements in viewport on scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Animate skills when they come into view
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate skill items
                entry.target.classList.add('visible');
                
                // Animate progress bars
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const width = progressBar.getAttribute('data-width');
                    progressBar.style.width = `${width}%`;
                }
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe each skill item
    skillItems.forEach((item, index) => {
        // Add staggered delay for each item
        item.style.transitionDelay = `${index * 100}ms`;
        observer.observe(item);
    });
}

// Initialize animations for elements with the animate-on-scroll class
function initAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .skill-card');
    
    animatedElements.forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    });
    
    // Initial check for elements in viewport
    animateOnScroll();
    
    // Check for elements in viewport on scroll
    window.addEventListener('scroll', animateOnScroll);
}
