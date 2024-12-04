import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

class ModelViewer {
    constructor(container, modelPath) {
        this.container = container;
        this.modelPath = modelPath;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.init();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Setup lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x00ffbb, 1);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
        
        // Load model
        const loader = new THREE.GLTFLoader();
        loader.load(this.modelPath, (gltf) => {
            this.model = gltf.scene;
            this.scene.add(this.model);
            
            // Center the model
            const box = new THREE.Box3().setFromObject(this.model);
            const center = box.getCenter(new THREE.Vector3());
            this.model.position.sub(center);
            
            // Start animation
            this.animate();
        });
        
        // Position camera
        this.camera.position.z = 5;
        
        // Add controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        if (this.model) {
            this.model.rotation.y += 0.005;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

// Initialize model viewers
document.querySelectorAll('.model-viewer-container').forEach(container => {
    const modelPath = container.dataset.model;
    new ModelViewer(container, modelPath);
}); 