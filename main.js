// =====================
// BASIC SETUP
// =====================
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 50);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// =====================
// LIGHTS
// =====================
scene.add(new THREE.AmbientLight(0x404040, 0.6));

const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// =====================
// FLOOR
// =====================
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// =====================
// WALLS
// =====================
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });

for (let i = -20; i <= 20; i += 10) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(3, 5, 20),
    wallMaterial
  );
  wall.position.set(i, 2.5, -20);
  scene.add(wall);
}

// =====================
// PLAYER
// =====================
camera.position.set(0, 1.7, 15);
scene.add(camera);

// =====================
// FLASHLIGHT
// =====================
const flashlight = new THREE.SpotLight(0xffffff, 4, 30, Math.PI / 6, 0.5);
flashlight.position.set(0, 0, 0);
camera.add(flashlight);

const flashlightTarget = new THREE.Object3D();
flashlightTarget.position.set(0, 0, -1);
camera.add(flashlightTarget);
flashlight.target = flashlightTarget;

let flashlightOn = true;

// =====================
// CONTROLS
// =====================
const keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// POINTER LOCK
document.body.addEventListener("click", () => {
  document.body.requestPointerLock();
});

// MOUSE LOOK
let yaw = 0, pitch = 0;
document.addEventListener("mousemove", e => {
  if (document.pointerLockElement === document.body) {
    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    camera.rotation.set(pitch, yaw, 0);
  }
});

// FLASHLIGHT TOGGLE
document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "f") {
    flashlightOn = !flashlightOn;
    flashlight.visible = flashlightOn;
  }
});

// =====================
// GAME LOOP
// =====================
function animate() {
  requestAnimationFrame(animate);

  const speed = 0.1;
  if (keys["w"]) camera.translateZ(-speed);
  if (keys["s"]) camera.translateZ(speed);
  if (keys["a"]) camera.translateX(-speed);
  if (keys["d"]) camera.translateX(speed);

  renderer.render(scene, camera);
}

animate();

// =====================
// RESIZE
// =====================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
