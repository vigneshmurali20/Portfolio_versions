/*
 * Hero scene: the portrait with a tilted ring of curved glass cards orbiting
 * the head (cards in front cover the face, cards behind are hidden by it),
 * plus flat tool icons that hide behind the portrait and come out when the
 * cursor is near it or the visitor scrolls.
 *
 * The camera is set up so one world unit is one CSS pixel at z = 0, which
 * keeps the portrait locked to the <img> it replaces.
 */
import * as THREE from 'three';

const FOV = 30;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));
const easeOut = (t) => 1 - Math.pow(1 - t, 4);

// where the head sits inside images/portrait-hero.png (fractions of the image)
// ring centre: below the chin, so the front of the ring passes over the chest
const HEAD = { x: 0.378, y: 0.46 };

export function canWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

/* --------------------------------------------------------------- shaders */
// Textures are uploaded without colour conversion and written out as-is, so
// the canvas colours match the CSS colours exactly.
const vert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = mv.xyz;
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }`;

const cardFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uHover;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    float a = t.a;
    vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
    vec3 col;
    if (gl_FrontFacing) {
      col = t.rgb;
    } else {
      // inside of the ring: plain frosted glass
      col = vec3(0.95, 0.945, 0.96);
      a = smoothstep(0.35, 0.9, a) * 0.62;
    }
    float facing = abs(dot(n, normalize(-vView)));
    // light falls off as the card turns away, so the curve reads as 3D
    col *= mix(0.82, 1.0, facing);
    col = mix(col, vec3(1.0), pow(1.0 - facing, 3.0) * 0.35 + uHover * 0.04);
    gl_FragColor = vec4(col, a * uOpacity);
  }`;

const portraitFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uDepthOnly;
  varying vec2 vUv;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    if (uDepthOnly > 0.5) {
      if (t.a < 0.5) discard;
      gl_FragColor = vec4(0.0);
      return;
    }
    gl_FragColor = vec4(t.rgb, t.a * uOpacity);
  }`;

const flatFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    gl_FragColor = vec4(t.rgb, t.a * uOpacity);
  }`;

/* --------------------------------------------------------------- card art */
const GLYPHS = {
  cursor: 'M6 4l13 6.5-5.6 1.9L11.5 18z',
  play: 'M8 5.5v13l11-6.5z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  shapes: 'M12 3l4.5 8h-9zM6.5 13.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM14 14h7v7h-7z',
  star: 'M12 2.5c.7 5 2.5 8.6 9.5 9.5-7 .9-8.8 4.5-9.5 9.5-.7-5-2.5-8.6-9.5-9.5 7-.9 8.8-4.5 9.5-9.5z',
};

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function textCardCanvas(card, w, h) {
  const s = 3; // texture scale
  const c = document.createElement('canvas');
  c.width = Math.round(w * s);
  c.height = Math.round(h * s);
  const g = c.getContext('2d');
  g.scale(s, s);
  const r = Math.min(18, h * 0.2);
  roundRect(g, 0.5, 0.5, w - 1, h - 1, r);
  g.fillStyle = 'rgba(255,255,255,0.86)';
  g.fill();
  g.lineWidth = 1;
  g.strokeStyle = 'rgba(17,16,20,0.08)';
  g.stroke();

  const pad = h * 0.16;
  const chip = h * 0.36;
  roundRect(g, pad, pad, chip, chip, chip * 0.3);
  g.fillStyle = card.tint;
  g.fill();
  g.save();
  g.translate(pad + chip * 0.2, pad + chip * 0.2);
  g.scale((chip * 0.6) / 24, (chip * 0.6) / 24);
  g.fillStyle = card.ink;
  g.fill(new Path2D(GLYPHS[card.icon]));
  g.restore();

  g.fillStyle = '#111014';
  g.font = `650 ${h * 0.2}px "Urbanist Variable", Urbanist, sans-serif`;
  g.textBaseline = 'alphabetic';
  g.fillText(card.title, pad + chip + h * 0.1, pad + chip * 0.72);
  g.fillStyle = '#625f6b';
  g.font = `500 ${h * 0.13}px "Urbanist Variable", Urbanist, sans-serif`;
  g.fillText(card.sub, pad, h - pad * 0.95, w - pad * 2);
  return c;
}

function imageCardCanvas(img, w, h) {
  const s = 3;
  const c = document.createElement('canvas');
  c.width = Math.round(w * s);
  c.height = Math.round(h * s);
  const g = c.getContext('2d');
  g.scale(s, s);
  const r = Math.min(18, w * 0.14);
  roundRect(g, 0.5, 0.5, w - 1, h - 1, r);
  g.fillStyle = 'rgba(255,255,255,0.7)';
  g.fill();
  const inset = 5;
  g.save();
  roundRect(g, inset, inset, w - inset * 2, h - inset * 2, r - 3);
  g.clip();
  // cover-fit, keeping the left of the artwork (titles live there)
  const iw = w - inset * 2;
  const ih = h - inset * 2;
  const k = Math.max(iw / img.width, ih / img.height);
  g.drawImage(img, inset, inset + (ih - img.height * k) / 2, img.width * k, img.height * k);
  g.restore();
  roundRect(g, 0.5, 0.5, w - 1, h - 1, r);
  g.strokeStyle = 'rgba(255,255,255,0.9)';
  g.lineWidth = 1;
  g.stroke();
  return c;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function rawTexture(source, renderer) {
  const tex = source instanceof HTMLCanvasElement ? new THREE.CanvasTexture(source) : new THREE.Texture(source);
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  tex.needsUpdate = true;
  return tex;
}

// A plane bent onto a cylinder of radius R, centred at angle 0 (facing +z).
function curvedPlane(w, h, R) {
  const geo = new THREE.PlaneGeometry(w, h, 24, 1);
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    const a = pos.getX(i) / R;
    pos.setXYZ(i, Math.sin(a) * R, pos.getY(i), Math.cos(a) * R);
    nor.setXYZ(i, Math.sin(a), 0, Math.cos(a));
  }
  pos.needsUpdate = true;
  geo.computeBoundingSphere();
  return geo;
}

/* --------------------------------------------------------------- scene */
export function createHero3D({ canvas, hero, portraitImg, portraitSrc, cards, tools, reduced, onReady, onFirstDrag, onHoverCard }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 10000);

  const state = {
    W: 1,
    H: 1,
    R: 260,
    head: new THREE.Vector3(),
    portrait: { x: 0, y: 0, w: 1, h: 1, left: 0, top: 0 },
    pointer: { x: -9999, y: -9999, nx: 0, ny: 0, inside: false },
    angle: 0,
    vel: 0,
    dragging: false,
    dragged: false,
    lastX: 0,
    intro: reduced ? 1 : 0,
    visible: true,
    running: false,
    ready: false,
  };

  /* portrait: a depth-only pass so cards behind the head are hidden, then
     the colour pass with soft edges */
  const portraitGeo = new THREE.PlaneGeometry(1, 1);
  const portraitUniforms = { uMap: { value: null }, uOpacity: { value: 0 }, uDepthOnly: { value: 1 } };
  const portraitDepth = new THREE.Mesh(
    portraitGeo,
    new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: portraitFrag, uniforms: portraitUniforms, colorWrite: false }),
  );
  portraitDepth.renderOrder = 0;
  const colorUniforms = { uMap: portraitUniforms.uMap, uOpacity: portraitUniforms.uOpacity, uDepthOnly: { value: 0 } };
  const portraitColor = new THREE.Mesh(
    portraitGeo,
    new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: portraitFrag, uniforms: colorUniforms, transparent: true, depthWrite: false }),
  );
  portraitColor.renderOrder = 2;
  const portraitGroup = new THREE.Group();
  portraitGroup.add(portraitDepth, portraitColor);
  portraitGroup.visible = false;
  scene.add(portraitGroup);

  /* the ring */
  const ringTilt = new THREE.Group();
  const ringSpin = new THREE.Group();
  ringTilt.add(ringSpin);
  scene.add(ringTilt);
  const cardItems = [];

  /* tool icons */
  const iconGeo = new THREE.PlaneGeometry(1, 1);
  const icons = [];

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered = null;

  function layout() {
    const hr = hero.getBoundingClientRect();
    const pr = portraitImg.getBoundingClientRect();
    state.W = Math.max(1, hr.width);
    state.H = Math.max(1, hr.height);
    renderer.setSize(state.W, state.H, false);
    camera.aspect = state.W / state.H;
    const dist = state.H / 2 / Math.tan((FOV * Math.PI) / 360);
    camera.position.set(0, 0, dist);
    camera.near = Math.max(1, dist * 0.05);
    camera.far = dist * 4;
    camera.updateProjectionMatrix();

    const left = pr.left - hr.left;
    const top = pr.top - hr.top;
    state.portrait = { left, top, w: pr.width, h: pr.height, x: left + pr.width / 2 - state.W / 2, y: state.H / 2 - (top + pr.height / 2) };
    portraitGroup.position.set(state.portrait.x, state.portrait.y, 0);
    portraitGroup.scale.set(pr.width, pr.height, 1);

    state.head.set(left + pr.width * HEAD.x - state.W / 2, state.H / 2 - (top + pr.height * HEAD.y), 0);
    const R = clamp(Math.min(pr.width * 0.5, state.W * 0.4), 130, 320);
    if (Math.abs(R - state.R) > 1 || !cardItems.length) {
      state.R = R;
      buildCards();
    }
    buildIconTargets();
  }

  let cardImages = [];
  let buildToken = 0;
  async function buildCards() {
    const token = ++buildToken;
    const R = state.R;
    if (!cardImages.length) cardImages = await Promise.all(cards.map((c) => (c.type === 'image' ? loadImage(c.src) : null)));
    if (token !== buildToken) return;
    // clear the old ring
    for (const item of cardItems) {
      item.mesh.geometry.dispose();
      item.mat.uniforms.uMap.value?.dispose();
      item.mat.dispose();
      ringSpin.remove(item.pivot);
    }
    cardItems.length = 0;
    const n = cards.length;
    cards.forEach((card, i) => {
      const isImg = card.type === 'image';
      const w = isImg ? R * 0.4 : R * 0.58;
      const h = isImg ? R * 0.5 : R * 0.34;
      const art = isImg ? imageCardCanvas(cardImages[i], w, h) : textCardCanvas(card, w, h);
      const mat = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: cardFrag,
        uniforms: { uMap: { value: rawTexture(art, renderer) }, uOpacity: { value: 1 }, uHover: { value: 0 } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(curvedPlane(w, h, R), mat);
      const pivot = new THREE.Group();
      pivot.rotation.y = (i / n) * Math.PI * 2;
      // alternate heights so the ring feels hand-placed, not machined
      const lift = [0, 0.16, -0.1, 0.12, -0.06, 0.18, -0.12, 0.06, -0.02][i % 9] * R;
      mesh.position.y = lift;
      pivot.add(mesh);
      ringSpin.add(pivot);
      cardItems.push({ mesh, pivot, mat, hover: 0, lift, seed: i * 1.7 });
    });
    if (!state.ready) markReady();
  }

  /* icons hide behind the chest and come out to either side */
  const ICON_SPOTS = [
    // [side offset (x, in portrait widths from the body centre), y (portrait heights from top), size]
    [-0.62, 0.46, 0.105],
    [0.66, 0.4, 0.1],
    [-0.74, 0.74, 0.09],
    [0.8, 0.7, 0.095],
    [-0.5, 0.95, 0.08],
    [0.56, 0.98, 0.085],
  ];
  async function buildIcons() {
    const imgs = await Promise.all(tools.slice(0, ICON_SPOTS.length).map((t) => loadImage(t.src)));
    imgs.forEach((img, i) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: flatFrag,
        uniforms: { uMap: { value: rawTexture(img, renderer) }, uOpacity: { value: 0 } },
        transparent: true,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(iconGeo, mat);
      mesh.visible = false;
      scene.add(mesh);
      icons.push({ mesh, mat, i, reveal: 0, spot: ICON_SPOTS[i], origin: new THREE.Vector3(), target: new THREE.Vector3(), size: 40 });
    });
    buildIconTargets();
  }
  function buildIconTargets() {
    const p = state.portrait;
    const bodyX = p.left + p.w * 0.5 - state.W / 2;
    for (const ic of icons) {
      const [dx, dy, size] = ic.spot;
      ic.size = clamp(p.h * size * 1.25, 36, 76);
      const spread = state.W < 700 ? 0.7 : 1;
      let x = bodyX + dx * p.w * spread;
      const half = ic.size / 2 + 10;
      x = clamp(x, -state.W / 2 + half, state.W / 2 - half);
      const y = state.H / 2 - (p.top + p.h * Math.min(dy, 0.92));
      ic.target.set(x, y, 60);
      ic.origin.set(bodyX + dx * p.w * 0.18, state.H / 2 - (p.top + p.h * 0.78), -40);
    }
  }

  function markReady() {
    state.ready = true;
    onReady?.();
  }

  /* --------------------------------------------------------- input */
  function setPointer(e) {
    const hr = hero.getBoundingClientRect();
    state.pointer.x = e.clientX - hr.left;
    state.pointer.y = e.clientY - hr.top;
    state.pointer.nx = (state.pointer.x / state.W) * 2 - 1;
    state.pointer.ny = -(state.pointer.y / state.H) * 2 + 1;
  }
  const onMove = (e) => {
    setPointer(e);
    state.pointer.inside = true;
    if (state.dragging) {
      const dx = e.clientX - state.lastX;
      state.lastX = e.clientX;
      const k = 1 / state.R;
      state.angle += dx * k;
      state.vel = clamp(dx * k * 60, -8, 8);
      if (Math.abs(dx) > 2 && !state.dragged) {
        state.dragged = true;
        onFirstDrag?.();
      }
    }
  };
  const onLeave = () => {
    state.pointer.inside = false;
    state.pointer.x = state.pointer.y = -9999;
    if (hovered) setHovered(null);
  };
  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    setPointer(e);
    state.dragging = true;
    state.lastX = e.clientX;
    state.vel = 0;
    canvas.setPointerCapture?.(e.pointerId);
    hero.classList.add('is-dragging');
  };
  const onUp = (e) => {
    if (!state.dragging) return;
    state.dragging = false;
    canvas.releasePointerCapture?.(e.pointerId);
    hero.classList.remove('is-dragging');
  };
  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);

  function setHovered(item) {
    hovered = item;
    onHoverCard?.(!!item);
  }

  /* --------------------------------------------------------- loop */
  const portraitReady = loadImage(portraitSrc).then((img) => {
    portraitUniforms.uMap.value = rawTexture(img, renderer);
    portraitGroup.visible = true;
  });

  const timer = new THREE.Timer();
  const tmp = new THREE.Vector3();
  let raf = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    timer.update();
    const dt = Math.min(timer.getDelta(), 1 / 20);
    const t = timer.getElapsed();
    if (!state.ready || !portraitGroup.visible) return;

    const hr = hero.getBoundingClientRect();
    const p = clamp(-hr.top / Math.max(1, hr.height), 0, 1);
    const scrollK = reduced ? 0 : p;

    state.intro = reduced ? 1 : Math.min(1, state.intro + dt / 2.2);
    const intro = easeOut(state.intro);

    // spin: idle drift, drag, then inertia
    if (!state.dragging) {
      state.vel = damp(state.vel, 0, 1.6, dt);
      const idle = reduced ? 0 : 0.14;
      state.angle += (state.vel + idle) * dt;
    }

    // portrait
    portraitUniforms.uOpacity.value = intro;
    portraitGroup.position.y = state.portrait.y - (1 - intro) * 30 - scrollK * state.H * 0.08;
    portraitGroup.rotation.y = damp(portraitGroup.rotation.y, reduced ? 0 : state.pointer.nx * 0.05, 3, dt);

    // ring
    const R = state.R;
    ringTilt.position.copy(state.head);
    ringTilt.position.y = state.head.y - (1 - intro) * 30 - scrollK * state.H * 0.08;
    ringTilt.rotation.x = 0.34 + scrollK * 0.5 + (reduced ? 0 : state.pointer.ny * 0.04);
    ringTilt.rotation.z = -0.12 + (reduced ? 0 : state.pointer.nx * 0.05);
    const spread = (0.35 + 0.65 * intro) * (1 + scrollK * 0.7);
    ringTilt.scale.setScalar(spread);
    ringSpin.rotation.y = state.angle + (1 - intro) * -2.4 + scrollK * 1.6;
    const fade = intro * (1 - smooth(0.45, 0.95, scrollK));

    // hover: which card is under the pointer
    if (state.pointer.inside && !state.dragging) {
      ndc.set(state.pointer.nx, state.pointer.ny);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(
        cardItems.map((c) => c.mesh),
        false,
      )[0];
      const item = hit ? cardItems.find((c) => c.mesh === hit.object) : null;
      if (item !== hovered) setHovered(item);
    }

    for (const c of cardItems) {
      c.hover = damp(c.hover, c === hovered ? 1 : 0, 8, dt);
      c.mesh.position.y = c.lift + (reduced ? 0 : Math.sin(t * 0.8 + c.seed) * R * 0.025);
      // lift a hovered card out of the ring and toward the viewer
      c.mesh.position.z = c.hover * R * 0.14;
      c.mesh.scale.setScalar(1 + c.hover * 0.06);
      c.mat.uniforms.uHover.value = c.hover;
      c.mat.uniforms.uOpacity.value = fade;
      // cards behind the head draw before the portrait, the rest after it
      c.pivot.getWorldDirection(tmp);
      c.mesh.renderOrder = tmp.z >= 0 ? 3 : 1;
    }

    // tool icons
    const pr = state.portrait;
    const near =
      state.pointer.x >= pr.left - pr.w * 0.35 &&
      state.pointer.x <= pr.left + pr.w * 1.35 &&
      state.pointer.y >= pr.top - pr.h * 0.1 &&
      state.pointer.y <= pr.top + pr.h;
    const inHero = scrollK < 0.85 && intro > 0.9;
    const fly = reduced ? 0 : smooth(0.02, 0.6, p) * (1 - smooth(0.7, 0.85, p));
    const active = inHero && (near || fly > 0.02);
    for (const ic of icons) {
      ic.reveal = damp(ic.reveal, active ? 1 : 0, active ? 4 - ic.i * 0.3 : 3.5, dt);
      const e = ic.reveal * ic.reveal * (3 - 2 * ic.reveal);
      tmp.copy(ic.target);
      tmp.x += Math.sign(ic.target.x - ic.origin.x) * fly * 120;
      tmp.y += Math.sin(t * 1.1 + ic.i) * 6;
      tmp.z += fly * 380;
      ic.mesh.position.lerpVectors(ic.origin, tmp, e);
      ic.mesh.scale.setScalar(ic.size * (0.5 + 0.5 * e));
      ic.mesh.rotation.z = (1 - e) * (ic.i % 2 ? 0.5 : -0.5) + Math.sin(t * 0.9 + ic.i) * 0.06;
      ic.mat.uniforms.uOpacity.value = Math.min(1, e * 1.6);
      ic.mesh.visible = e > 0.01;
      ic.mesh.renderOrder = ic.mesh.position.z >= 0 ? 4 : 1;
    }

    renderer.render(scene, camera);
  }

  function start() {
    if (state.running) return;
    state.running = true;
    timer.update();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    state.running = false;
    cancelAnimationFrame(raf);
  }

  const io = new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting;
    if (state.visible && !document.hidden) start();
    else stop();
  });
  io.observe(hero);
  const onVis = () => (document.hidden ? stop() : state.visible && start());
  document.addEventListener('visibilitychange', onVis);

  let resizeRaf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(layout);
  });
  ro.observe(hero);

  const ready = Promise.all([portraitReady, document.fonts?.ready ?? Promise.resolve()]).then(() => {
    layout();
    buildIcons();
  });

  return {
    ready,
    renderer,
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      renderer.dispose();
    },
  };
}
