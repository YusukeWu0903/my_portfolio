import * as T from './vendor/three.module.js';
import { namedBuilding } from './models/named-buildings.js';

// Architectural factories are shared with the authored city in 明日之星.
// This scene has its own compact street plan; the game's city is never changed.
const send = data => parent.postMessage(data, location.origin);
const catalogue = {
  'hex-grid': ['training', 'arts-academy'],
  'visual-novel': ['cinema', 'star-cinema'],
  pivotlens: ['television', 'aite-broadcast'],
  'material-library': ['studio', 'feida-sawtooth'],
  miffy: ['boutique', 'baoer-boutique'],
  mimi: ['wellness', 'goddess-center'],
  eris: ['agency', 'davinci-wings'],
  'water-sort': ['restaurant', 'music-dining'],
};
let mounted = false;
window.addEventListener('message', event => {
  if (event.source !== parent || event.origin !== location.origin) return;
  if (event.data?.type === 'portfolio-city:init' && !mounted && Array.isArray(event.data.projects)) {
    mounted = true;
    try { mount(event.data.projects); } catch (error) { console.error(error); send({ type: 'portfolio-city:error' }); }
  }
});
send({ type: 'portfolio-city:ready' });

function mount(projects) {
  const scene = new T.Scene();
  scene.background = new T.Color('#abc8c2');
  const renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  document.body.append(renderer.domElement);
  const camera = new T.OrthographicCamera(-100, 100, 75, -75, .1, 1000);
  camera.position.set(110, 175, 230);
  camera.lookAt(0, 0, 0);
  scene.add(new T.HemisphereLight('#eaf6ee', '#8e9878', 2.8));
  const sun = new T.DirectionalLight('#fff0d4', 3.6);
  sun.position.set(-90, 180, 70); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -130, right: 130, top: 130, bottom: -130, far: 500 });
  sun.shadow.normalBias = .08; sun.shadow.bias = -.0002;
  scene.add(sun);
  const geometry = new T.BoxGeometry(1, 1, 1);
  const materials = new Map();
  function material(color) {
    if (!materials.has(color)) materials.set(color, new T.MeshStandardMaterial({ color, roughness: .8 }));
    return materials.get(color);
  }
  function box(x, y, z, w, h, d, color, group = scene) {
    const o = new T.Mesh(geometry, material(color));
    o.position.set(x, y, z); o.scale.set(w, h, d); o.castShadow = h > 1; o.receiveShadow = true; group.add(o); return o;
  }
  const rows = Math.max(2, Math.ceil(projects.length / 4));
  const extentZ = rows * 21 + 36;
  const centerZ = (rows - 1) * 21;
  box(0, -3, 0, 178, 5, extentZ * 2 + 5, '#7ea59c');
  box(0, -.5, 0, 174, 2, extentZ * 2, '#d9d5ba');
  box(0, .55, 0, 166, .3, extentZ * 2 - 8, '#b7c9a6');
  // A complete inhabited block: local streets, sidewalks, buildings and planted edges.
  for (const x of [-62, -31, 0, 31, 62]) {
    box(x, .8, 0, 6.3, .12, extentZ * 2 - 14, '#6b7e79');
    box(x - 3.65, .9, 0, .8, .3, extentZ * 2 - 14, '#ede5cf');
    box(x + 3.65, .9, 0, .8, .3, extentZ * 2 - 14, '#ede5cf');
    for (let z = -extentZ + 10; z < extentZ - 8; z += 8) box(x, .88, z, .16, .03, 3.3, '#e7dfb9');
  }
  const roadsZ = Array.from({ length: rows + 1 }, (_, i) => i * 42 - rows * 21);
  for (const z of roadsZ) {
    box(0, .85, z, 154, .13, 6.3, '#6b7e79');
    for (const sign of [-1, 1]) box(0, .95, z + sign * 3.7, 154, .25, .9, '#ede5cf');
    for (let x = -72; x < 75; x += 8) box(x, .94, z, 3.4, .02, .16, '#e7dfb9');
    for (const x of [-62, -31, 0, 31, 62]) for (const s of [-1, 1]) for (let n = 0; n < 4; n++) box(x - 1.8 + n * 1.15, .95, z + s * 4.8, .6, .035, 2.1, '#eee8d2');
  }
  const leafGeo = new T.IcosahedronGeometry(1, 1);
  function tree(x, z, scale = 1) {
    box(x, 2, z, .5, 3, .5, '#96886c');
    const crown = new T.Mesh(leafGeo, material('#699777'));
    crown.position.set(x, 4.4 * scale, z); crown.scale.set(1.8 * scale, 2.1 * scale, 1.8 * scale); crown.castShadow = true; scene.add(crown);
  }
  for (let x = -77; x <= 77; x += 10) for (const z of [-extentZ + 4, extentZ - 4]) tree(x, z, .8);
  for (const x of [-76, 76]) for (let z = -extentZ + 13; z < extentZ - 9; z += 10) tree(x, z, .8);
  const background = new T.Group(); scene.add(background);
  function neighborhoodBuilding(x, z, index, front = false) {
    const height = front ? 6 + index % 3 * 2 : 11 + index % 5 * 3;
    const w = 8 + index % 3, d = 9;
    const colors = ['#c3c8b5', '#d8cbb0', '#adbfb9', '#d3d3bd', '#b8c9c0'];
    box(x, 1 + height / 2, z, w, height, d, colors[index % colors.length], background);
    box(x, height + 1.4, z, w + .7, .6, d + .7, '#e7dfc7', background);
    box(x - w * .2, height + 2, z, w * .35, 1, d * .4, '#98aaa2', background);
    for (let y = 3; y < height; y += 2.4) {
      box(x, y, z + d / 2 + .03, w * .78, 1.3, .05, '#729a9d', background);
      box(x + w / 2 + .03, y, z, .05, 1.3, d * .78, '#729a9d', background);
      box(x, y + .75, z + d / 2 + .1, w + .2, .16, .3, '#e5dcc4', background);
    }
    box(x, 2, z + d / 2 + .12, 1.5, 2, .14, '#607f7b', background);
  }
  for (let i = 0; i < 11; i++) {
    neighborhoodBuilding(-64 + i * 12.7, -extentZ + 17, i);
    if (i % 3 !== 1) neighborhoodBuilding(-64 + i * 12.7, extentZ - 16, i + 10, true);
  }
  // Small waterfront garden and low-rise side streets provide breathing room.
  for (let row = 0; row < rows; row++) for (const x of [-73, 73]) {
    const z = row * 42 - centerZ;
    neighborhoodBuilding(x, z - 5, row + 4, true); tree(x, z + 8, .8);
  }
  const landmarks = [];
  projects.forEach((project, index) => {
    const col = index % 4, row = Math.floor(index / 4);
    const x = -46.5 + col * 31, z = row * 42 - centerZ;
    const color = project.category === 'games' ? '#d2b16f' : project.category === 'tools' ? '#70a8a0' : '#c39ab4';
    box(x, 1, z, 24, .8, 31, '#ebe4cf');
    box(x, 1.45, z + 13.5, 22, .12, 2.5, color);
    const [kind, designKey] = catalogue[project.id] || (project.category === 'art' ? ['boutique', 'baoer-boutique'] : project.category === 'games' ? ['cinema', 'star-cinema'] : ['studio', 'feida-sawtooth']);
    const profile = { id: `CityDesign${String(index + 1).padStart(4, '0')}`, kind, designKey, wallHex: '#e5ddc4', glassHex: '#7aafb7', accentHex: color };
    const group = namedBuilding(profile, 21, 25, 'physical', .5);
    const bounds = new T.Box3().setFromObject(group), size = bounds.getSize(new T.Vector3());
    const fit = Math.min(1, 23 / size.x, 28 / size.z, 32 / size.y);
    group.scale.multiplyScalar(fit);
    group.position.set(x, 1.5 - bounds.min.y * fit, z);
    group.userData.projectId = project.id;
    scene.add(group);
    const highlight = box(x, 1.39, z, 24.6, .08, 31.6, color);
    highlight.visible = false;
    landmarks.push({ id: project.id, group, x, z, highlight, effect: group.userData.heroEffect || group.userData.pianoEffect });
    for (const s of [-1, 1]) { tree(x + s * 10, z + 11, .65); box(x + s * 8, 1.75, z + 14, 2.3, .6, .8, '#9a9d78'); }
  });
  // Lightweight traffic follows the central street; no orbit/drag controls disturb labels.
  const cars = [];
  for (let i = 0; i < 7; i++) {
    const g = new T.Group();
    box(0, 1.4, 0, 1.8, .9, 3.3, ['#e5bb75', '#e5e1d2', '#6b9c9b', '#b77c7f'][i % 4], g);
    box(0, 2.1, -.2, 1.6, .65, 1.6, '#526e71', g);
    g.position.set(i % 2 ? 1.7 : -1.7, 0, 0); scene.add(g); cars.push(g);
  }
  let selected = null;
  const highlight = id => { selected = id; for (const item of landmarks) item.highlight.visible = item.id === id; };
  window.addEventListener('message', event => { if (event.source === parent && event.origin === location.origin && event.data?.type === 'portfolio-city:highlight') highlight(event.data.id); });
  const ray = new T.Raycaster(), pointer = new T.Vector2();
  let hovered = null;
  function pick(event, click = false) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(landmarks.map(item => item.group), true)[0];
    let object = hit?.object;
    while (object && !object.userData.projectId) object = object.parent;
    const id = object?.userData.projectId || null;
    renderer.domElement.style.cursor = id ? 'pointer' : 'default';
    if ((id && id !== hovered) || click) { highlight(id); send({ type: 'portfolio-city:select', id }); }
    hovered = id;
  }
  renderer.domElement.addEventListener('pointermove', event => { if (event.pointerType === 'mouse') pick(event); });
  renderer.domElement.addEventListener('click', event => pick(event, true));
  const resize = () => {
    const w = innerWidth, h = innerHeight, height = 149 + Math.max(0, rows - 2) * 33;
    camera.left = -height * w / h / 2; camera.right = -camera.left; camera.top = height / 2; camera.bottom = -height / 2; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    renderer.setSize(w, h);
    const anchors = landmarks.map(item => { const p = new T.Vector3(item.x, 2, item.z + 16.2).project(camera); return { id: item.id, x: (p.x + 1) * 50, y: (-p.y + 1) * 50 }; });
    renderer.render(scene, camera);
    send({ type: 'portfolio-city:anchors', anchors });
  };
  window.addEventListener('resize', resize); resize();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let last = 0;
  renderer.setAnimationLoop(time => {
    if (document.hidden || time - last < 42) return;
    last = time;
    for (const item of landmarks) item.effect?.setFrame(reduced.matches || item.id === selected ? 0 : time / 125, 48);
    cars.forEach((g, i) => { g.position.z = reduced.matches ? i * 13 - 42 : (time / 500 * (i % 2 ? -1 : 1) + i * 17 + 10000) % (extentZ * 2 - 20) - extentZ + 10; });
    renderer.render(scene, camera);
  });
  window.addEventListener('pagehide', () => {
    renderer.setAnimationLoop(null);
    const geometries = new Set(), mats = new Set(), textures = new Set();
    scene.traverse(o => { if (o.geometry) geometries.add(o.geometry); for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m) mats.add(m); });
    mats.forEach(m => { for (const v of Object.values(m)) if (v?.isTexture) textures.add(v); m.dispose(); });
    geometries.forEach(g => g.dispose()); textures.forEach(t => t.dispose()); renderer.dispose();
  }, { once: true });
}
