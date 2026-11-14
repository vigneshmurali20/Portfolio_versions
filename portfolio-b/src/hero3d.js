import * as THREE from 'three';
import { createHeroWorld } from './heroWorld.js';
import { createHeroForeground } from './heroForeground.js';

/*
 * The hero is three independent layers in one Three.js scene, each a named
 * Group at its own depth, so one moving camera gives real parallax:
 *
 *   background  the lidar forest clearing, far behind (heroWorld.js)
 *   subject     the portrait as a halftone point cloud plus the tool ring,
 *               on the z = 0 plane that maps 1:1 to the DOM portrait rect
 *   foreground  dust, specks and blurred leaves near the lens (heroForeground.js)
 *
 * The layers are exposed on hero.heroLayers so later passes (GSAP, page
 * transitions) can animate each one on its own.
 */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const damp = (a, b, dt, k = 5) => a + (b - a) * (1 - Math.exp(-k * dt));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image(); image.decoding = 'async';
  image.onload = () => resolve(image); image.onerror = reject; image.src = src;
});
const texture = (image) => {
  const map = image instanceof HTMLCanvasElement ? new THREE.CanvasTexture(image) : new THREE.Texture(image);
  map.colorSpace = THREE.SRGBColorSpace; map.needsUpdate = true; return map;
};

// Normalize every mark into the same transparent square.
function logoTexture(image) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const size = 208; const k = Math.min(size / image.width, size / image.height);
  ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 8;
  ctx.drawImage(image, (256 - image.width * k) / 2, (256 - image.height * k) / 2 - 4, image.width * k, image.height * k);
  return texture(canvas);
}

/* ---------------------------------------------------------------- subject
   Sample the cutout on a grid. Each cell becomes one dot whose size follows
   the cell's brightness (a halftone), and a scatter of loose square pixels
   breaks off the silhouette edge, like the reference poster. */
function halftone(photo, cols) {
  const rows = Math.round(cols * photo.height / photo.width);
  const c = document.createElement('canvas'); c.width = cols; c.height = rows;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(photo, 0, 0, cols, rows);
  const px = ctx.getImageData(0, 0, cols, rows).data;
  const alpha = (x, y) => (x < 0 || y < 0 || x >= cols || y >= rows ? 0 : px[(y * cols + x) * 4 + 3]);
  const pos = [], size = [], kind = [], seed = [];
  let s = 99;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      if (px[i + 3] < 110) continue;
      const lum = (px[i] * 0.2126 + px[i + 1] * 0.7152 + px[i + 2] * 0.0722) / 255;
      // lift the dark knit so its texture reads as fine dots, keep skin bright
      const v = Math.pow(clamp((lum - 0.04) / 0.8, 0, 1), 0.8);
      // alternate rows sit a half cell over: the classic screen pattern
      const ox = (y % 2) * 0.5;
      const u = (x + 0.5 + ox) / cols - 0.5, w = 0.5 - (y + 0.5) / rows;
      pos.push(u, w, 0); size.push(0.14 + v * 0.95); kind.push(0); seed.push(rnd());
      // loose pixels shed from the edge, mostly to the left and downward
      const edge = alpha(x - 1, y) < 110 || alpha(x + 1, y) < 110 || alpha(x, y - 1) < 110;
      if (edge && rnd() < 0.55) {
        const n = 1 + Math.floor(rnd() * 3);
        for (let k = 0; k < n; k++) {
          const dx = (rnd() - 0.72) * 0.22, dy = (rnd() - 0.6) * 0.05;
          pos.push(u + dx, w + dy, 0); size.push(0.35 + rnd() * 0.6); kind.push(1); seed.push(rnd());
        }
      }
    }
  }
  return { pos, size, kind, seed, cols };
}

export function createHero3D({ canvas, hero, portraitImg, portraitSrc, cards, reduced, onReady, onFirstDrag, onHoverCard }) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0, 0);
  const mobile = () => matchMedia('(max-width: 860px)').matches;
  const pixelRatio = Math.min(devicePixelRatio || 1, mobile() ? 1.25 : 2);
  renderer.setPixelRatio(pixelRatio);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 10000);

  const background = createHeroWorld({ THREE, scene, reduced });
  const foreground = createHeroForeground({ THREE, scene, reduced });
  const subject = new THREE.Group(); subject.name = 'hero-subject'; scene.add(subject);

  const subjectUniforms = {
    uTime: { value: 0 }, uProgress: { value: 0 }, uIntro: { value: reduced ? 1 : 0 }, uAlpha: { value: 1 },
    uCell: { value: 3 }, uPointer: { value: new THREE.Vector3() },
  };
  const subjectMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: subjectUniforms,
    vertexShader: `
      uniform float uTime; uniform float uProgress; uniform float uIntro; uniform float uCell; uniform vec3 uPointer;
      attribute float aSize; attribute float aKind; attribute float aSeed;
      varying float vAlpha; varying float vKind;
      void main() {
        vec3 p = position;
        // assemble: every dot flies in from a scattered start
        float t = smoothstep(aSeed * 0.45, aSeed * 0.45 + 0.55, uIntro);
        vec2 dir = vec2(cos(aSeed * 40.0), sin(aSeed * 53.0));
        p.xy += dir * (1.0 - t) * (0.35 + aSeed * 0.6);
        // hover: dots part around the pointer
        vec2 away = p.xy - uPointer.xy;
        float hover = uPointer.z * exp(-length(away) * 14.0);
        p.xy += normalize(away + 1e-4) * hover * 0.06;
        // scroll: the figure dissolves into the scan
        p.xy += dir * uProgress * (0.04 + aSeed * 0.12);
        // loose pixels drift
        p.x += aKind * sin(uTime * 0.6 + aSeed * 30.0) * 0.006;
        p.y += aKind * mod(uTime * 0.01 + aSeed, 0.06);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = max(1.0, aSize * uCell * (1.0 + hover * 0.6));
        vKind = aKind;
        // legs fade into the ground of the scan
        vAlpha = t * smoothstep(-0.5, -0.24, position.y) * (aKind > 0.5 ? 0.55 : 1.0);
      }`,
    fragmentShader: `
      uniform float uAlpha; varying float vAlpha; varying float vKind;
      void main() {
        vec2 q = abs(gl_PointCoord - 0.5);
        // round halftone dots; loose edge pixels are square
        float d = vKind > 0.5 ? max(q.x, q.y) : length(q);
        if (d > 0.5) discard;
        float a = vKind > 0.5 ? 1.0 : 1.0 - smoothstep(0.36, 0.5, d);
        gl_FragColor = vec4(vec3(0.95, 0.955, 0.94), a * vAlpha * uAlpha);
      }`,
  });
  const subjectGeometry = new THREE.BufferGeometry();
  const subjectPoints = new THREE.Points(subjectGeometry, subjectMaterial);
  subjectPoints.frustumCulled = false; subjectPoints.renderOrder = 3; subject.add(subjectPoints);

  // a soft pool of shadow behind the figure separates it from the city
  const shadeMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: { uAlpha: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform float uAlpha; varying vec2 vUv; void main(){ vec2 q = (vUv - 0.5) * vec2(1.0, 1.25); float a = 1.0 - smoothstep(0.12, 0.5, length(q)); gl_FragColor = vec4(0.0, 0.004, 0.012, a * 0.82 * uAlpha); }',
  });
  const shadeGeometry = new THREE.PlaneGeometry(1, 1);
  const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
  shade.renderOrder = 2; subject.add(shade);

  const halo = new THREE.Group(); subject.add(halo);
  const logos = [];
  const state = {
    width: 1, height: 1, dist: 1, photo: { x: 0, y: 0, w: 1, h: 1 }, radius: 1, angle: 0, velocity: 0,
    intro: reduced ? 1 : 0, pointer: { x: 0, y: 0, inside: false }, look: { x: 0, y: 0 },
    dragging: false, lastX: 0, ready: false, visible: true, disposed: false,
  };
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered = null;
  let raf = 0;
  let previous = 0;
  let cols = 150;

  function layout() {
    const hr = hero.getBoundingClientRect();
    // the stage keeps the photo's own aspect ratio in CSS, so the DOM image
    // and the halftone share one undistorted rect
    const pr = portraitImg.getBoundingClientRect();
    state.width = Math.max(1, hr.width); state.height = Math.max(1, hr.height);
    renderer.setSize(state.width, state.height, false);
    camera.aspect = state.width / state.height;
    state.dist = state.height / 2 / Math.tan(Math.PI / 12);
    camera.far = state.dist * 12; camera.updateProjectionMatrix();
    state.photo = { x: pr.left - hr.left + pr.width / 2 - state.width / 2, y: state.height / 2 - (pr.top - hr.top + pr.height / 2), w: pr.width, h: pr.height };
    state.radius = clamp(pr.width * 0.2, mobile() ? 64 : 110, mobile() ? 86 : 150);
    subjectUniforms.uCell.value = pr.width / cols * pixelRatio * 1.05;
    background.resize(state.width, state.height);
    foreground.resize(state.width, state.height, state.dist);
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
  const leave = () => { state.pointer.inside = false; onHoverCard?.(false); };
  const down = (e) => {
    if (e.button !== 0 || reduced || e.pointerType === 'touch') return;
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
    const time = now / 1000;
    const hr = hero.getBoundingClientRect();
    const progress = reduced ? 0 : hero.dataset.cinemaPinned ? (hero.cinemaProgress || 0) : clamp(-hr.top / state.height, 0, 1);
    // wall-clock intro, so slow frames never stall the assembly
    if (!state.start) state.start = now;
    state.intro = reduced ? 1 : Math.min(1, (now - state.start) / 2600);
    const intro = 1 - Math.pow(1 - state.intro, 3);

    // one camera for all three layers: a slow drift plus the pointer gives
    // parallax by depth (foreground moves most, the forest least)
    if (!reduced) {
      state.look.x = damp(state.look.x, state.pointer.inside ? state.pointer.x : 0, dt, 2.5);
      state.look.y = damp(state.look.y, state.pointer.inside ? state.pointer.y : 0, dt, 2.5);
    }
    const drift = reduced ? 0 : Math.sin(time * 0.12);
    camera.position.set(
      (state.look.x * 0.022 + drift * 0.008) * state.dist,
      (state.look.y * 0.014 + progress * 0.03) * state.dist,
      state.dist,
    );
    camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, 0);

    background.update(time, progress, intro);
    foreground.update(time, progress, intro);

    const p = state.photo;
    const push = 1 + progress * 0.12;
    subjectPoints.scale.set(p.w * push, p.h * push, 1);
    subjectPoints.position.set(p.x, p.y - progress * state.height * 0.06, 0);
    shade.scale.set(p.w * 1.9, p.h * 1.15, 1);
    shade.position.set(subjectPoints.position.x, subjectPoints.position.y + p.h * 0.05, -1);
    shadeMaterial.uniforms.uAlpha.value = intro * (1 - progress);
    subjectUniforms.uTime.value = reduced ? 0 : time;
    subjectUniforms.uIntro.value = reduced ? 1 : clamp(state.intro * 1.15 - 0.1, 0, 1);
    subjectUniforms.uProgress.value = progress;
    subjectUniforms.uAlpha.value = 1 - smooth(0.55, 1, progress);
    const px = (state.pointer.x * state.width * 0.5 - p.x) / Math.max(1, p.w);
    const py = (state.pointer.y * state.height * 0.5 - p.y) / Math.max(1, p.h);
    subjectUniforms.uPointer.value.set(px, py, state.pointer.inside && Math.abs(px) < 0.65 && Math.abs(py) < 0.65 ? 1 : 0);

    // the tool ring: a hollow halo just above the crown
    const radius = state.radius * (1 + progress * 0.25);
    const headRoll = 0.12;
    const crownX = subjectPoints.position.x + (0.49 - 0.5) * p.w * push;
    const crownY = subjectPoints.position.y + (0.5 - 0.115) * p.h * push;
    const clearance = mobile() ? 30 : 46;
    halo.position.set(crownX - Math.sin(headRoll) * clearance, crownY + Math.cos(headRoll) * clearance, 0);
    if (!state.dragging && !reduced) { state.velocity = damp(state.velocity, 0, dt); state.angle += (0.12 + state.velocity) * dt; }
    const angle = state.angle + progress * 0.8;
    const fade = smooth(0.55, 1, state.intro) * (1 - smooth(0.6, 1, progress));
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
      item.mesh.position.set(rx, ry, z);
      const size = (mobile() ? 26 : 38) * (1 + item.hover * 0.16);
      item.mesh.scale.set(size, size, 1);
      // tools behind the head sink into the dark
      item.material.opacity = fade * (0.45 + 0.55 * (depth + 1) / 2);
      item.mesh.renderOrder = depth < 0 ? 2 : 4;
    });
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
    cols = mobile() ? 96 : 150;
    const h = halftone(photo, cols);
    subjectGeometry.setAttribute('position', new THREE.Float32BufferAttribute(h.pos, 3));
    subjectGeometry.setAttribute('aSize', new THREE.Float32BufferAttribute(h.size, 1));
    subjectGeometry.setAttribute('aKind', new THREE.Float32BufferAttribute(h.kind, 1));
    subjectGeometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(h.seed, 1));
    images.forEach(({ tool, image }) => {
      const material = new THREE.MeshBasicMaterial({ map: logoTexture(image), transparent: true, depthWrite: false, opacity: 0 });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
      mesh.userData.name = tool.name; halo.add(mesh); logos.push({ mesh, material, hover: 0 });
    });
    hero.heroLayers = { background: background.group, subject, foreground: foreground.group, camera };
    layout(); state.ready = true; onReady?.(); raf = requestAnimationFrame(frame);
  }).catch((error) => {
    document.documentElement.classList.add('no-gl');
    console.warn('Hero scene fallback:', error);
  });
  return { ready, renderer, destroy() {
    state.disposed = true; cancelAnimationFrame(raf); observer.disconnect(); resize.disconnect();
    background.destroy(); foreground.destroy();
    hero.removeEventListener('pointermove', point); hero.removeEventListener('pointerleave', leave);
    canvas.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
    subjectGeometry.dispose(); subjectMaterial.dispose(); shadeGeometry.dispose(); shadeMaterial.dispose();
    logos.forEach(({ mesh, material }) => { mesh.geometry.dispose(); material.map?.dispose(); material.dispose(); });
    renderer.dispose();
  } };
}
