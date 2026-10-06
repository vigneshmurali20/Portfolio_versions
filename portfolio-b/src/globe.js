import * as THREE from 'three';
import { clientRegions } from './content.js';

const RADIUS = 1;
const EARTH_LAND = [
  [[-168, 70], [-148, 72], [-133, 69], [-124, 58], [-132, 54], [-125, 49], [-124, 41], [-117, 33], [-110, 29], [-106, 23], [-98, 17], [-91, 18], [-83, 9], [-78, 8], [-77, 18], [-82, 25], [-80, 31], [-74, 36], [-67, 45], [-58, 51], [-61, 59], [-76, 62], [-91, 70], [-112, 75], [-132, 75], [-151, 72], [-168, 70]],
  [[-81, 12], [-73, 10], [-63, 10], [-52, 5], [-47, -3], [-50, -12], [-45, -22], [-52, -31], [-67, -55], [-74, -46], [-72, -23], [-78, -7], [-81, 12]],
  [[-11, 36], [-7, 43], [-10, 49], [-5, 55], [2, 58], [7, 54], [12, 55], [17, 60], [23, 58], [28, 61], [32, 55], [39, 54], [44, 47], [38, 41], [29, 39], [24, 35], [17, 39], [10, 37], [4, 43], [-1, 41], [-6, 36], [-11, 36]],
  [[-10, 51], [-8, 59], [-15, 64], [-22, 68], [-12, 72], [5, 72], [18, 69], [33, 72], [52, 68], [68, 72], [87, 72], [103, 76], [122, 73], [141, 70], [159, 63], [177, 58], [180, 69], [160, 74], [137, 76], [111, 78], [85, 76], [60, 79], [39, 75], [25, 70], [14, 72], [-2, 68], [-12, 61], [-10, 51]],
  [[-17, 36], [-4, 35], [8, 37], [19, 33], [31, 31], [35, 24], [43, 12], [51, 12], [49, 2], [43, -12], [39, -23], [33, -34], [21, -35], [12, -18], [7, -6], [-1, 5], [-10, 7], [-16, 18], [-17, 27], [-17, 36]],
  [[35, 31], [47, 30], [56, 26], [68, 25], [77, 30], [89, 27], [96, 20], [93, 8], [83, 7], [77, 10], [72, 20], [63, 24], [56, 17], [49, 12], [43, 13], [39, 22], [35, 31]],
  [[96, 20], [107, 22], [119, 19], [128, 12], [133, 3], [127, -5], [119, -9], [112, -7], [107, 1], [101, 6], [96, 12], [96, 20]],
  [[112, -11], [123, -11], [132, -12], [141, -16], [153, -25], [151, -36], [145, -39], [135, -35], [128, -33], [119, -34], [114, -26], [112, -18], [112, -11]],
  [[-9, 50], [-6, 58], [-3, 59], [0, 55], [-1, 51], [-4, 50], [-9, 50]],
  [[129, 31], [132, 34], [136, 36], [141, 42], [144, 44], [142, 36], [137, 33], [133, 31], [129, 31]],
];

const REGION_SHAPES = {
  US: [
    [[-124.7, 48.4], [-123, 42], [-124.2, 41], [-122, 38], [-120, 35], [-117, 33], [-114.7, 32.7], [-111, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-103, 29.8], [-100, 29], [-97.2, 25.9], [-96, 28.5], [-93.5, 29.7], [-90, 29.1], [-88, 30.3], [-85, 30.2], [-82, 25.2], [-80, 25.5], [-80, 28.5], [-81, 30.8], [-80.5, 33], [-77, 35], [-75.5, 38], [-74, 40], [-72, 41], [-69.8, 43], [-70.5, 45], [-71.5, 45], [-73.3, 45], [-75.5, 44], [-79, 43], [-82.5, 45], [-84.8, 45], [-89.5, 47], [-94.8, 49], [-104, 49], [-111, 49], [-117, 49], [-120, 49], [-123, 49], [-124.7, 48.4]],
    [[-169, 52], [-165, 55], [-162, 59], [-156, 57], [-152, 60], [-147, 60], [-141, 60], [-141, 69], [-148, 70], [-154, 66], [-162, 64], [-166, 60], [-169, 52]],
    [[-160.5, 22], [-159.5, 21.5], [-157.5, 21.5], [-156.8, 20.8], [-158.2, 20.5], [-160, 21], [-160.5, 22]],
  ],
  AE: [[[51.5, 24.8], [52.4, 24.6], [53.1, 24.2], [54.1, 24.1], [55.1, 24.4], [56.3, 24.9], [56.1, 25.6], [55.6, 25.9], [55.2, 26.1], [54.7, 25.3], [54, 24.9], [53.4, 24.8], [52.8, 25.2], [52.1, 25.3], [51.5, 24.8]]],
  AU: [[[113, -22], [114.5, -17], [121, -16], [123, -14], [129, -14], [132, -12], [136, -13], [139, -17], [145, -16], [149, -20], [153.5, -26], [151, -34], [146, -39], [138, -36], [133, -35], [129, -33], [123, -34], [116, -35], [114, -30], [113, -22]]],
  GB: [
    [[-5.7, 50], [-4.2, 50], [-3.1, 50.2], [-2, 51], [0.2, 51.4], [1.7, 52.8], [1.6, 54.1], [0.8, 55.1], [-1.4, 55.2], [-2, 56.2], [-3.1, 57.2], [-4.5, 57.5], [-5.1, 58.6], [-5.7, 58.5], [-5.3, 57], [-4.3, 56], [-5, 55], [-4.8, 54], [-5.6, 53], [-4.5, 52.2], [-5.7, 50]],
    [[-7.3, 55.1], [-6.1, 55.2], [-5.4, 54.7], [-5.6, 54], [-6.4, 54], [-7.3, 54.5], [-7.3, 55.1]],
  ],
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const pointInPolygon = (x, y, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
};

const toSphere = ([longitude, latitude], radius = RADIUS) => {
  const lat = THREE.MathUtils.degToRad(latitude);
  const lon = THREE.MathUtils.degToRad(longitude);
  return new THREE.Vector3(radius * Math.cos(lat) * Math.sin(lon), radius * Math.sin(lat), radius * Math.cos(lat) * Math.cos(lon));
};

const random = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

function particleGeometry(locations, rng) {
  const positions = new Float32Array(locations.length * 3);
  const phases = new Float32Array(locations.length);
  locations.forEach((coordinate, i) => {
    const point = toSphere(coordinate, RADIUS + 0.005);
    positions.set([point.x, point.y, point.z], i * 3);
    phases[i] = rng() * Math.PI * 2;
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  return geometry;
}

function sampleLand(count, seed, polygons) {
  const rng = random(seed);
  const points = [];
  let attempts = 0;
  while (points.length < count && attempts < count * 30) {
    attempts++;
    const longitude = rng() * 360 - 180;
    const latitude = rng() * 150 - 65;
    if (polygons.some((poly) => pointInPolygon(longitude, latitude, poly))) points.push([longitude, latitude]);
  }
  return { points, rng };
}

function sampleRegion(code, count, seed) {
  const rng = random(seed);
  const polygons = REGION_SHAPES[code];
  const bounds = polygons.flat().reduce((box, [lon, lat]) => ({
    minLon: Math.min(box.minLon, lon), maxLon: Math.max(box.maxLon, lon),
    minLat: Math.min(box.minLat, lat), maxLat: Math.max(box.maxLat, lat),
  }), { minLon: 180, maxLon: -180, minLat: 90, maxLat: -90 });
  const points = [];
  let attempts = 0;
  while (points.length < count && attempts < count * 80) {
    attempts++;
    const lon = bounds.minLon + rng() * (bounds.maxLon - bounds.minLon);
    const lat = bounds.minLat + rng() * (bounds.maxLat - bounds.minLat);
    if (polygons.some((poly) => pointInPolygon(lon, lat, poly))) points.push([lon, lat]);
  }
  return { points, rng };
}

function pointsMaterial(color, size, opacity) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uSize: { value: size }, uOpacity: { value: opacity }, uColor: { value: new THREE.Color(color) } },
    vertexShader: `
      attribute float aPhase;
      uniform float uTime;
      uniform float uSize;
      varying float vAlpha;
      void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        float pulse = 0.78 + 0.22 * sin(uTime * 1.15 + aPhase);
        gl_PointSize = uSize * (250.0 / -viewPosition.z) * pulse;
        gl_Position = projectionMatrix * viewPosition;
        vAlpha = pulse;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      void main() {
        float edge = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.22, 0.5, edge);
        gl_FragColor = vec4(uColor, alpha * uOpacity * vAlpha);
      }
    `,
  });
}

function makeGrid(group) {
  const material = new THREE.LineBasicMaterial({ color: 0xc9c4d3, transparent: true, opacity: 0.12, depthWrite: false });
  for (const longitude of [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150]) {
    const points = [];
    for (let lat = -88; lat <= 88; lat += 4) points.push(toSphere([longitude, lat], RADIUS * 0.994));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }
  for (const latitude of [-60, -30, 0, 30, 60]) {
    const points = [];
    for (let lon = -180; lon <= 180; lon += 4) points.push(toSphere([lon, latitude], RADIUS * 0.994));
    group.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), material));
  }
}

function makeRegionBoundary(group, code, color) {
  const boundaries = [];
  for (const polygon of REGION_SHAPES[code]) {
    const points = polygon.map((coord) => toSphere(coord, RADIUS + 0.013));
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false });
    const boundary = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), material);
    group.add(boundary);
    boundaries.push(boundary);
  }
  return boundaries;
}

export function initGlobe(root) {
  const stage = root.querySelector('[data-globe-stage]');
  const fallback = root.querySelector('[data-globe-fallback]');
  const buttons = [...root.querySelectorAll('[data-globe-country]')];
  if (!stage || !buttons.length) return;

  const updateReadout = (region) => {
    buttons.forEach((button) => {
      const selected = button.dataset.globeCountry === region.code;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const name = root.querySelector('[data-globe-name]');
    const count = root.querySelector('[data-globe-count]');
    const countCard = root.querySelector(`[data-region-count="${region.code}"]`);
    if (name) name.textContent = region.name;
    if (count) count.textContent = region.count == null ? 'Count pending' : `${region.count}`;
    if (countCard) countCard.textContent = region.count == null ? 'Count pending' : `${region.count} clients`;
  };
  const selectFallbackRegion = (button) => {
    const region = clientRegions.find((item) => item.code === button.dataset.globeCountry);
    if (region) updateReadout(region);
  };
  if (!window.WebGLRenderingContext) {
    buttons.forEach((button) => button.addEventListener('click', () => selectFallbackRegion(button)));
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    buttons.forEach((button) => button.addEventListener('click', () => selectFallbackRegion(button)));
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.appendChild(renderer.domElement);
  if (fallback) fallback.hidden = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);
  camera.position.set(0, 0, 3.6);
  const globe = new THREE.Group();
  scene.add(globe);
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS - 0.02, 48, 32),
    new THREE.MeshBasicMaterial({ color: 0x17151c }),
  );
  globe.add(core);
  makeGrid(globe);

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.16, 0.0028, 5, 160),
    new THREE.MeshBasicMaterial({ color: 0x8965d0, transparent: true, opacity: 0.45 }),
  );
  halo.rotation.set(0.47, 0.12, -0.22);
  globe.add(halo);

  const land = sampleLand(4100, 96, EARTH_LAND);
  const landMaterial = pointsMaterial('#c8c5d0', 0.026, 0.58);
  const landPoints = new THREE.Points(particleGeometry(land.points, land.rng), landMaterial);
  globe.add(landPoints);

  const regionMaterials = new Map();
  const regionBoundaries = new Map();
  clientRegions.forEach((region, index) => {
    const sampled = sampleRegion(region.code, region.code === 'US' || region.code === 'AU' ? 920 : region.code === 'GB' ? 680 : 500, 270 + index * 71);
    const material = pointsMaterial('#b69af5', 0.034, 0.22);
    const points = new THREE.Points(particleGeometry(sampled.points, sampled.rng), material);
    globe.add(points);
    regionMaterials.set(region.code, material);
    regionBoundaries.set(region.code, makeRegionBoundary(globe, region.code, '#b69af5'));
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = clientRegions[0];
  let visible = false;
  let running = false;
  let dragging = false;
  let pointer = null;
  let lastTime = 0;
  let elapsed = 0;
  let focusX = THREE.MathUtils.degToRad(active.latitude);
  let focusY = THREE.MathUtils.degToRad(-active.longitude);
  globe.rotation.set(focusX, focusY, 0);

  const resize = () => {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    draw();
  };
  const draw = () => renderer.render(scene, camera);
  const frame = (time) => {
    running = false;
    if (!visible) return;
    const dt = Math.min((time - (lastTime || time)) / 1000, 0.05);
    lastTime = time;
    elapsed += dt;
    for (const material of [landMaterial, ...regionMaterials.values()]) material.uniforms.uTime.value = reducedMotion ? 0 : elapsed;
    if (!reducedMotion && !dragging) globe.rotation.y = focusY + Math.sin(elapsed * 0.18) * 0.035;
    draw();
    if (!reducedMotion) startFrame();
  };
  const startFrame = () => {
    if (running || !visible) return;
    running = true;
    requestAnimationFrame(frame);
  };

  const selectRegion = (region) => {
    active = region;
    focusX = THREE.MathUtils.degToRad(region.latitude);
    focusY = THREE.MathUtils.degToRad(-region.longitude);
    if (!dragging) globe.rotation.set(focusX, focusY, 0);
    updateReadout(region);
    for (const [code, material] of regionMaterials) material.uniforms.uOpacity.value = code === region.code ? 1 : 0.14;
    for (const [code, boundaries] of regionBoundaries) boundaries.forEach((line) => { line.material.opacity = code === region.code ? 0.78 : 0.12; });
    draw();
    if (!reducedMotion) startFrame();
  };
  buttons.forEach((button) => button.addEventListener('click', () => {
    const region = clientRegions.find((item) => item.code === button.dataset.globeCountry);
    if (region) selectRegion(region);
  }));

  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragging = true;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging || !pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    globe.rotation.y += dx * 0.006;
    globe.rotation.x = clamp(globe.rotation.x + dy * 0.006, -1.42, 1.42);
    draw();
  });
  const finishDrag = () => { dragging = false; pointer = null; if (!reducedMotion) startFrame(); };
  canvas.addEventListener('pointerup', finishDrag);
  canvas.addEventListener('pointercancel', finishDrag);

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      resize();
      startFrame();
    }
  }, { threshold: 0.05 });
  observer.observe(root);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  selectRegion(active);
}
