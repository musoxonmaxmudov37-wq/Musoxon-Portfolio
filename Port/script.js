// Three.js scene setup
let scene, camera, renderer, particles, mouse;
const landing = document.getElementById('landing');
const mainContent = document.getElementById('mainContent');

initSphere();
animate();

function initSphere() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({canvas: document.getElementById('sphereCanvas'), alpha: true});
  renderer.setSize(window.innerWidth, window.innerHeight);

  const particleCount = 5000;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];

  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const r = 20 + Math.random()*0.5;
    positions.push(r * Math.sin(phi) * Math.cos(theta));
    positions.push(r * Math.sin(phi) * Math.sin(theta));
    positions.push(r * Math.cos(phi));

    colors.push(0, 1, 1); // cyan glow
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({size: 0.2, vertexColors: true, transparent: true, opacity: 0.8});
  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  mouse = new THREE.Vector2();

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('click', () => {
    landing.style.transition = 'opacity 1s';
    landing.style.opacity = 0;
    setTimeout(() => {
      landing.style.display = 'none';
      mainContent.classList.remove('hidden');
    }, 1000);
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  requestAnimationFrame(animate);

  // rotate sphere
  particles.rotation.y += 0.002;
  particles.rotation.x += 0.001;

  // subtle mouse repulsion
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i+=3) {
    const dx = positions[i] - mouse.x * 30;
    const dy = positions[i+1] - mouse.y * 30;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 5) {
      positions[i] += dx/dist*0.05;
      positions[i+1] += dy/dist*0.05;
    }
  }
  particles.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
