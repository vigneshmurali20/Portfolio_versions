// Hero background layer: a scanned city at night, seen from above, with a
// surveillance-style network linking the rooftops.
//
// The scene lives in units of half the hero height, so it never stretches.
// The camera sits 3.73 units in front of the origin (30deg fov). Blocks of
// wireframe towers fill a street grid that recedes to the horizon; the scan
// is tilted toward the camera around the city centre so it reads as an aerial
// view. Facades are drawn the way a scanner sees them (floor lines, window
// columns, hard edges, a few lit windows) in a cool blue-white. Warm
// streetlights run along the streets, a red perimeter line rings the
// district, rooftop nodes are wired into hubs, and data pulses run the links.
export function createHeroWorld({ THREE, scene, reduced }) {
  const field = new THREE.Group(); // the background layer
  field.name = 'hero-scan-city';
  scene.add(field);

  const mobile = matchMedia('(max-width: 860px)').matches;
  const budget = mobile ? 0.55 : 1;

  let seed = 20261114;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  const CX = 0.6, CZ = -14; // city centre, where the towers peak
  const GROUND = -0.95;
  const TILT = 0.2, cosT = Math.cos(TILT), sinT = Math.sin(TILT);
  const tilt = (x, y, z) => {
    const dy = y - GROUND, dz = z - CZ;
    return [x, GROUND + dy * cosT - dz * sinT, CZ + dy * sinT + dz * cosT];
  };

  const COOL = [0.78, 0.9, 1], WARM = [1, 0.62, 0.28], LIT = [1, 0.9, 0.72], RED = [1, 0.22, 0.2];
  const P = [], C = [], S = [], K = [];
  // kind: 0 street, 1 facade, 2 lit window, 3 roof, 4 streetlight, 5 perimeter
  const add = (x, y, z, v, kind, size = 1, tint = COOL) => {
    const [tx, ty, tz] = tilt(x, y, z);
    P.push(tx, ty, tz); C.push(v * tint[0], v * tint[1], v * tint[2]);
    S.push(size * (0.7 + rnd() * 0.6)); K.push(kind);
  };

  /* -------------------------------------------------------- buildings */
  const roofs = [];
  const facade = (ox, oz, ux, uz, w, h, tone, lights) => {
    const floor = 0.075, step = 0.035 / Math.sqrt(budget);
    for (let y = 0; y <= h; y += floor) {
      for (let s = 0; s <= w; s += step) {
        if (rnd() < 0.2) continue; // scan dropout
        const lit = lights && rnd() < 0.02;
        add(ox + ux * s, GROUND + y, oz + uz * s, lit ? 1.1 : tone * (0.5 + rnd() * 0.35), lit ? 2 : 1, lit ? 1.5 : 0.9, lit ? LIT : COOL);
      }
    }
    for (let s = 0; s <= w; s += 0.06) {
      for (let y = 0; y <= h; y += step * 1.6) {
        if (rnd() < 0.5) continue;
        add(ox + ux * s, GROUND + y, oz + uz * s, tone * 0.42, 1, 0.8);
      }
    }
    // hard vertical edges read brightest in a scan
    for (let y = 0; y <= h; y += step * 0.7) {
      add(ox, GROUND + y, oz, tone * 1.1, 1, 1);
      add(ox + ux * w, GROUND + y, oz + uz * w, tone * 1.1, 1, 1);
    }
  };
  const building = (x, z, w, d, h) => {
    const dist = Math.hypot(x - CX, z - CZ);
    const tone = 0.75 + Math.min(0.6, h * 0.15);
    // the face toward the camera, the face toward the centre, and the roof
    facade(x, z + d, 1, 0, w, h, tone, true);
    facade(x < CX ? x + w : x, z + d, 0, -1, d, h, tone * 0.7, h > 0.8);
    const rs = 0.05 / Math.sqrt(budget);
    for (let a = 0; a <= w; a += rs) {
      for (let b = 0; b <= d; b += rs) {
        if (rnd() < 0.35) continue;
        const edge = a < rs || b < rs || a > w - rs || b > d - rs;
        add(x + a, GROUND + h, z + b, edge ? tone : tone * 0.45, 3, edge ? 1 : 0.8);
      }
    }
    roofs.push({ x: x + w / 2, y: GROUND + h, z: z + d / 2, h, dist });
  };

  const BLOCK = 1.05, STREET = 0.32, PITCH = BLOCK + STREET;
  for (let gx = -10; gx <= 10; gx++) {
    for (let gz = 0; gz < 15; gz++) {
      const bx = CX + gx * PITCH - BLOCK / 2;
      const bz = -4.5 - gz * PITCH - BLOCK;
      const dist = Math.hypot(bx - CX, (bz - CZ) * 0.9);
      if (dist > 11.5) continue;
      // towers peak at the centre and fall away toward the edges
      const peak = Math.exp(-dist * dist / 14);
      const parts = rnd() < 0.5 ? 1 : 2;
      for (let p = 0; p < parts; p++) {
        const w = parts === 1 ? BLOCK * (0.75 + rnd() * 0.2) : BLOCK * (0.42 + rnd() * 0.06);
        const d = BLOCK * (0.6 + rnd() * 0.35);
        const x = bx + (parts === 1 ? (BLOCK - w) / 2 : p * BLOCK * 0.52);
        const z = bz + (BLOCK - d) * rnd();
        const h = 0.16 + rnd() * 0.45 + peak * (1.2 + rnd() * 2.6) * (rnd() < 0.85 ? 1 : 0.3);
        building(x, z, w, d, h);
      }
    }
  }

  /* ------------------------------------- streets and their lights */
  const sStep = 0.04 / Math.sqrt(budget);
  const street = (x, z) => {
    // a faint grid, with warm streetlights strung along it
    if (rnd() < 0.1) add(x, GROUND + 0.01, z, 1.2 + rnd() * 0.5, 4, 2.2, WARM);
    else if (rnd() < 0.6) add(x, GROUND, z, 0.35 + rnd() * 0.2, 0, 1);
  };
  for (let gx = -10; gx <= 11; gx++) {
    const sx = CX + gx * PITCH - BLOCK / 2 - STREET / 2;
    for (let z = -1; z > -27; z -= sStep) street(sx + (rnd() - 0.5) * 0.05, z);
  }
  for (let gz = 0; gz < 17; gz++) {
    const sz = -4.5 - gz * PITCH + STREET / 2;
    for (let x = CX - 15; x < CX + 15; x += sStep) street(x, sz + (rnd() - 0.5) * 0.05);
  }
  // a red perimeter line rings the core district along the streets
  const ring = [[-3, 0], [3, 0], [3, -3], [4, -3], [4, -6], [-2, -6], [-2, -4], [-3, -4], [-3, 0]];
  for (let i = 0; i < ring.length - 1; i++) {
    const [ax, az] = ring[i], [bx, bz] = ring[i + 1];
    const x0 = CX + ax * PITCH - BLOCK / 2 - STREET / 2, z0 = -4.5 + az * PITCH + STREET / 2;
    const x1 = CX + bx * PITCH - BLOCK / 2 - STREET / 2, z1 = -4.5 + bz * PITCH + STREET / 2;
    const len = Math.hypot(x1 - x0, z1 - z0);
    for (let s = 0; s <= len; s += 0.018) {
      const t = s / len;
      add(x0 + (x1 - x0) * t, GROUND + 0.02, z0 + (z1 - z0) * t, 0.95, 5, 1.2, RED);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(C, 3));
  geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(S, 1));
  geometry.setAttribute('aKind', new THREE.Float32BufferAttribute(K, 1));

  const uniforms = {
    uTime: { value: 0 }, uDist: { value: 1000 }, uPx: { value: 1 }, uIntro: { value: reduced ? 1 : 0 },
    uCenter: { value: new THREE.Vector3(...tilt(CX, GROUND, CZ)) },
  };
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms,
    vertexShader: `
      uniform float uTime; uniform float uDist; uniform float uPx; uniform float uIntro; uniform vec3 uCenter;
      attribute vec3 aColor; attribute float aSize; attribute float aKind;
      varying vec3 vColor; varying float vAlpha;
      void main() {
        vec3 p = position;
        float r = length((p - uCenter).xz);
        // the scan resolves outward from the centre on load
        float built = smoothstep(r - 0.8, r, uIntro * 15.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float depth = -mv.z;
        gl_PointSize = max(1.2, aSize * uPx * 4.2 * uDist / depth);
        float fog = exp(-max(0.0, depth / uDist - 2.6) * 0.22);
        float rim = 1.0 - smoothstep(8.0, 12.0, r);
        // a scan sweep passes over the city every few seconds
        float sweep = mod(uTime * 1.4, 18.0) - 2.0;
        float pulse = exp(-pow(r - sweep, 2.0) * 4.0);
        // lit windows flicker
        float s = fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
        float flick = (aKind > 1.5 && aKind < 2.5) ? step(0.25, fract(s * 7.0 + uTime * 0.05 * s)) : 1.0;
        vColor = aColor * (1.0 + pulse * (aKind < 0.5 ? 1.6 : 0.6));
        float a = aKind < 0.5 ? 0.5 : aKind < 1.5 ? 0.58 : aKind < 2.5 ? 0.95 : aKind < 3.5 ? 0.5 : aKind < 4.5 ? 0.85 : 0.9;
        vAlpha = a * fog * rim * built * flick;
      }`,
    fragmentShader: `
      varying vec3 vColor; varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(vColor, vAlpha * (1.0 - smoothstep(0.25, 0.5, d)));
      }`,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  field.add(points);

  /* -------------------------------------------- surveillance network */
  // hubs on the tallest towers; nearby rooftops wire into the closest hub
  const tall = roofs.filter((r) => r.dist < 7).sort((a, b) => b.h - a.h);
  const hubs = [];
  for (const r of tall) {
    if (hubs.length >= (mobile ? 3 : 4)) break;
    if (hubs.every((h) => Math.hypot(h.x - r.x, h.z - r.z) > 3)) hubs.push(r);
  }
  const leaves = roofs.filter((r) => r.dist < 6 && !hubs.includes(r)).sort(() => rnd() - 0.5).slice(0, mobile ? 8 : 13);
  const links = [];
  leaves.forEach((l) => {
    let best = hubs[0], bd = Infinity;
    hubs.forEach((h) => { const d = Math.hypot(h.x - l.x, h.z - l.z); if (d < bd) { bd = d; best = h; } });
    if (best) links.push([best, l]);
  });
  for (let i = 0; i < hubs.length; i++) for (let j = i + 1; j < hubs.length; j++) if (j === i + 1 || rnd() < 0.4) links.push([hubs[i], hubs[j]]);
  const at = (r) => tilt(r.x, r.y + 0.06, r.z); // nodes hover just above the roofs

  const lineV = [];
  links.forEach(([a, b]) => lineV.push(...at(a), ...at(b)));
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineV, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xe6eef2, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  field.add(new THREE.LineSegments(lineGeometry, lineMaterial));

  // diamond outline markers; hubs larger and in the one cyan accent
  const nodeP = [], nodeS = [], nodeH = [];
  hubs.forEach((h) => { nodeP.push(...at(h)); nodeS.push(16); nodeH.push(1); });
  leaves.forEach((l) => { nodeP.push(...at(l)); nodeS.push(9); nodeH.push(0); });
  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodeP, 3));
  nodeGeometry.setAttribute('aSize', new THREE.Float32BufferAttribute(nodeS, 1));
  nodeGeometry.setAttribute('aHub', new THREE.Float32BufferAttribute(nodeH, 1));
  const nodeUniforms = { uAlpha: { value: 0 }, uPx: uniforms.uPx, uTime: uniforms.uTime };
  const nodeMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: nodeUniforms,
    vertexShader: `
      uniform float uPx; uniform float uTime; attribute float aSize; attribute float aHub; varying float vHub;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uPx * (1.0 + aHub * 0.15 * sin(uTime * 2.0 + position.x * 5.0));
        vHub = aHub;
      }`,
    fragmentShader: `
      uniform float uAlpha; varying float vHub;
      void main() {
        vec2 q = abs(gl_PointCoord - 0.5);
        float d = q.x + q.y;
        if (d > 0.5) discard;
        float ring = smoothstep(0.32, 0.38, d);
        vec3 c = mix(vec3(0.92, 0.95, 0.96), vec3(0.42, 0.86, 0.92), vHub);
        gl_FragColor = vec4(c, ring * uAlpha);
      }`,
  });
  const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
  nodes.frustumCulled = false;
  field.add(nodes);

  // data pulses travel from each rooftop into its hub
  const pulseA = [], pulseB = [], pulseO = [];
  links.forEach(([a, b]) => {
    const n = 1 + (rnd() < 0.4 ? 1 : 0);
    for (let i = 0; i < n; i++) { pulseA.push(...at(a)); pulseB.push(...at(b)); pulseO.push(rnd()); }
  });
  const pulseGeometry = new THREE.BufferGeometry();
  pulseGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pulseA, 3));
  pulseGeometry.setAttribute('aEnd', new THREE.Float32BufferAttribute(pulseB, 3));
  pulseGeometry.setAttribute('aOffset', new THREE.Float32BufferAttribute(pulseO, 1));
  const pulseMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: nodeUniforms,
    vertexShader: `
      uniform float uPx; uniform float uTime; attribute vec3 aEnd; attribute float aOffset; varying float vA;
      void main() {
        float t = fract(uTime * 0.18 + aOffset);
        vec3 p = mix(aEnd, position, t);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = 4.0 * uPx;
        vA = sin(t * 3.14159);
      }`,
    fragmentShader: `
      uniform float uAlpha; varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(0.75, 0.95, 1.0, (1.0 - d * 2.0) * vA * uAlpha);
      }`,
  });
  const pulses = new THREE.Points(pulseGeometry, pulseMaterial);
  pulses.frustumCulled = false;
  field.add(pulses);

  let height = 1;
  return {
    group: field,
    resize(w, h) {
      height = h;
      const s = h / 2;
      field.scale.setScalar(s);
      uniforms.uDist.value = s / Math.tan(Math.PI / 12); // camera distance, px
      uniforms.uPx.value = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 2);
      // on narrow screens the city centre slides to the middle of the frame
      field.position.x = (w / h < 1 ? -CX : -CX * 0.3) * s;
    },
    update(time, progress, intro) {
      const t = reduced ? 0 : time;
      uniforms.uTime.value = t;
      uniforms.uIntro.value = intro;
      // a slow orbit; scrolling dives the camera down into the streets
      field.rotation.y = Math.sin(t * 0.04) * 0.04;
      // accelerating dive into the towers: the journey field takes over
      field.position.z = (progress * 1.2 + progress * progress * 6) * (height / 2);
      const net = Math.max(0, intro * 1.4 - 0.4) * (1 - progress);
      lineMaterial.opacity = 0.2 * net;
      nodeUniforms.uAlpha.value = 0.9 * net;
    },
    destroy() {
      [geometry, lineGeometry, nodeGeometry, pulseGeometry].forEach((g) => g.dispose());
      [material, lineMaterial, nodeMaterial, pulseMaterial].forEach((m) => m.dispose());
      scene.remove(field);
    },
  };
}
