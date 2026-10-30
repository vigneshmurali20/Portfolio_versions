import * as THREE from 'three';
import { createCloudAtmosphere } from './cloudAtmosphere.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const damp = (a, b, dt) => a + (b - a) * (1 - Math.exp(-5 * dt));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image(); image.decoding = 'async';
  image.onload = () => resolve(image); image.onerror = reject; image.src = src;
});
const texture = (image) => {
  const map = image instanceof HTMLCanvasElement ? new THREE.CanvasTexture(image) : new THREE.Texture(image);
  map.colorSpace = THREE.SRGBColorSpace; map.needsUpdate = true; return map;
};

// Normalize every mark into the same transparent square. No screenshots,
// cards or text panels: the silhouette of each actual tool logo stays clear.
function logoTexture(image) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const size = 208; const k = Math.min(size / image.width, size / image.height);
  ctx.shadowColor = 'rgba(28,32,36,0.17)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 8;
  ctx.drawImage(image, (256 - image.width * k) / 2, (256 - image.height * k) / 2 - 4, image.width * k, image.height * k);
  return texture(canvas);
}

export function createHero3D({ canvas, hero, portraitImg, portraitSrc, cards, reduced, onReady, onFirstDrag, onHoverCard }) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0, 0);
  const mobile = () => matchMedia('(max-width: 860px)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile() ? 1.25 : 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 10000);
  const atmosphere = createCloudAtmosphere({ scene, camera, hero, reduced });
  const portraitMaterial = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: reduced ? 1 : 0 });
  const portraitGeometry = new THREE.PlaneGeometry(1, 1);
  const portrait = new THREE.Mesh(portraitGeometry, portraitMaterial);
  portrait.renderOrder = 1; scene.add(portrait);
  const halo = new THREE.Group(); scene.add(halo);
  const logos = [];
  const state = { width: 1, height: 1, photo: { x: 0, y: 0, w: 1, h: 1 }, radius: 1, angle: 0, velocity: 0, intro: reduced ? 1 : 0, pointer: { x: 0, y: 0, inside: false }, dragging: false, lastX: 0, ready: false, visible: true, disposed: false };
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered = null;
  let raf = 0;
  let previous = 0;

  function layout() {
    const hr = hero.getBoundingClientRect(), pr = portraitImg.getBoundingClientRect();
    state.width = Math.max(1, hr.width); state.height = Math.max(1, hr.height);
    renderer.setSize(state.width, state.height, false);
    camera.aspect = state.width / state.height;
    const distance = state.height / 2 / Math.tan(Math.PI / 12);
    camera.position.set(0, 0, distance); camera.far = distance * 4; camera.updateProjectionMatrix();
    state.photo = { x: pr.left - hr.left + pr.width / 2 - state.width / 2, y: state.height / 2 - (pr.top - hr.top + pr.height / 2), w: pr.width, h: pr.height };
    state.radius = clamp(pr.width * 0.18, mobile() ? 84 : 135, mobile() ? 96 : 155);
  }

  function point(e) {
    if (e.pointerType === 'touch') return;
    const hr = hero.getBoundingClientRect();
    state.pointer.x = (e.clientX - hr.left) / state.width * 2 - 1;
    state.pointer.y = 1 - (e.clientY - hr.top) / state.height * 2;
    state.pointer.inside = true;
    if (state.dragging) {
      const delta = (e.clientX - state.lastX) / Math.max(1, state.radius);
      state.angle += delta; state.velocity = clamp(delta * 25, -1.5, 1.5); state.lastX = e.clientX;
    }
  }
  const leave = () => { state.pointer.inside = false; state.pointer.x = state.pointer.y = 0; onHoverCard?.(false); };
  const down = (e) => {
    if (e.button !== 0 || reduced) return;
    // Keep ordinary vertical touch scrolling intact; mouse drag spins the halo.
    if (e.pointerType === 'touch') return;
    state.dragging = true; state.lastX = e.clientX; state.velocity = 0;
    canvas.setPointerCapture?.(e.pointerId); onFirstDrag?.();
  };
  const up = (e) => { state.dragging = false; if (canvas.hasPointerCapture?.(e.pointerId)) canvas.releasePointerCapture(e.pointerId); };
  hero.addEventListener('pointermove', point, { passive: true }); hero.addEventListener('pointerleave', leave);
  canvas.addEventListener('pointerdown', down); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - previous) / 1000 || 0, 0.05); previous = now;
    if (!state.ready || document.hidden || !state.visible) return;
    const hr = hero.getBoundingClientRect();
    const progress = reduced ? 0 : hero.dataset.cinemaPinned ? (hero.cinemaProgress || 0) : clamp(-hr.top / state.height, 0, 1);
    state.intro = reduced ? 1 : Math.min(1, state.intro + dt / 1.6);
    const intro = 1 - Math.pow(1 - state.intro, 3);
    const push = 1 + progress * 0.2;
    const p = state.photo;
    portrait.scale.set(p.w * push, p.h * push, 1);
    portrait.position.set(p.x * (1 - smooth(0.1, 0.9, progress) * 0.65), p.y - progress * state.height * 0.08 - (1 - intro) * 20, 0);
    portraitMaterial.opacity = intro;

    // A genuinely hollow halo ABOVE the hair, with a clear center. Billboards
    // stay facing the camera while their x/y/z positions travel around it.
    const radius = state.radius * (1 + progress * 0.25);
    // Continue the head's tilted centerline through the crown. Centering the
    // halo vertically over the image instead puts its axis beside the head.
    const headRoll = 0.30;
    const crownX = portrait.position.x + (0.455 - 0.5) * p.w * push;
    const crownY = portrait.position.y + (0.5 - 0.075) * p.h * push;
    const clearance = mobile() ? 44 : 66;
    halo.position.set(crownX - Math.sin(headRoll) * clearance, crownY + Math.cos(headRoll) * clearance, 0);
    if (!state.dragging && !reduced) { state.velocity = damp(state.velocity, 0, dt); state.angle += (0.12 + state.velocity) * dt; }
    const angle = state.angle + progress * 0.8;
    const fade = intro * (1 - smooth(0.65, 1, progress));
    // Apply roll in projected coordinates below. Rotating an off-center
    // world-space ellipse shears its apparent axis on the desktop camera.
    halo.rotation.z = 0;
    if (!reduced && state.pointer.inside && !state.dragging) {
      ndc.set(state.pointer.x, state.pointer.y); raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(logos.map((item) => item.mesh))[0];
      const next = hit?.object || null;
      if (next !== hovered) { hovered = next; onHoverCard?.(next?.userData.name || false); }
    } else hovered = null;
    logos.forEach((item, i) => {
      const a = i / logos.length * Math.PI * 2 + angle;
      const depth = Math.sin(a);
      item.hover = damp(item.hover, item.mesh === hovered ? 1 : 0, dt);
      const x = Math.cos(a) * radius;
      const y = depth * radius * Math.cos(1.3);
      const z = depth * radius * Math.sin(1.3);
      const rx = x * Math.cos(headRoll) - y * Math.sin(headRoll);
      const ry = x * Math.sin(headRoll) + y * Math.cos(headRoll);
      const projection = (camera.position.z - z) / camera.position.z;
      item.mesh.position.set(
        (halo.position.x + rx) * projection - halo.position.x,
        (halo.position.y + ry) * projection - halo.position.y,
        z,
      );
      const size = (mobile() ? 30 : 44) * (1 + item.hover * 0.16);
      item.mesh.scale.set(size, size, 1);
      item.material.opacity = fade * (0.72 + 0.28 * (depth + 1) / 2);
      item.mesh.renderOrder = depth < 0 ? 2 : 4;
    });
    atmosphere.update(now / 1000, state, dt);
    renderer.render(scene, camera);
  }

  const observer = new IntersectionObserver(([entry]) => { state.visible = entry.isIntersecting; }); observer.observe(hero);
  const resize = new ResizeObserver(layout); resize.observe(hero);
  const ready = Promise.all([
    loadImage(portraitSrc),
    Promise.all(cards.map(async (tool) => ({ tool, image: await loadImage(tool.src) }))),
    document.fonts?.ready || Promise.resolve(),
  ]).then(([photo, images]) => {
    if (state.disposed) return;
    portraitMaterial.map = texture(photo); portraitMaterial.needsUpdate = true;
    images.forEach(({ tool, image }) => {
      const material = new THREE.MeshBasicMaterial({ map: logoTexture(image), transparent: true, depthWrite: false, opacity: 0 });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
      mesh.userData.name = tool.name; halo.add(mesh); logos.push({ mesh, material, hover: 0 });
    });
    layout(); state.ready = true; onReady?.(); raf = requestAnimationFrame(frame);
  }).catch((error) => {
    document.documentElement.classList.add('no-gl');
    console.warn('Tool halo fallback:', error);
  });
  return { ready, renderer, destroy() {
    state.disposed = true; cancelAnimationFrame(raf); observer.disconnect(); resize.disconnect();
    atmosphere.destroy();
    hero.removeEventListener('pointermove', point); hero.removeEventListener('pointerleave', leave);
    canvas.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
    portraitMaterial.map?.dispose(); portraitMaterial.dispose(); portraitGeometry.dispose();
    logos.forEach(({ mesh, material }) => { mesh.geometry.dispose(); material.map?.dispose(); material.dispose(); }); renderer.dispose();
  } };
}
