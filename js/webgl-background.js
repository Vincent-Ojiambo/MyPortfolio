class WebGLBackground {
    constructor(containerId = 'webgl-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Element with ID '${containerId}' not found`);
            return;
        }

        // Initialize Three.js components
        this.initThree();
        
        // Setup scene
        this.setupScene();
        
        // Add lights
        this.addLights();
        
        // Create geometry
        this.createGeometry();
        
        // Handle window resize
        this.setupResizeHandler();
        
        // Start animation loop
        this.animate();
    }
    
    initThree() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 30;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupScene() {
        // Add fog for depth
        this.scene.fog = new THREE.FogExp2(0x000000, 0.002);
        
        // Create groups for different types of objects
        this.particles = new THREE.Group();
        this.shapes = new THREE.Group();
        this.techIcons = new THREE.Group();
        
        // Add groups to scene
        this.scene.add(this.particles);
        this.scene.add(this.shapes);
        this.scene.add(this.techIcons);
    }
    
    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Add some point lights for better 3D effect
        const pointLight1 = new THREE.PointLight(0x4A6BFF, 0.5, 100);
        pointLight1.position.set(20, 20, 20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xFF4A6B, 0.5, 100);
        pointLight2.position.set(-20, -20, -20);
        this.scene.add(pointLight2);
    }
    
    createGeometry() {
        // Create particles
        this.createParticles(1500);
        
        // Create 3D shapes
        this.create3DShapes(15);
        
        // Create tech icons
        this.createTechIcons(10);
        
        // Set rotation speeds
        this.rotationSpeed = 0.0003;
        this.shapesRotationSpeed = 0.0001;
        this.iconsRotationSpeed = 0.00005;
    }
    
    createParticles(count) {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const color = new THREE.Color();
        const sizes = [];
        
        for (let i = 0; i < count; i++) {
            const radius = 5 + Math.random() * 45;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            positions.push(x, y, z);
            
            // Vary colors between blue, purple and pink
            const hue = 0.6 + Math.random() * 0.3;
            color.setHSL(hue, 0.7, 0.5 + Math.random() * 0.3);
            colors.push(color.r, color.g, color.b);
            
            // Random sizes for more variety
            sizes.push(0.1 + Math.random() * 0.3);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.particles.add(this.particleSystem);
    }
    
    create3DShapes(count) {
        const shapes = [
            { type: 'box', size: 1 },
            { type: 'sphere', radius: 0.8, widthSegments: 8, heightSegments: 6 },
            { type: 'torus', radius: 0.6, tube: 0.2, radialSegments: 16, tubularSegments: 12 },
            { type: 'cone', radius: 0.6, height: 1.2, radialSegments: 8 },
            { type: 'tetrahedron', radius: 0.8, detail: 0 },
            { type: 'octahedron', radius: 0.8, detail: 0 },
            { type: 'dodecahedron', radius: 0.7, detail: 0 },
            { type: 'icosahedron', radius: 0.8, detail: 0 }
        ];
        
        for (let i = 0; i < count; i++) {
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            let geometry;
            
            switch(shapeType.type) {
                case 'box':
                    geometry = new THREE.BoxGeometry(1, 1, 1);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(shapeType.radius, shapeType.widthSegments, shapeType.heightSegments);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(shapeType.radius, shapeType.tube, shapeType.radialSegments, shapeType.tubularSegments);
                    break;
                case 'cone':
                    geometry = new THREE.ConeGeometry(shapeType.radius, shapeType.height, shapeType.radialSegments);
                    break;
                case 'tetrahedron':
                    geometry = new THREE.TetrahedronGeometry(shapeType.radius, shapeType.detail);
                    break;
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(shapeType.radius, shapeType.detail);
                    break;
                case 'dodecahedron':
                    geometry = new THREE.DodecahedronGeometry(shapeType.radius, shapeType.detail);
                    break;
                case 'icosahedron':
                    geometry = new THREE.IcosahedronGeometry(shapeType.radius, shapeType.detail);
                    break;
            }
            
            // Create wireframe material with random color
            const hue = 0.5 + Math.random() * 0.5;
            const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
            
            const shape = new THREE.Mesh(geometry, material);
            
            // Random position in a sphere
            const radius = 10 + Math.random() * 40;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            shape.position.x = radius * Math.sin(phi) * Math.cos(theta);
            shape.position.y = radius * Math.sin(phi) * Math.sin(theta);
            shape.position.z = radius * Math.cos(phi);
            
            // Random rotation
            shape.rotation.x = Math.random() * Math.PI;
            shape.rotation.y = Math.random() * Math.PI;
            
            // Random scale
            const scale = 0.5 + Math.random() * 1.5;
            shape.scale.set(scale, scale, scale);
            
            // Store rotation speed
            shape.userData = {
                rotationSpeed: (Math.random() - 0.5) * 0.005,
                rotationAxis: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize()
            };
            
            this.shapes.add(shape);
        }
    }
    
    createTechIcons(count) {
        // Tech icons (using simple geometries as placeholders)
        const icons = [
            { color: 0x61DAFB, name: 'react' },
            { color: 0xF7DF1E, name: 'js' },
            { color: 0x3178C6, name: 'typescript' },
            { color: 0xE34F26, name: 'html' },
            { color: 0x1572B6, name: 'css' },
            { color: 0x777BB4, name: 'php' },
            { color: 0x0769AD, name: 'jquery' },
            { color: 0xCC6699, name: 'sass' },
            { color: 0x000000, name: 'nextjs' },
            { color: 0x61DAFB, name: 'react' }
        ];
        
        for (let i = 0; i < count; i++) {
            const iconType = icons[Math.floor(Math.random() * icons.length)];
            
            // Create a simple geometry for the icon
            let geometry;
            const size = 0.8 + Math.random() * 0.4;
            
            switch(iconType.name) {
                case 'react':
                    // React logo shape (simplified)
                    const torusGeom = new THREE.TorusGeometry(0.4, 0.1, 8, 24);
                    const torus1 = new THREE.Mesh(torusGeom, new THREE.MeshBasicMaterial({ color: iconType.color }));
                    const torus2 = torus1.clone().rotateY(Math.PI / 3);
                    const torus3 = torus1.clone().rotateY(-Math.PI / 3);
                    
                    const group = new THREE.Group();
                    group.add(torus1, torus2, torus3);
                    group.scale.set(size, size, size);
                    this.setupIcon(group, i, count);
                    this.techIcons.add(group);
                    continue;
                    
                case 'js':
                    geometry = new THREE.BoxGeometry(size * 0.8, size * 0.5, 0.1);
                    break;
                    
                case 'typescript':
                    geometry = new THREE.BoxGeometry(size * 0.8, size * 0.5, 0.1);
                    break;
                    
                case 'html':
                    geometry = new THREE.OctahedronGeometry(size * 0.6, 0);
                    break;
                    
                case 'css':
                    geometry = new THREE.OctahedronGeometry(size * 0.6, 0);
                    break;
                    
                default:
                    geometry = new THREE.IcosahedronGeometry(size * 0.5, 0);
            }
            
            const material = new THREE.MeshBasicMaterial({
                color: iconType.color,
                transparent: true,
                opacity: 0.8,
                wireframe: Math.random() > 0.7
            });
            
            const icon = new THREE.Mesh(geometry, material);
            this.setupIcon(icon, i, count);
            this.techIcons.add(icon);
        }
    }
    
    setupIcon(icon, index, total) {
        // Position in a spherical distribution
        const radius = 15 + Math.random() * 35;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        icon.position.x = radius * Math.sin(phi) * Math.cos(theta);
        icon.position.y = radius * Math.sin(phi) * Math.sin(theta);
        icon.position.z = radius * Math.cos(phi);
        
        // Random rotation
        icon.rotation.x = Math.random() * Math.PI;
        icon.rotation.y = Math.random() * Math.PI;
        
        // Store animation properties
        icon.userData = {
            rotationSpeed: (Math.random() - 0.5) * 0.002,
            bobSpeed: 0.5 + Math.random() * 0.5,
            bobHeight: 0.05 + Math.random() * 0.1,
            initialY: icon.position.y,
            timeOffset: Math.random() * Math.PI * 2
        };
    }
    
    setupResizeHandler() {
        const onResize = () => {
            // Update camera
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            
            // Update renderer
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        
        window.addEventListener('resize', onResize.bind(this), false);
        
        // Store for cleanup
        this._resizeHandler = onResize;
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const time = Date.now() * 0.001;
        
        // Rotate particle system
        if (this.particles) {
            this.particles.rotation.x += this.rotationSpeed * 0.5;
            this.particles.rotation.y += this.rotationSpeed;
            
            // Pulsing effect for particles
            if (this.particleSystem && this.particleSystem.material) {
                this.particleSystem.material.size = 0.1 + Math.sin(time * 0.5) * 0.1 + 0.2;
            }
        }
        
        // Animate 3D shapes
        if (this.shapes) {
            this.shapes.rotation.x += this.shapesRotationSpeed * 0.3;
            this.shapes.rotation.y += this.shapesRotationSpeed * 0.5;
            
            // Animate individual shapes
            this.shapes.children.forEach(shape => {
                if (shape.userData) {
                    // Rotate around their own axis
                    shape.rotateOnAxis(shape.userData.rotationAxis, shape.userData.rotationSpeed);
                    
                    // Move in their direction
                    shape.position.x += (Math.random() - 0.5) * 0.01;
                    shape.position.y += (Math.random() - 0.5) * 0.01;
                    shape.position.z += (Math.random() - 0.5) * 0.01;
                    
                    // Keep within bounds
                    const maxDistance = 50;
                    const pos = shape.position;
                    const dist = Math.sqrt(pos.x*pos.x + pos.y*pos.y + pos.z*pos.z);
                    
                    if (dist > maxDistance) {
                        // Move back toward center
                        pos.multiplyScalar(0.95);
                    }
                }
            });
        }
        
        // Animate tech icons
        if (this.techIcons) {
            this.techIcons.rotation.x += this.iconsRotationSpeed * 0.2;
            this.techIcons.rotation.y += this.iconsRotationSpeed * 0.3;
            
            // Animate individual icons
            this.techIcons.children.forEach(icon => {
                if (icon.userData) {
                    // Bobbing animation
                    icon.position.y = icon.userData.initialY + 
                                    Math.sin(time * icon.userData.bobSpeed + icon.userData.timeOffset) * 
                                    icon.userData.bobHeight;
                    
                    // Slow rotation
                    icon.rotation.y += icon.userData.rotationSpeed;
                }
            });
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    cleanup() {
        // Remove event listeners
        window.removeEventListener('resize', this._resizeHandler);
        
        // Remove WebGL canvas
        if (this.container && this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }
        
        // Clean up Three.js objects
        if (this.scene) {
            while(this.scene.children.length > 0) {
                const object = this.scene.children[0];
                this.scene.remove(object);
                
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            }
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.forceContextLoss();
        }
    }
    
    // Clean up resources when the background is no longer needed
    destroy() {
        this.cleanup();
    }
}

// Initialize when DOM is loaded and Three.js is available
function initWebGLBackground() {
    if (typeof THREE !== 'undefined') {
        // Check if WebGL is supported
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                console.warn('WebGL is not supported in this browser');
                return;
            }
        } catch (e) {
            console.warn('WebGL is not supported in this browser', e);
            return;
        }

        // Create and store the WebGL background instance
        window.webglBackground = new WebGLBackground('webgl-container');
    } else {
        console.error('Three.js is not loaded. Please include Three.js before this script.');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebGLBackground);
} else {
    // DOM already loaded
    initWebGLBackground();
}
