import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
import { PointerLockControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/PointerLockControls.js";

/* =======================
   SCENE SETUP
======================= */

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 5, 40);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

/* =======================
   CONTROLS (FPS)
======================= */

const controls = new PointerLockControls(camera, document.body);

document.addEventListener("click", () => {
  controls.lock();
});

scene.add(controls.getObject());

/* =======================
   LIGHTING (DIM HORROR)
======================= */

const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const flashlight = new THREE.SpotLight(0xffffff, 2, 25, Math.PI / 6, 0.5);
flashlight.position.set(0, 0, 0);
flashlight.target.position.set(0, 0, -1);
camera.add(flashlight);
camera.add(flashlight.target);
scene.add(camera);

/* =======================
   GROUND
======================= */

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x111111 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

/* =======================
   TEST CUBE (DEBUG – MUST SEE)
======================= */

const testCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
testCube.position.set(0, 1, -3);
scene.add(testCube);

/* =======================
   LOAD BOSS MODEL (GOOGLE DRIVE)
======================= */

const loader = new GLTFLoader();

loader.load(
  "https://drive.google.com/uc?export=download&id=1mhqqAdJe69ZKpJ6A5HVzCQZOboYP1hP7",
  (gltf) => {
    const boss = gltf.scene;
    boss.position.set(0, 0, -15);
    boss.scale.set(1.2, 1.2, 1.2);
    scene.add(boss);
    console.log("Boss loaded");
  },
  undefined,
  (err) => {
    console.error("Boss failed", err);
  }
);

/* =======================
   MOVEMENT
======================= */

const keys = {};

document.addEventListener("keydown", (e) => keys[e.code] = true);
document.addEventListener("keyup", (e) => keys[e.code] = false);

const speed = 0.08;

/* =======================
   RESIZE FIX
======================= */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* =======================
   GAME LOOP
======================= */

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked) {
    if (keys["KeyW"]) controls.moveForward(speed);
    if (keys["KeyS"]) controls.moveForward(-speed);
    if (keys["KeyA"]) controls.moveRight(-speed);
    if (keys["KeyD"]) controls.moveRight(speed);
  }

  renderer.render(scene, camera);
}

animate();
