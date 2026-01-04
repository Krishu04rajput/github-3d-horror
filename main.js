// SCENE
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 2, 15);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// FLOOR
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x111111 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// WALLS
const wallMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
for (let i = -10; i <= 10; i += 5) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3, 10),
    wallMat
  );
  wall.position.set(i, 1.5, -10);
  scene.add(wall);
}

// LIGHT (AMBIENT)
scene.add(new THREE.AmbientLight(0x202020));

// FLASHLIGHT
const flashlight = new THREE.SpotLight(0xffffff, 2, 15, Math.PI / 6);
flashlight.position.set(0, 1.6, 0);
flashlight.target.position.set(0, 1.6, -1);
scene.add(flashlight);
scene.add(flashlight.target);

// PLAYER
camera.position.set(0, 1.6, 5);

// CONTROLS
let keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// MOUSE LOOK
document.body.addEventListener("click", () => {
  document.body.requestPointerLock();
});

let yaw = 0, pitch = 0;
document.addEventListener("mousemove", e => {
  if (document.pointerLockElement === document.body) {
    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch));
    camera.rotation.set(pitch, yaw, 0);
  }
});

// FLASHLIGHT TOGGLE
let lightOn = true;
document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "f") {
    lightOn = !lightOn;
    flashlight.intensity = lightOn ? 2 : 0;
  }
});

// GAME LOOP
function animate() {
  requestAnimationFrame(animate);

  const speed = 0.05;
  if (keys["w"]) camera.translateZ(-speed);
  if (keys["s"]) camera.translateZ(speed);
  if (keys["a"]) camera.translateX(-speed);
  if (keys["d"]) camera.translateX(speed);

  flashlight.position.copy(camera.position);
  flashlight.target.position.set(
    camera.position.x + Math.sin(yaw),
    camera.position.y + pitch,
    camera.position.z - Math.cos(yaw)
  );

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
