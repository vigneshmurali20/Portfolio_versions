/*
 * The journey backdrop: one fixed Three.js particle field behind the whole
 * page, in the same scan language as the hero. Each layer of the site has
 * its own formation:
 *
 *   0 surface  (hero, marquee)                drifting scan dust
 *   1 work     (case studies, clients, impact, disciplines)  a data grid with bars
 *   2 systems  (toolbox, AI lab, showreel)    a layered network of nodes
 *   3 person   (about, testimonials)          contour terrain
 *   4 signal   (contact, footer)              a tunnel converging on a point
 *
 * Between layers sit the .descent bands. While one crosses the middle of
 * the screen the camera dives: the current formation streams past the lens
 * and the next one rises out of the depth. Inside a layer the field holds
 * still apart from a slow drift, so it never competes with reading.
 *
 * Without WebGL (or on save-data) the page keeps its plain dark background.
 */

const WORLDS = ['heaven', 'earth', 'ocean', 'abyss', 'hell'];

/* ------------------------------------------------------------ formations */
// Each returns n points (x, y, z) in units where the visible half-height at
// z = 0 is about 2.8 (camera at z = 6, 50deg fov), plus a brightness each.
function formations(n) {
  let s = 4242;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const g = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
  const make = (fn) => {
    const pos = new Float32Array(n * 3), lum = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const [x, y, z, l] = fn(i);
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; lum[i] = l;
    }
    return { pos, lum };
  };

  // surface: a scanned city ahead of the camera, continuing the hero's city
  const city = make(() => {
    if (rnd() < 0.12) return [g() * 9, g() * 4, -rnd() * 14 + 2, 0.25 + rnd() * 0.4]; // dust
    const cx = Math.round(g() * 9), cz = Math.round(-rnd() * 16);
    const x = cx * 0.6, z = cz * 0.6 - 2, base = -1.7;
    const d = Math.hypot(cx * 0.6, (z + 7) * 0.8);
    const h = 0.2 + Math.exp(-d * d / 10) * 3.6 * (0.4 + rnd() * 0.6);
    const edge = rnd() < 0.55;
    if (edge) return [x + (rnd() < 0.5 ? 0 : 0.42), base + rnd() * h, z + (rnd() < 0.5 ? 0 : 0.42), 0.9];
    // window rows on the face toward the camera
    const fy = Math.floor(rnd() * h / 0.09) * 0.09;
    return [x + rnd() * 0.42, base + fy, z + 0.42, 0.5];
  });

  // work: a city-like data grid; streets as lines, some cells rise as bars
  const cellH = (cx, cz) => {
    const v = Math.sin(cx * 0.9) * Math.cos(cz * 0.7) + Math.sin(cx * 0.31 + cz * 0.43) * 1.2;
    return v > 0.6 ? (v - 0.6) * 1.8 : 0;
  };
  const grid = make(() => {
    const cx = Math.floor(g() * 13), cz = Math.floor(-rnd() * 22);
    const x = cx * 0.55, z = cz * 0.55 + 1.5, base = -1.6;
    const h = cellH(cx, cz);
    if (h > 0 && rnd() < 0.55) {
      const edge = rnd() < 0.5;
      const bx = x + (edge ? (rnd() < 0.5 ? 0 : 0.36) : rnd() * 0.36), bz = z + (edge ? (rnd() < 0.5 ? 0 : 0.36) : rnd() * 0.36);
      return [bx, base + rnd() * h, bz, edge ? 0.95 : 0.55];
    }
    // street lines
    return rnd() < 0.5 ? [x + rnd() * 0.55, base, z, 0.35 + rnd() * 0.25] : [x, base, z + rnd() * 0.55, 0.35 + rnd() * 0.25];
  });

  // systems: layers of nodes, points cluster on nodes and run along edges
  const layers = [7, 11, 14, 11, 7];
  const nodes = layers.map((count, li) => Array.from({ length: count }, (_, k) => {
    const a = (k / count) * Math.PI * 2 + li;
    return [(li - 2) * 2.1, Math.sin(a) * (0.6 + count * 0.12), Math.cos(a) * (0.6 + count * 0.12) - 3];
  }));
  const network = make(() => {
    const li = Math.floor(rnd() * layers.length), node = nodes[li][Math.floor(rnd() * layers[li])];
    if (rnd() < 0.5 || li === layers.length - 1) {
      const r = Math.pow(rnd(), 2) * 0.16;
      const a = rnd() * Math.PI * 2, b = Math.acos(2 * rnd() - 1);
      return [node[0] + r * Math.sin(b) * Math.cos(a), node[1] + r * Math.cos(b), node[2] + r * Math.sin(b) * Math.sin(a), 0.9];
    }
    const next = nodes[li + 1][Math.floor(rnd() * layers[li + 1])], t = rnd();
    return [node[0] + (next[0] - node[0]) * t, node[1] + (next[1] - node[1]) * t, node[2] + (next[2] - node[2]) * t, 0.3];
  });

  // person: contour terrain, ridge lines receding into the dark
  const terrain = make(() => {
    const row = Math.floor(rnd() * 46), z = 2 - row * 0.42, x = (rnd() * 2 - 1) * 9;
    const y = -1.4 + Math.sin(x * 0.6 + row * 0.35) * 0.45 + Math.sin(x * 1.7 - row * 0.2) * 0.18 + Math.exp(-((x - 1.5) ** 2) / 3 - ((row - 18) ** 2) / 60) * 1.6;
    return [x, y, z, 0.35 + rnd() * 0.5];
  });

  // signal: a tunnel of rings converging on a bright point far ahead
  const tunnel = make(() => {
    const t = Math.pow(rnd(), 0.7), a = rnd() * Math.PI * 2 + t * 6;
    const r = 2.6 * (1 - t * 0.92) + g() * 0.04;
    return [Math.cos(a) * r, Math.sin(a) * r * 0.85, 3 - t * 26, 0.3 + t * 0.7];
  });

  return [city, grid, network, terrain, tunnel];
}

// one colour per formation: cool scan white, ice blue, cyan, warm white, ember
const TINTS = [[0.8, 0.86, 0.92], [0.78, 0.9, 1], [0.45, 0.88, 0.95], [0.95, 0.9, 0.82], [1, 0.55, 0.32]];

export function createWorld({ reduced }) {
  const root = document.documentElement;
  const canvas = document.querySelector('[data-world-canvas]');

  // scroll keyframes: each band moves w from n to n + 1 while it crosses mid-screen
  let keys = [];
  const measure = () => {
    keys = [...document.querySelectorAll('[data-descent]')].map((band, n) => {
      const r = band.getBoundingClientRect();
      const top = r.top + scrollY;
      return { start: top - innerHeight * 0.75, end: top + r.height - innerHeight * 0.25, from: n };
    });
  };
  const worldAt = (y) => {
    let w = 0;
    for (const k of keys) {
      if (y >= k.end) w = k.from + 1;
      else if (y > k.start) return k.from + (y - k.start) / (k.end - k.start);
    }
    return w;
  };
  let current = -1;
  const label = () => {
    const now = Math.round(worldAt(scrollY));
    if (now !== current) { current = now; root.dataset.worldNow = WORLDS[now]; }
  };
  measure(); label();
  addEventListener('scroll', label, { passive: true });
  addEventListener('resize', () => { measure(); label(); });
  addEventListener('load', () => { measure(); label(); });
  new ResizeObserver(() => { measure(); label(); }).observe(document.body);

  if (!canvas || navigator.connection?.saveData) return;
  const start = () => import('three').then((THREE) => run(THREE)).catch((err) => console.warn('Journey backdrop disabled:', err));
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2500 });
  else setTimeout(start, 1200);

  function run(THREE) {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
    } catch { return; }
    const mobile = matchMedia('(max-width: 860px)').matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5));
    renderer.setClearColor(0x030404, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 80);
    camera.position.set(0, 0, 6);

    const N = mobile ? 9000 : 20000;
    const F = formations(N);
    const seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) seeds[i] = Math.random();
    const geometry = new THREE.BufferGeometry();
    const posA = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
    const posB = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
    const lumA = new THREE.BufferAttribute(new Float32Array(N), 1);
    const lumB = new THREE.BufferAttribute(new Float32Array(N), 1);
    geometry.setAttribute('position', posA);
    geometry.setAttribute('aTo', posB);
    geometry.setAttribute('aLumA', lumA);
    geometry.setAttribute('aLumB', lumB);
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const uniforms = {
      uMix: { value: 0 }, uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() },
      uTintA: { value: new THREE.Color() }, uTintB: { value: new THREE.Color() }, uH: { value: 800 },
    };
    const material = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms,
      vertexShader: `
        uniform float uMix; uniform float uTime; uniform float uPx; uniform float uH;
        uniform vec3 uTintA; uniform vec3 uTintB;
        attribute vec3 aTo; attribute float aLumA; attribute float aLumB; attribute float aSeed;
        varying vec3 vColor; varying float vAlpha;
        float ease(float t) { return t * t * (3.0 - 2.0 * t); }
        void main() {
          // first half: dive through the current formation (it rushes past
          // the lens); second half: the next one rises out of the depth
          float m = uMix;
          float outT = clamp(m * 2.0 - aSeed * 0.25, 0.0, 1.0);
          float inT = clamp(m * 2.0 - 1.0 + (1.0 - aSeed) * 0.25, 0.0, 1.0);
          vec3 a = position, b = aTo;
          vec3 swirl = vec3(sin(aSeed * 61.0 + uTime), cos(aSeed * 37.0 + uTime * 0.8), 0.0);
          a.z += pow(outT, 1.6) * (9.0 + aSeed * 8.0);
          a.xy += swirl.xy * outT * 0.6;
          b.z -= pow(1.0 - inT, 1.4) * (18.0 + aSeed * 10.0);
          b.xy += swirl.xy * (1.0 - inT) * 1.2;
          bool useB = m > 0.5;
          vec3 p = useB ? b : a;
          // idle breathing
          p.y += sin(uTime * 0.3 + aSeed * 40.0) * 0.02;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float depth = max(0.2, -mv.z);
          float speed = useB ? (1.0 - inT) : outT;
          gl_PointSize = clamp((1.6 + aSeed * 1.2) * uPx * (uH / 900.0) * 7.0 / depth * (1.0 + speed * 2.5), 1.0, 26.0);
          float lum = useB ? aLumB : aLumA;
          vColor = (useB ? uTintB : uTintA) * lum;
          float fog = 1.0 - smoothstep(14.0, 30.0, depth);
          float near = smoothstep(0.25, 1.4, depth);   // fade as points pass the lens
          vAlpha = fog * near * (0.75 - speed * 0.35);
        }`,
      fragmentShader: `
        varying vec3 vColor; varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(vColor, vAlpha * (1.0 - smoothstep(0.15, 0.5, d)));
        }`,
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    let base = -1;
    const load = (i) => {
      const a = F[i], b = F[Math.min(i + 1, F.length - 1)];
      posA.array.set(a.pos); posB.array.set(b.pos); lumA.array.set(a.lum); lumB.array.set(b.lum);
      posA.needsUpdate = posB.needsUpdate = lumA.needsUpdate = lumB.needsUpdate = true;
      uniforms.uTintA.value.setRGB(...TINTS[i]);
      uniforms.uTintB.value.setRGB(...TINTS[Math.min(i + 1, TINTS.length - 1)]);
    };

    const size = () => {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      uniforms.uH.value = innerHeight;
    };
    size();
    addEventListener('resize', size);

    const pointer = { x: 0, y: 0 }, look = { x: 0, y: 0 };
    addEventListener('pointermove', (e) => { pointer.x = e.clientX / innerWidth * 2 - 1; pointer.y = 1 - e.clientY / innerHeight * 2; }, { passive: true });

    root.classList.add('world-live');
    let last = 0, raf = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      if (now - last < 1000 / 45) return; // cap the backdrop at ~45 fps
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const w = worldAt(scrollY);
      const i = Math.min(F.length - 1, Math.floor(w));
      if (i !== base) { base = i; load(i); }
      let m = w - i;
      if (reduced) m = m < 0.5 ? 0 : 1; // no flight: a straight swap
      uniforms.uMix.value = m;
      uniforms.uTime.value = reduced ? 0 : now / 1000;
      // a slow drift and pointer parallax; reading inside a layer moves the
      // camera forward a little so the field never feels frozen
      look.x += (pointer.x - look.x) * Math.min(1, dt * 2);
      look.y += (pointer.y - look.y) * Math.min(1, dt * 2);
      const t = reduced ? 0 : now / 1000;
      camera.position.x = look.x * 0.35 + Math.sin(t * 0.07) * 0.3;
      camera.position.y = look.y * 0.2 + 0.4;
      camera.lookAt(0, -0.3, -4);
      points.rotation.y = reduced ? 0 : Math.sin(t * 0.03) * 0.08;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);
  }
}
