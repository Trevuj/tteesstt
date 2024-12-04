class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.inputs = this.form.querySelectorAll('input, textarea');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.inputs.forEach(input => {
            input.addEventListener('input', this.validateInput.bind(this));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) return;
        
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<span class="loader"></span> Sending...';

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showSuccess();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Send Message';
        }
    }

    validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        
        if (!value) {
            this.showInputError(input, 'This field is required');
            return false;
        }

        if (input.type === 'email' && !this.isValidEmail(value)) {
            this.showInputError(input, 'Please enter a valid email');
            return false;
        }

        this.clearInputError(input);
        return true;
    }

    validateForm() {
        let isValid = true;
        this.inputs.forEach(input => {
            if (!this.validateInput({ target: input })) {
                isValid = false;
            }
        });
        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showInputError(input, message) {
        const formGroup = input.parentElement;
        const error = formGroup.querySelector('.error-message') || 
                     document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(error);
        }
        
        input.classList.add('error');
    }

    clearInputError(input) {
        const formGroup = input.parentElement;
        const error = formGroup.querySelector('.error-message');
        if (error) {
            formGroup.removeChild(error);
        }
        input.classList.remove('error');
    }

    showSuccess() {
        const success = document.createElement('div');
        success.className = 'success-message';
        success.textContent = 'Message sent successfully!';
        this.form.reset();
        this.form.appendChild(success);
        setTimeout(() => success.remove(), 5000);
    }

    showError(message) {
        const error = document.createElement('div');
        error.className = 'error-message global';
        error.textContent = message;
        this.form.appendChild(error);
        setTimeout(() => error.remove(), 5000);
    }
} 