class BackgroundAnimation {
  constructor() {
    this.container = document.getElementById('hero-background');
    if (!this.container) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse = { x: 0, y: 0 };
    this.time = 0;
    
    this.init();
    this.setupEventListeners();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 30;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Add lights
    this.addLights();
    
    // Create objects
    this.createParticles();
    this.createShapes();
    this.createGradientPlane();
    
    // Start animation
    this.animate();
  }

  addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Point lights
    const pointLight1 = new THREE.PointLight(0x4f46e5, 0.8, 100);
    pointLight1.position.set(10, 10, 10);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.8, 100);
    pointLight2.position.set(-10, -10, -10);
    this.scene.add(pointLight2);
  }

  createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x6366f1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
  }

  createShapes() {
    // Create a group to hold all shapes
    this.shapesGroup = new THREE.Group();
    
    // Add different shapes
    const geometry1 = new THREE.IcosahedronGeometry(2, 0);
    const material1 = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.8,
      wireframe: true,
      shininess: 100
    });
    
    const shape1 = new THREE.Mesh(geometry1, material1);
    shape1.position.set(-10, 5, -5);
    shape1.rotationSpeed = 0.005;
    this.shapesGroup.add(shape1);
    
    const geometry2 = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    const material2 = new THREE.MeshPhongMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.8,
      wireframe: true,
      shininess: 100
    });
    
    const shape2 = new THREE.Mesh(geometry2, material2);
    shape2.position.set(8, -3, -8);
    shape2.rotationSpeed = 0.003;
    this.shapesGroup.add(shape2);
    
    this.scene.add(this.shapesGroup);
  }

  createGradientPlane() {
    // Create a plane for the gradient background
    const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    
    // Create a shader material for the gradient
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(this.width, this.height) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;
        
        vec3 palette(float t) {
          vec3 a = vec3(0.5, 0.5, 0.5);
          vec3 b = vec3(0.5, 0.5, 0.5);
          vec3 c = vec3(1.0, 1.0, 1.0);
          vec3 d = vec3(0.263, 0.416, 0.557);
          
          return a + b * cos(6.28318 * (c * t + d));
        }
        
        void main() {
          vec2 uv = (vUv - 0.5) * 2.0;
          uv.x *= resolution.x / resolution.y;
          
          vec3 finalColor = vec3(0.0);
          
          for (float i = 0.0; i < 3.0; i++) {
            float t = abs(1.0 / (sin(uv.y + sin(uv.x + time * 0.1) * 2.0) * 200.0));
            finalColor += palette(uv.x * 0.5 + i * 0.2 + time * 0.1) * t * (1.0 + i * 0.5);
          }
          
          gl_FragColor = vec4(finalColor, 0.15);
        }
      `,
      transparent: true,
      depthWrite: false
    });
    
    this.gradientPlane = new THREE.Mesh(geometry, material);
    this.gradientPlane.position.z = -40;
    this.scene.add(this.gradientPlane);
  }

  onMouseMove(event) {
    // Update mouse position
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Move particles based on mouse position
    if (this.particles) {
      this.particles.rotation.y = this.mouse.x * 0.2;
      this.particles.rotation.x = this.mouse.y * 0.2;
    }
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(this.width, this.height);
    
    if (this.gradientPlane?.material?.uniforms?.resolution) {
      this.gradientPlane.material.uniforms.resolution.value.set(this.width, this.height);
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.time += 0.01;
    
    // Animate particles
    if (this.particles) {
      this.particles.rotation.y += 0.001;
    }
    
    // Animate shapes
    if (this.shapesGroup) {
      this.shapesGroup.children.forEach((shape, i) => {
        shape.rotation.x += shape.rotationSpeed || 0.001;
        shape.rotation.y += shape.rotationSpeed * 1.5 || 0.0015;
      });
    }
    
    // Update gradient
    if (this.gradientPlane?.material?.uniforms?.time) {
      this.gradientPlane.material.uniforms.time.value = this.time;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the hero section exists
  if (document.getElementById('hero-background')) {
    // Load Three.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      new BackgroundAnimation();
    };
    document.head.appendChild(script);
  }
});
