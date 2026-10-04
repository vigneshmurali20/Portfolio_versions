import * as THREE from 'three';
import * as S from './shaders.js';

const FOV = 35;
const CAM_Z = 10;
const VIEW_H = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const damp = (cur, target, lambda, dt) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));

// Chip positions around the portrait, measured from the second hero variant in
// Figma (node 1:13074): x/y relative to the portrait centre in portrait heights.
const CHIP_LAYOUT = {
  figma: [-0.42, -0.3, 0.19, 0.9],
  premiere: [-0.58, -0.06, 0.15, 0.5],
  photoshop: [-0.76, 0.14, 0.16, 1.1],
  illustrator: [-0.74, 0.38, 0.12, 0.4],
  framer: [0.38, -0.28, 0.18, 0.8],
  webflow: [0.6, -0.04, 0.14, 0.45],
  xd: [0.74, 0.17, 0.15, 1.05],
  aftereffects: [0.72, 0.4, 0.13, 0.6],
};

/** Branded studio environment for the chrome reflections. */
function makeEnvironment(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0816);
  const panel = (hex, intensity, w, h, pos) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(intensity), side: THREE.DoubleSide }),
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  panel('#ffffff', 7, 7, 1.6, [0, 5, 2]);
  panel('#b692f6', 4, 4, 5, [-6, 1, 1.5]);
  panel('#3de0ff', 3, 3, 5, [6, -1, 1]);
  panel('#7f56d9', 4, 9, 2, [0, -5, 0]);
  panel('#ffffff', 2.5, 2, 7, [3, 2, -6]);
  panel('#42307d', 3, 6, 6, [-3, -2, -6]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(scene, 0.03).texture;
  pmrem.dispose();
  scene.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      o.material.dispose();
    }
  });
  return tex;
}

function fullscreenQuad(material) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  m.frustumCulled = false;
  return m;
}

export function createStage({ bgCanvas, fxCanvas, heroEl, portraitEl, ctaEl, portraitSrc, tools, mobile, reduced }) {
  const state = {
    mouse: new THREE.Vector2(),
    mouseTarget: new THREE.Vector2(),
    mouseUv: new THREE.Vector2(0.5, 0.6),
    vel: new THREE.Vector2(),
    heroP: 0,
    intro: reduced ? 1 : 0,
    scroll: 0,
    time: 0,
  };

  const dprCap = mobile ? 1.5 : 1.75;
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let k = VIEW_H / vh; // world units per CSS pixel at z = 0

  /* ------------------------------------------------------------- renderers */
  // Inner pages have no portrait, so they skip the foreground canvas entirely.
  const hasFx = !!portraitEl;
  const bg = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  const fx = hasFx ? new THREE.WebGLRenderer({ canvas: fxCanvas, antialias: true, alpha: true, powerPreference: 'high-performance' }) : null;
  if (!hasFx) fxCanvas.style.display = 'none';
  const renderers = [bg, fx].filter(Boolean);
  for (const r of renderers) {
    r.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
    r.setSize(vw, vh, false);
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
  }
  fx?.setClearColor(0x000000, 0);

  const camera = new THREE.PerspectiveCamera(FOV, vw / vh, 0.1, 100);
  camera.position.z = CAM_Z;
  const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  /* --------------------------------------------- background: nebula pass */
  const nebulaRT = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false });
  const nebulaMat = new THREE.ShaderMaterial({
    vertexShader: S.fullscreenVert,
    fragmentShader: S.nebulaFrag,
    uniforms: {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(vw, vh) },
      uMouse: { value: state.mouseUv },
      uScroll: { value: 0 },
      uGlow: { value: 1 },
      uGlowY: { value: 0.05 },
    },
    depthTest: false,
    depthWrite: false,
  });
  const nebulaScene = new THREE.Scene();
  nebulaScene.add(fullscreenQuad(nebulaMat));
  const copyScene = new THREE.Scene();
  copyScene.add(
    fullscreenQuad(
      new THREE.ShaderMaterial({
        vertexShader: S.fullscreenVert,
        fragmentShader: S.copyFrag,
        uniforms: { uTex: { value: nebulaRT.texture } },
        depthTest: false,
        depthWrite: false,
      }),
    ),
  );

  /* ------------------------------------- background: planet + chrome rings */
  const bgScene = new THREE.Scene();
  const envBg = makeEnvironment(bg);
  bgScene.environment = envBg;

  const planet = new THREE.Group();
  bgScene.add(planet);
  const planetMat = new THREE.ShaderMaterial({
    vertexShader: S.planetVert,
    fragmentShader: S.planetFrag,
    uniforms: { uTime: { value: 0 }, uLight: { value: new THREE.Vector2(-0.4, 0.8) } },
  });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, mobile ? 64 : 128, mobile ? 48 : 96), planetMat);
  planet.add(sphere);
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      vertexShader: S.planeVert,
      fragmentShader: S.haloFrag,
      uniforms: { uStrength: { value: 0.75 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  halo.scale.setScalar(3.2);
  halo.position.z = -1.2;
  halo.renderOrder = -1;
  planet.add(halo);

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    iridescence: 0.45,
    iridescenceIOR: 1.6,
    envMapIntensity: 1.35,
  });
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.018, 24, 220), chrome);
  ringA.rotation.set(1.18, 0, -0.38);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.007, 16, 260), chrome);
  ringB.rotation.set(1.32, 0.22, 0.48);
  planet.add(ringA, ringB);

  /* --------------------------------------------------- foreground: fx scene */
  const fxScene = new THREE.Scene();
  if (hasFx) fxScene.environment = makeEnvironment(fx);

  const manager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader(manager);

  // Portrait plane, kept in sync with the <figure> it replaces.
  const portraitMat = new THREE.ShaderMaterial({
    vertexShader: S.planeVert,
    fragmentShader: S.portraitFrag,
    uniforms: {
      uTex: { value: null },
      uTime: { value: 0 },
      uDissolve: { value: reduced ? 0 : 1 },
      uVel: { value: new THREE.Vector2() },
      uTexel: { value: new THREE.Vector2(1 / 768, 1 / 838) },
    },
  });
  const portrait = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), portraitMat);
  portrait.visible = false;
  fxScene.add(portrait);

  const portraitReady = !hasFx ? Promise.resolve() : loader.loadAsync(portraitSrc).then((tex) => {
    tex.colorSpace = THREE.NoColorSpace;
    tex.anisotropy = fx.capabilities.getMaxAnisotropy();
    portraitMat.uniforms.uTex.value = tex;
    portraitMat.uniforms.uTexel.value.set(1 / tex.image.width, 1 / tex.image.height);
    portrait.visible = true;
  });

  // Tool icons: flat app icons (no glass or bevel) that hide behind the
  // portrait and come out when the cursor is near it.
  const chipGroup = new THREE.Group();
  fxScene.add(chipGroup);
  const iconGeo = new THREE.PlaneGeometry(1, 1);
  const chips = [];
  (hasFx ? tools : []).forEach((t, i) => {
    const key = t.src.split('/').pop().replace('.png', '');
    const layout = CHIP_LAYOUT[key];
    if (!layout) return;
    // small screens keep four icons so the portrait stays the focus
    if (mobile && !['figma', 'framer', 'photoshop', 'xd'].includes(key)) return;
    const holder = new THREE.Group();
    const iconMat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false, opacity: 0 });
    const icon = new THREE.Mesh(iconGeo, iconMat);
    holder.add(icon);
    holder.visible = false;
    loader.loadAsync(t.src).then((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = fx.capabilities.getMaxAnisotropy();
      iconMat.map = tex;
      iconMat.needsUpdate = true;
    });
    chipGroup.add(holder);
    chips.push({
      holder,
      icon,
      mat: iconMat,
      layout,
      i: chips.length,
      hover: 0,
      reveal: 0,
      seed: Math.random() * 10,
      spin: 0,
      base: new THREE.Vector3(),
      origin: new THREE.Vector3(),
    });
  });

  // Chrome shapes: a knot and two mirrored spheres that float in the hero.
  const chromeFx = chrome.clone();
  chromeFx.iridescence = 0.6;
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.32, mobile ? 160 : 260, 32, 2, 3), chromeFx);
  const orbA = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), chromeFx);
  const orbB = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), chromeFx);
  const floaters = [
    { mesh: knot, at: [0.08, 0.8], size: 0.032, z: 0.8, depth: 1.6, spin: [0.3, 0.45] },
    { mesh: orbA, at: [0.9, 0.24], size: 0.028, z: 0.5, depth: 1.2, spin: [0, 0.2] },
    { mesh: orbB, at: [0.16, 0.3], size: 0.014, z: 1.4, depth: 2.2, spin: [0, 0.2] },
  ];
  floaters.forEach((f) => fxScene.add(f.mesh));

  // Particles.
  const count = mobile ? 240 : 700;
  const pos = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 13;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.5;
    seeds[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const pMat = new THREE.ShaderMaterial({
    vertexShader: S.particlesVert,
    fragmentShader: S.particlesFrag,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 52 },
      uBoost: { value: 0 },
      uPixelRatio: { value: fx ? fx.getPixelRatio() : 1 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(pGeo, pMat);
  particles.frustumCulled = false;
  fxScene.add(particles);

  /* --------------------------------------------------------------- layout */
  const pxToWorld = (x, y) => new THREE.Vector3((x - vw / 2) * k, -(y - vh / 2) * k, 0);

  function resize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    k = VIEW_H / vh;
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    for (const r of renderers) {
      r.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
      r.setSize(vw, vh, false);
    }
    const pr = bg.getPixelRatio();
    nebulaRT.setSize(Math.max(1, Math.round(vw * pr * 0.5)), Math.max(1, Math.round(vh * pr * 0.5)));
    nebulaMat.uniforms.uRes.value.set(vw, vh);
    if (fx) pMat.uniforms.uPixelRatio.value = fx.getPixelRatio();
    needsFx = true;
  }

  /* ---------------------------------------------------------------- input */
  let lastX = -1;
  let lastY = -1;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2(10, 10);
  function onPointer(e) {
    state.mouseTarget.set((e.clientX / vw) * 2 - 1, -((e.clientY / vh) * 2 - 1));
    state.vel.x += (e.clientX - lastX) * 0.02;
    state.vel.y -= (e.clientY - lastY) * 0.02;
    lastX = e.clientX;
    lastY = e.clientY;
    ndc.set(state.mouseTarget.x, state.mouseTarget.y);
  }
  window.addEventListener('pointermove', onPointer, { passive: true });

  /* ----------------------------------------------------------------- tick */
  let needsFx = true;
  let fxCleared = false;
  const tmp = new THREE.Vector3();

  function tick(dt) {
    dt = Math.min(dt, 1 / 20);
    const timeScale = reduced ? 0 : 1;
    state.time += dt * timeScale;
    const t = state.time;

    state.mouse.x = damp(state.mouse.x, state.mouseTarget.x, 5, dt);
    state.mouse.y = damp(state.mouse.y, state.mouseTarget.y, 5, dt);
    state.mouseUv.set(state.mouse.x * 0.5 + 0.5, state.mouse.y * 0.5 + 0.5);
    state.vel.multiplyScalar(Math.exp(-6 * dt));
    state.vel.clampLength(0, 3);

    const heroRect = heroEl.getBoundingClientRect();
    const ctaRect = ctaEl ? ctaEl.getBoundingClientRect() : { top: Infinity, bottom: Infinity, height: 0 };

    /* planet: sits on the hero's bottom edge, then rises again behind the CTA */
    // inner pages carry intro text under the title, so their planet sits lower and smaller
    const R = (mobile ? vw * 0.62 : Math.min(vw * 0.29, vh * 0.5)) * (hasFx ? 1 : 0.8);
    const sink = hasFx ? 0 : R * 0.5;
    let cy;
    let scaleMul = 1;
    const p = state.heroP;
    const introRise = reduced ? 1 : smooth(0, 0.7, state.intro);
    // hero: anchored to the viewport bottom, sinking as the page scrolls on
    // cta: rides up with the contact section and settles behind the form
    if (ctaRect.top > vh * 1.4) {
      const scrolled = Math.max(0, -heroRect.top);
      cy = vh + sink + R * (1 - introRise) * 1.3 + scrolled * 0.9;
    } else {
      scaleMul = 1.15;
      cy = ctaRect.bottom + R * scaleMul * 0.5;
    }
    const pc = pxToWorld(vw / 2, cy);
    planet.position.set(pc.x + state.mouse.x * 0.12, pc.y + state.mouse.y * 0.08, -0.6);
    planet.scale.setScalar(R * k * scaleMul);
    planetMat.uniforms.uTime.value = t;
    planetMat.uniforms.uLight.value.set(-0.35 + state.mouse.x * 0.6, 0.85 + state.mouse.y * 0.3);
    ringA.rotation.z = -0.38 + t * 0.12 + p * 1.4;
    ringB.rotation.z = 0.48 - t * 0.08 - p;
    ringA.rotation.x = 1.18 + state.mouse.y * 0.08;

    /* nebula */
    nebulaMat.uniforms.uTime.value = t;
    nebulaMat.uniforms.uScroll.value = state.scroll;
    nebulaMat.uniforms.uGlowY.value = 1 - clamp(cy / vh, -0.5, 1.5);
    nebulaMat.uniforms.uGlow.value = 0.9;

    bg.setRenderTarget(nebulaRT);
    bg.render(nebulaScene, ortho);
    bg.setRenderTarget(null);
    bg.autoClear = false;
    bg.clear();
    bg.render(copyScene, ortho);
    bg.render(bgScene, camera);
    bg.autoClear = true;

    if (!hasFx) return;

    /* fx: only while the hero is on screen */
    const heroVisible = heroRect.bottom > -40;
    if (!heroVisible && state.intro >= 1) {
      if (!fxCleared) {
        fx.clear();
        fxCleared = true;
      }
      return;
    }
    fxCleared = false;

    const intro = state.intro;
    const pr = portraitEl.getBoundingClientRect();
    const H = pr.height;
    const center = pxToWorld(pr.left + pr.width / 2, pr.top + pr.height / 2);

    // portrait
    portrait.position.copy(center);
    portrait.scale.set(pr.width * k * (1 + p * 0.06), H * k * (1 + p * 0.06), 1);
    portrait.rotation.y = damp(portrait.rotation.y, state.mouse.x * 0.16, 4, dt);
    portrait.rotation.x = damp(portrait.rotation.x, -state.mouse.y * 0.07, 4, dt);
    const introDissolve = 1 - smooth(0.08, 0.8, intro);
    const scrollDissolve = reduced ? 0 : smooth(0.05, 0.72, p);
    const dissolve = Math.max(introDissolve, scrollDissolve);
    portraitMat.uniforms.uDissolve.value = dissolve;
    portraitMat.uniforms.uTime.value = t;
    portraitMat.uniforms.uVel.value.copy(state.vel);

    // tool icons
    // Hidden behind the portrait until the cursor comes near it (on touch
    // screens: until the visitor starts scrolling). While the hero scrolls
    // they travel out toward the screen; once the hero is left behind they
    // glide back to their hiding place.
    const near =
      lastX >= pr.left - pr.width * 0.5 &&
      lastX <= pr.right + pr.width * 0.5 &&
      lastY >= pr.top - pr.height * 0.12 &&
      lastY <= pr.bottom;
    const inHero = p < 0.8 && intro > 0.85;
    const active = inHero && (canHover ? near : p > 0.02);
    const fly = reduced ? 0 : smooth(0.02, 0.8, p);

    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(chips.filter((c) => c.holder.visible).map((c) => c.icon), false);
    const hovered = hits.length ? hits[0].object : null;
    for (const c of chips) {
      const [dx, dy, size, depth] = c.layout;
      const spread = vw < 700 ? 0.82 : 1.08;
      let x = pr.left + pr.width / 2 + dx * H * spread;
      const y = pr.top + pr.height / 2 + dy * H;
      const half = size * H * 0.6;
      x = clamp(x, half + 8, vw - half - 8);
      c.base.copy(pxToWorld(x, y));
      // hiding place: just behind the portrait, offset a little toward the icon's side
      c.origin.copy(pxToWorld(pr.left + pr.width / 2 + dx * H * 0.18, pr.top + pr.height * 0.45 + dy * H * 0.2));
      c.origin.z = -0.9;

      // staggered: icons further from the portrait come out a touch later
      c.reveal = damp(c.reveal, active ? 1 : 0, active ? 4.2 - c.i * 0.25 : 3.4 + c.i * 0.15, dt);
      const e = c.reveal * c.reveal * (3 - 2 * c.reveal);
      c.hover = damp(c.hover, c.icon === hovered ? 1 : 0, 8, dt);
      c.spin += dt * (0.25 + c.hover * 3);

      tmp.copy(c.base);
      tmp.x += state.mouse.x * 0.25 * depth + Math.sign(dx) * fly * 2.4;
      tmp.y += state.mouse.y * 0.18 * depth + Math.sin(t * 0.9 + c.seed) * 0.08 + fly * (dy < 0 ? 0.8 : -0.6);
      tmp.z = depth * 0.9 + fly * 4.5;
      c.holder.position.lerpVectors(c.origin, tmp, e);

      const s = size * H * k * (0.35 + 0.65 * e) * (1 + c.hover * 0.25);
      c.holder.scale.setScalar(s);
      c.holder.rotation.x = (Math.sin(t * 0.7 + c.seed) * 0.12 - state.mouse.y * 0.25) * e;
      c.holder.rotation.y = (1 - e) * 1.1 * Math.sign(dx) + (Math.sin(t * 0.5 + c.seed * 2) * 0.2 + state.mouse.x * 0.3) * e + c.hover * Math.sin(c.spin) * 0.5;
      c.holder.rotation.z = Math.sin(t * 0.4 + c.seed) * 0.08 * e;
      c.mat.opacity = smooth(0, 0.35, e);
      c.holder.visible = e > 0.005;
    }

    // chrome floaters, parallaxing faster than the page as the hero scrolls
    const scrollPx = -heroRect.top;
    for (const f of floaters) {
      const fp = pxToWorld(f.at[0] * vw, f.at[1] * vh - scrollPx * (f.depth - 1) * 0.6);
      const fi = reduced ? 1 : smooth(0.4, 1, intro);
      f.mesh.position.set(
        fp.x + state.mouse.x * 0.2 * f.depth,
        fp.y + state.mouse.y * 0.15 * f.depth + Math.sin(t * 0.8 + f.depth) * 0.12 - (1 - fi) * 2,
        f.z,
      );
      f.mesh.scale.setScalar(Math.min(vw, vh * 1.6) * f.size * k * fi);
      f.mesh.rotation.x = t * f.spin[0];
      f.mesh.rotation.y = t * f.spin[1] + scrollPx * 0.002;
    }

    // particles burst while the portrait dissolves
    pMat.uniforms.uTime.value = t;
    pMat.uniforms.uBoost.value = 4 * dissolve * (1 - dissolve) * 1.4;
    particles.position.y = scrollPx * k * 0.3;

    fx.render(fxScene, camera);
    needsFx = false;
  }

  /* ----------------------------------------------------------- lifecycle */
  let alive = true;
  const onLost = (e) => {
    e.preventDefault();
    alive = false;
    document.documentElement.classList.add('no-webgl');
    document.documentElement.classList.remove('gl-portrait');
  };
  bgCanvas.addEventListener('webglcontextlost', onLost);
  fxCanvas.addEventListener('webglcontextlost', onLost);

  resize();

  return {
    state,
    ready: portraitReady,
    manager,
    resize,
    tick: (dt) => alive && !document.hidden && tick(dt),
  };
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
  } catch {
    return false;
  }
}
