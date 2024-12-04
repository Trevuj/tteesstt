// Simple form handler without backend
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Show success message
        this.showSuccessMessage();
        
        // Clear form
        this.form.reset();
        
        // You could save to localStorage if needed
        this.saveToLocalStorage(data);
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Thank you for your message! I will get back to you soon.';
        
        this.form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    saveToLocalStorage(data) {
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }
}

// Initialize form handler
new FormHandler(); 