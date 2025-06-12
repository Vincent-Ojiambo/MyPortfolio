document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formMessages = document.getElementById('form-messages');

    // Form validation
    function validateForm(formData) {
        let isValid = true;
        const errors = {};
        
        // Reset error messages
        document.querySelectorAll('.form-group p.text-red-600').forEach(el => {
            el.textContent = '';
            el.classList.add('hidden');
        });
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.classList.remove('border-red-500');
            el.classList.add('border-gray-300');
        });

        // Name validation
        if (!formData.get('name').trim()) {
            showError('name', 'Name is required');
            isValid = false;
        } else if (formData.get('name').trim().length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.get('email').trim()) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(formData.get('email'))) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Subject validation
        if (!formData.get('subject').trim()) {
            showError('subject', 'Subject is required');
            isValid = false;
        } else if (formData.get('subject').trim().length < 5) {
            showError('subject', 'Subject must be at least 5 characters');
            isValid = false;
        }

        // Message validation
        if (!formData.get('message').trim()) {
            showError('message', 'Message is required');
            isValid = false;
        } else if (formData.get('message').trim().length < 10) {
            showError('message', 'Message must be at least 10 characters');
            isValid = false;
        }

        return isValid;
    }

    function showError(field, message) {
        const errorElement = document.getElementById(`${field}-error`);
        const inputElement = document.getElementById(field);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        
        if (inputElement) {
            inputElement.classList.remove('border-gray-300');
            inputElement.classList.add('border-red-500');
        }
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            try {
                // Show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                `;
                
                // Submit form to Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    showFormMessage('Message sent successfully! I\'ll get back to you soon!', 'success');
                    // Reset form
                    contactForm.reset();
                    // Redirect to thank you page if _next is set
                    const nextUrl = contactForm.querySelector('input[name="_next"]')?.value;
                    if (nextUrl) {
                        setTimeout(() => {
                            window.location.href = nextUrl;
                        }, 2000);
                    }
                } else {
                    const error = await response.json().catch(() => ({}));
                    throw new Error(error.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('Something went wrong. Please try again later or contact me directly at your@email.com', 'error');
            } finally {
                // Reset button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                
                // Hide message after 5 seconds if not redirecting
                if (!contactForm.querySelector('input[name="_next"]')?.value) {
                    setTimeout(() => {
                        formMessages.classList.add('hidden');
                    }, 5000);
                }
            }
        });
    }
    
    function showFormMessage(message, type = 'success') {
        if (!formMessages) return;
        
        formMessages.textContent = message;
        formMessages.className = 'p-4 mb-6 rounded-lg';
        
        if (type === 'success') {
            formMessages.classList.add('bg-green-100', 'text-green-700');
            formMessages.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    ${message}
                </div>
            `;
        } else if (type === 'error') {
            formMessages.classList.add('bg-red-100', 'text-red-700');
            formMessages.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    ${message}
                </div>
            `;
        }
        
        formMessages.classList.remove('hidden');
    }
    
    // Add input event listeners for real-time validation
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            const field = this.id;
            const errorElement = document.getElementById(`${field}-error`);
            
            if (this.value.trim() === '') {
                this.classList.remove('border-green-500', 'border-red-500');
                this.classList.add('border-gray-300');
                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.classList.add('hidden');
                }
                return;
            }
            
            // Basic validation on input
            if (field === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value.trim())) {
                    showError(field, 'Please enter a valid email address');
                } else {
                    clearError(field);
                }
            } else if (field === 'name' && this.value.trim().length < 2) {
                showError(field, 'Name must be at least 2 characters');
            } else if (field === 'subject' && this.value.trim().length < 5) {
                showError(field, 'Subject must be at least 5 characters');
            } else if (field === 'message' && this.value.trim().length < 10) {
                showError(field, 'Message must be at least 10 characters');
            } else {
                clearError(field);
            }
        });
        
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('ring-2', 'ring-indigo-200');
            this.parentElement.classList.remove('ring-0');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('ring-2', 'ring-indigo-200');
        });
    });
    
    function clearError(field) {
        const errorElement = document.getElementById(`${field}-error`);
        const inputElement = document.getElementById(field);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
        
        if (inputElement) {
            inputElement.classList.remove('border-red-500');
            inputElement.classList.add('border-green-500');
            
            // Remove green border after 1.5 seconds
            setTimeout(() => {
                inputElement.classList.remove('border-green-500');
                inputElement.classList.add('border-gray-300');
            }, 1500);
        }
    }
});
