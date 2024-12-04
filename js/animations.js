// Mouse trail effect
class MouseTrail {
    constructor() {
        this.trails = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        for(let i = 0; i < 20; i++) {
            const trail = document.createElement('div');
            trail.className = 'mouse-trail';
            document.body.appendChild(trail);
            this.trails.push({
                element: trail,
                x: 0,
                y: 0,
                delay: i * 2
            });
        }
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.animate();
    }
    
    animate() {
        this.trails.forEach((trail, index) => {
            const nextTrail = this.trails[index + 1] || this.trails[0];
            trail.x = nextTrail.x + (this.mouseX - trail.x) * 0.1;
            trail.y = nextTrail.y + (this.mouseY - trail.y) * 0.1;
            
            trail.element.style.left = `${trail.x}px`;
            trail.element.style.top = `${trail.y}px`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize mouse trail
new MouseTrail();

// 3D Tilt Effect for Cards
const cards = document.querySelectorAll('.service-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}); 