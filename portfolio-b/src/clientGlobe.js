/*
 * Client globe: a particle globe of the world's land, with the countries I've
 * worked with lit up in their own colours. Particles stream in from a loose
 * cloud and settle into the globe when the section scrolls into view; arcs fly
 * from home (India, marked with a pulsing beacon) to each client country, with
 * a particle trail behind each spark and a slow drifting particle halo around
 * the globe. Drag to spin; hover or pick a country to turn the globe towards it
 * and show its client count.
 */
import * as THREE from 'three';
import { LAND, REGIONS, CENTROIDS } from './globeDots.js';

const RADIUS = 1;
const HOME = [77.6, 12.97]; // arcs start here; not labelled on the page
const DEG = Math.PI / 180;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));

function toXYZ(lon, lat, r = RADIUS) {
  const la = lat * DEG;
  const lo = lon * DEG;
  return new THREE.Vector3(Math.cos(la) * Math.sin(lo) * r, Math.sin(la) * r, Math.cos(la) * Math.cos(lo) * r);
}

const vert = /* glsl */ `
  attribute vec3 aStart;
  attribute float aRegion;
  attribute float aRand;
  attribute vec3 aColor;
  uniform float uProgress;
  uniform float uTime;
  uniform float uActive;
  uniform float uSize;
  uniform float uPixel;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    // each particle starts a little later than the last, then eases in
    float t = clamp(uProgress * 1.5 - aRand * 0.5, 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 3.0);
    vec3 p = mix(aStart, position, t);
    bool isRegion = aRegion > 0.5;
    bool isActive = isRegion && abs(aRegion - uActive) < 0.5;
    float pulse = isActive ? 1.0 + 0.45 * (0.5 + 0.5 * sin(uTime * 3.0 + aRand * 6.2831)) : 1.0;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // dots on the far side of the globe fade back
    vec3 n = normalize(normalMatrix * position);
    float facing = smoothstep(-0.25, 0.35, n.z);
    vAlpha = mix(isRegion ? 0.22 : 0.06, isRegion ? 1.0 : 0.72, facing) * (0.35 + 0.65 * t);
    // land dots shimmer gently once settled
    if (!isRegion) vAlpha *= 0.82 + 0.18 * sin(uTime * 1.7 + aRand * 40.0);
    if (isActive) vAlpha = min(1.0, vAlpha * 1.2);
    vColor = aColor;
    gl_PointSize = uSize * (isRegion ? 1.55 : 1.0) * pulse * uPixel * (3.6 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;

const frag = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.32, 0.5, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }`;

// halo: particles drifting round the globe on tilted orbits, twinkling
const haloVert = /* glsl */ `
  attribute float aRand;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform float uPixel;
  varying float vAlpha;
  varying float vTint;
  void main() {
    float a = uTime * aSpeed;
    float c = cos(a);
    float s = sin(a);
    vec3 p = vec3(position.x * c - position.z * s, position.y, position.x * s + position.z * c);
    p *= mix(2.4, 1.0, smoothstep(0.0, 1.0, uProgress));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vAlpha = (0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * 2.0 + aRand * 30.0))) * smoothstep(0.1, 0.8, uProgress);
    vTint = aRand;
    gl_PointSize = uSize * (0.6 + aRand) * uPixel * (3.6 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;
const haloFrag = /* glsl */ `
  varying float vAlpha;
  varying float vTint;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.0, 0.5, d);
    vec3 col = mix(vec3(0.957, 0.949, 0.933), vec3(0.714, 0.604, 0.961), step(0.7, vTint));
    gl_FragColor = vec4(col, a * a * vAlpha * 0.8);
  }`;

export function createClientGlobe({ root, regions, reduced, onFocus }) {
  const stage = root.querySelector('[data-globe-stage]');
  const canvas = root.querySelector('[data-globe-canvas]');
  const pins = new Map([...root.querySelectorAll('[data-pin]')].map((el) => [el.dataset.pin, el]));

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  const pixel = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixel);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 4.4);

  const globe = new THREE.Group();
  scene.add(globe);

  /* ---------------------------------------------------------- particles */
  const codes = regions.map((r) => r.code);
  const land = new THREE.Color('#f4f2ee');
  const count = LAND.length / 2 + codes.reduce((n, c) => n + (REGIONS[c]?.length || 0) / 2, 0);
  const pos = new Float32Array(count * 3);
  const start = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const reg = new Float32Array(count);
  const rnd = new Float32Array(count);
  let i = 0;
  const push = (lon, lat, color, regionIndex) => {
    const p = toXYZ(lon, lat, regionIndex ? RADIUS * 1.004 : RADIUS);
    pos.set([p.x, p.y, p.z], i * 3);
    // start from a loose shell around the globe, so particles stream inwards
    const s = p.clone().multiplyScalar(1.8 + Math.random() * 1.6).add(new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2));
    start.set([s.x, s.y, s.z], i * 3);
    col.set([color.r, color.g, color.b], i * 3);
    reg[i] = regionIndex;
    rnd[i] = Math.random();
    i++;
  };
  for (let k = 0; k < LAND.length; k += 2) push(LAND[k], LAND[k + 1], land, 0);
  regions.forEach((r, ri) => {
    const c = new THREE.Color(r.color);
    const pts = REGIONS[r.code] || [];
    for (let k = 0; k < pts.length; k += 2) push(pts[k], pts[k + 1], c, ri + 1);
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aRegion', new THREE.BufferAttribute(reg, 1));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
  const uniforms = {
    uProgress: { value: reduced ? 1 : 0 },
    uTime: { value: 0 },
    uActive: { value: 1 },
    uSize: { value: 2.3 },
    uPixel: { value: pixel },
  };
  const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthWrite: false });
  const points = new THREE.Points(geo, mat);
  points.renderOrder = 1;
  globe.add(points);

  // a faint solid core so the back of the globe reads as a sphere
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 0.985, 48, 32),
    new THREE.MeshBasicMaterial({ color: 0x1b1922 }),
  );
  // drawn first and writes depth, so dots on the far side sit behind it
  core.renderOrder = -1;
  globe.add(core);

  const haloCount = reduced ? 0 : 1800;
  const hPos = new Float32Array(haloCount * 3);
  const hRand = new Float32Array(haloCount);
  const hSpeed = new Float32Array(haloCount);
  for (let k = 0; k < haloCount; k++) {
    // denser near the surface, thinning out with distance
    const r = RADIUS * (1.06 + Math.pow(Math.random(), 2.2) * 0.75);
    const v = new THREE.Vector3().randomDirection().multiplyScalar(r);
    v.y *= 0.82;
    hPos.set([v.x, v.y, v.z], k * 3);
    hRand[k] = Math.random();
    hSpeed[k] = (0.04 + Math.random() * 0.12) * (Math.random() < 0.18 ? -1 : 1);
  }
  const haloGeo = new THREE.BufferGeometry();
  haloGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
  haloGeo.setAttribute('aRand', new THREE.BufferAttribute(hRand, 1));
  haloGeo.setAttribute('aSpeed', new THREE.BufferAttribute(hSpeed, 1));
  const haloUniforms = { uTime: uniforms.uTime, uProgress: uniforms.uProgress, uSize: { value: 2.6 }, uPixel: uniforms.uPixel };
  const halo = new THREE.Points(
    haloGeo,
    new THREE.ShaderMaterial({ vertexShader: haloVert, fragmentShader: haloFrag, uniforms: haloUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  halo.renderOrder = 3;
  halo.rotation.z = 0.22;
  scene.add(halo);

  /* ---------------------------------------------------------- arcs */
  const home = toXYZ(HOME[0], HOME[1]);
  const TRAIL = 22;
  const arcs = regions.map((r, ri) => {
    const [lon, lat] = CENTROIDS[r.code];
    const end = toXYZ(lon, lat);
    if (r.home) return { end, code: r.code, home: true };
    const lift = 1 + 0.35 * home.distanceTo(end);
    const mid = home.clone().add(end).normalize().multiplyScalar(lift);
    const curve = new THREE.QuadraticBezierCurve3(home, mid, end);
    const linePts = curve.getPoints(80);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: r.color, transparent: true, opacity: 0.55 }));
    line.renderOrder = 2;
    lineGeo.setDrawRange(0, 0);
    globe.add(line);
    // a bright spark travels each arc
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8), new THREE.MeshBasicMaterial({ color: r.color }));
    globe.add(spark);
    // particle trail: points that follow the spark, shrinking and fading
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
    const trail = new THREE.Points(
      trailGeo,
      new THREE.PointsMaterial({ color: r.color, size: 0.022, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    trail.renderOrder = 2;
    globe.add(trail);
    return { curve, line, spark, trail, end, offset: ri / regions.length, code: r.code };
  });

  // home beacon: rings ripple out from India
  const homeRegion = regions.find((r) => r.home);
  const beacons = [];
  if (homeRegion) {
    const at = toXYZ(...CENTROIDS[homeRegion.code], RADIUS * 1.01);
    for (let k = 0; k < 3; k++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.9, 1, 48),
        new THREE.MeshBasicMaterial({ color: homeRegion.color, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
      );
      ring.position.copy(at);
      ring.lookAt(at.clone().multiplyScalar(2));
      ring.renderOrder = 2;
      globe.add(ring);
      beacons.push({ ring, offset: k / 3 });
    }
  }

  /* ---------------------------------------------------------- state */
  const state = {
    rotY: -HOME[0] * DEG + 0.9,
    rotX: 0.35,
    targetY: null,
    targetX: null,
    vel: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    idleUntil: 0,
    active: codes[0],
    hover: null,
    intro: reduced ? 1 : 0,
    started: reduced,
    running: false,
    w: 1,
    h: 1,
  };

  // highlight a country; with rotate, also turn the globe to face it
  function focus(code, { fromUser = true, rotate = true } = {}) {
    const idx = codes.indexOf(code);
    if (idx < 0) return;
    state.active = code;
    uniforms.uActive.value = idx + 1;
    onFocus?.(code, fromUser);
    if (!rotate) return;
    const [lon, lat] = CENTROIDS[code];
    // turn the shortest way round to face the country
    let ty = -lon * DEG;
    while (ty - state.rotY > Math.PI) ty -= Math.PI * 2;
    while (ty - state.rotY < -Math.PI) ty += Math.PI * 2;
    state.targetY = ty;
    state.targetX = clamp(lat * DEG * 0.85, -0.7, 0.7);
    state.vel = 0;
    state.idleUntil = performance.now() + 5000;
  }

  /* ---------------------------------------------------------- input */
  const onDown = (e) => {
    state.dragging = true;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    state.targetY = state.targetX = null;
    canvas.setPointerCapture?.(e.pointerId);
    stage.classList.add('is-dragging');
  };
  const onMove = (e) => {
    const r = stage.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    if (state.dragging) {
      const dx = e.clientX - state.lastX;
      const dy = e.clientY - state.lastY;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      state.rotY += dx * 0.008;
      state.rotX = clamp(state.rotX + dy * 0.006, -0.8, 0.8);
      state.vel = dx * 0.008 * 60;
      state.idleUntil = performance.now() + 3000;
      return;
    }
    // hover: nearest visible country centre under the pointer
    let best = null;
    let bestD = 64;
    for (const p of projected) {
      if (!p.visible) continue;
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < bestD) {
        bestD = d;
        best = p.code;
      }
    }
    if (best !== state.hover) {
      state.hover = best;
      stage.classList.toggle('is-pointing', !!best);
      // hovering only highlights; the globe turns on click
      if (best && best !== state.active) focus(best, { rotate: false });
      if (best) state.idleUntil = performance.now() + 2500;
    }
  };
  const onUp = (e) => {
    if (!state.dragging) return;
    state.dragging = false;
    canvas.releasePointerCapture?.(e.pointerId);
    stage.classList.remove('is-dragging');
  };
  const onClick = () => state.hover && focus(state.hover);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('pointerleave', () => {
    state.hover = null;
    stage.classList.remove('is-pointing');
  });

  /* ---------------------------------------------------------- loop */
  const projected = regions.map((r) => ({ code: r.code, x: 0, y: 0, visible: false }));
  const tmp = new THREE.Vector3();
  const timer = new THREE.Timer();
  let raf = 0;

  function resize() {
    const r = stage.getBoundingClientRect();
    state.w = Math.max(1, r.width);
    state.h = Math.max(1, r.height);
    renderer.setSize(state.w, state.h, false);
    camera.aspect = state.w / state.h;
    camera.updateProjectionMatrix();
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    timer.update();
    const dt = Math.min(timer.getDelta(), 1 / 20);
    const t = timer.getElapsed();
    uniforms.uTime.value = t;

    if (state.started && state.intro < 1) state.intro = Math.min(1, state.intro + dt / 2.6);
    uniforms.uProgress.value = state.intro;

    // rotation: drag, inertia, focus target, then a slow idle spin
    if (!state.dragging) {
      if (state.targetY != null) {
        state.rotY = damp(state.rotY, state.targetY, 3.2, dt);
        state.rotX = damp(state.rotX, state.targetX, 3.2, dt);
      } else {
        state.vel = damp(state.vel, 0, 2.2, dt);
        state.rotY += state.vel * dt;
        if (!reduced && performance.now() > state.idleUntil) state.rotY += dt * 0.12;
        state.rotX = damp(state.rotX, 0.3, 0.6, dt);
      }
      if (state.targetY != null && performance.now() > state.idleUntil) state.targetY = state.targetX = null;
    }
    globe.rotation.set(state.rotX, state.rotY, 0, 'XYZ');

    // arcs draw in after the globe settles, then sparks travel along them
    const arcK = reduced ? 1 : clamp((state.intro - 0.55) / 0.45, 0, 1);
    for (const a of arcs) {
      if (a.home) continue;
      a.line.geometry.setDrawRange(0, Math.floor(81 * arcK));
      const u = reduced ? 1 : (t * 0.22 + a.offset) % 1;
      a.spark.visible = a.trail.visible = arcK >= 1;
      a.spark.position.copy(a.curve.getPoint(u));
      a.line.material.opacity = a.code === state.active ? 0.9 : 0.35;
      if (a.trail.visible && !reduced) {
        const arr = a.trail.geometry.attributes.position.array;
        for (let k = 0; k < TRAIL; k++) {
          a.curve.getPoint(Math.max(0, u - k * 0.009), tmp);
          // scatter the tail a little so it reads as particles, not a line
          const j = k * 0.0012;
          arr[k * 3] = tmp.x + Math.sin(t * 9 + k * 1.7) * j;
          arr[k * 3 + 1] = tmp.y + Math.cos(t * 7 + k * 2.3) * j;
          arr[k * 3 + 2] = tmp.z + Math.sin(t * 8 + k * 3.1) * j;
        }
        a.trail.geometry.attributes.position.needsUpdate = true;
        a.trail.material.opacity = a.code === state.active ? 0.85 : 0.45;
      }
    }
    for (const b of beacons) {
      const k = reduced ? 0.5 : (t * 0.45 + b.offset) % 1;
      const sc = 0.02 + k * 0.11;
      b.ring.scale.set(sc, sc, sc);
      b.ring.material.opacity = (1 - k) * 0.8 * clamp(state.intro * 2 - 1, 0, 1);
    }

    // country pins follow their centre on screen
    globe.updateMatrixWorld();
    projected.forEach((p, k) => {
      const a = arcs[k];
      tmp.copy(a.end).applyMatrix4(globe.matrixWorld);
      const facing = tmp.clone().normalize().dot(camera.position.clone().normalize());
      tmp.project(camera);
      p.x = (tmp.x * 0.5 + 0.5) * state.w;
      p.y = (-tmp.y * 0.5 + 0.5) * state.h;
      p.visible = facing > 0.15 && state.intro > 0.7;
      const pin = pins.get(p.code);
      if (pin) {
        pin.style.transform = `translate(${p.x}px, ${p.y}px)`;
        pin.classList.toggle('is-visible', p.visible);
        pin.classList.toggle('is-active', p.code === state.active);
      }
    });

    renderer.render(scene, camera);
  }

  function startLoop() {
    if (state.running) return;
    state.running = true;
    timer.update();
    raf = requestAnimationFrame(frame);
  }
  function stopLoop() {
    state.running = false;
    cancelAnimationFrame(raf);
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        state.started = true;
        startLoop();
      } else stopLoop();
    },
    { threshold: 0.15 },
  );
  io.observe(stage);
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();
  focus(codes[0], { fromUser: false });
  state.idleUntil = 0;
  state.targetY = state.targetX = null;

  return { focus, destroy: () => (stopLoop(), io.disconnect(), ro.disconnect(), renderer.dispose()) };
}
