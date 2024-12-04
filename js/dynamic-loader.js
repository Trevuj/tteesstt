class DynamicContentLoader {
    constructor() {
        this.contentCache = new Map();
        this.currentPage = null;
        this.init();
    }

    init() {
        this.handleNavigation();
        this.initializeIntersectionObserver();
    }

    handleNavigation() {
        document.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href').startsWith('/')) {
                e.preventDefault();
                this.loadPage(link.getAttribute('href'));
            }
        });

        window.addEventListener('popstate', e => {
            this.loadPage(window.location.pathname, false);
        });
    }

    async loadPage(url, pushState = true) {
        const contentArea = document.getElementById('main-content');
        const loadingOverlay = this.showLoadingOverlay();

        try {
            const content = await this.fetchContent(url);
            
            if (pushState) {
                history.pushState({}, '', url);
            }

            await this.animatePageTransition(contentArea, content);
            this.updateActiveNavLink(url);
            this.initializePageScripts();
            
        } catch (error) {
            console.error('Failed to load page:', error);
            this.showErrorMessage();
        } finally {
            loadingOverlay.remove();
        }
    }

    async fetchContent(url) {
        if (this.contentCache.has(url)) {
            return this.contentCache.get(url);
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch content');
        
        const content = await response.text();
        this.contentCache.set(url, content);
        return content;
    }

    async animatePageTransition(contentArea, newContent) {
        await this.animateOut(contentArea);
        contentArea.innerHTML = newContent;
        await this.animateIn(contentArea);
    }

    animateOut(element) {
        return new Promise(resolve => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            setTimeout(resolve, 300);
        });
    }

    animateIn(element) {
        return new Promise(resolve => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            setTimeout(resolve, 300);
        });
    }

    showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loader">
                <div class="loader-circle"></div>
                <div class="loader-text">Loading...</div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    initializeIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    observer.unobserve(element);
                }
            });
        }, options);

        document.querySelectorAll('[data-src]').forEach(element => {
            observer.observe(element);
        });
    }

    updateActiveNavLink(url) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === url) {
                link.classList.add('active');
            }
        });
    }

    initializePageScripts() {
        // Reinitialize components for the new page
        new ContactForm();
        initializeAnimations();
        initializeParallaxEffects();
    }

    showErrorMessage() {
        const error = document.createElement('div');
        error.className = 'error-message global';
        error.textContent = 'Failed to load page. Please try again.';
        document.body.appendChild(error);
        setTimeout(() => error.remove(), 5000);
    }
} 