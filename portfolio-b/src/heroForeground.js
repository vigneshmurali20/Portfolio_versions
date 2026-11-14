// Hero foreground layer: what floats between the viewer and the subject.
// Out-of-focus scan dust, a few blurred leaf returns framing the bottom
// corners, and fine bright specks. It sits closer to the camera than the
// portrait, so it moves the most when the camera drifts and rushes past
// when you scroll, which is what sells the depth.
export function createHeroForeground({ THREE, scene, reduced }) {
  const layer = new THREE.Group();
  layer.name = 'hero-foreground';
  layer.renderOrder = 6;
  scene.add(layer);

  const mobile = matchMedia('(max-width: 860px)').matches;
  let seed = 7741;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  // positions are in units of half the hero height; z is a fraction of the
  // camera distance (0 = the portrait plane, 0.6 = most of the way to the lens)
  const P = [], C = [], S = [], A = [];
  const add = (x, y, z, c, size, alpha) => { P.push(x, y, z); C.push(...c); S.push(size); A.push(alpha); };

  // soft bokeh dust
  for (let i = 0; i < (mobile ? 26 : 46); i++) {
    const v = 0.7 + rnd() * 0.3;
    add((rnd() * 2 - 1) * 2.2, (rnd() * 2 - 1) * 1.1, 0.25 + rnd() * 0.4, [v, v, v * 0.95], 18 + rnd() * 46, 0.05 + rnd() * 0.08);
  }
  // blurred leaves framing the lower corners, like foliage right at the lens
  for (let i = 0; i < (mobile ? 60 : 120); i++) {
    const side = rnd() < 0.5 ? -1 : 1;
    const x = side * (1.5 + Math.pow(rnd(), 0.7) * 1.1);
    const y = -1.05 + Math.pow(rnd(), 1.6) * 0.75;
    const g = 0.25 + rnd() * 0.25;
    add(x, y, 0.35 + rnd() * 0.25, [g * 0.55, g, g * 0.42], 26 + rnd() * 60, 0.05 + rnd() * 0.07);
  }
  // fine specks catching light
  for (let i = 0; i < (mobile ? 140 : 280); i++) {
    const v = 0.85 + rnd() * 0.15;
    add((rnd() * 2 - 1) * 2.1, (rnd() * 2 - 1) * 1.1, 0.08 + rnd() * 0.3, [v, v, v], 1.5 + rnd() * 2.2, 0.25 + rnd() * 0.45);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(C, 3));
  geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(S, 1));
  geometry.setAttribute('aAlpha', new THREE.Float32BufferAttribute(A, 1));
  const uniforms = {
    uTime: { value: 0 }, uHalf: { value: 450 }, uDist: { value: 1680 }, uPx: { value: 1 },
    uRush: { value: 0 }, uAlpha: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms,
    vertexShader: `
      uniform float uTime; uniform float uHalf; uniform float uDist; uniform float uPx; uniform float uRush;
      attribute vec3 aColor; attribute float aSize; attribute float aAlpha;
      varying vec3 vColor; varying float vAlpha; varying float vSoft;
      void main() {
        float s = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);
        vec3 p = vec3(position.xy * uHalf, position.z * uDist);
        p.x += sin(uTime * 0.15 + s * 30.0) * 14.0;
        p.y += cos(uTime * 0.11 + s * 20.0) * 10.0 + mod(uTime * 6.0 + s * 900.0, 900.0) * 0.02;
        p.z += uRush * uDist * 0.55;                 // scrolling pushes it past the lens
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float near = uDist / max(1.0, -mv.z);
        gl_PointSize = min(180.0, aSize * uPx * near);
        vColor = aColor;
        vSoft = aSize > 12.0 ? 1.0 : 0.0;
        vAlpha = aAlpha * smoothstep(0.02, 0.25, -mv.z / uDist);
      }`,
    fragmentShader: `
      uniform float uAlpha; varying vec3 vColor; varying float vAlpha; varying float vSoft;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float edge = mix(1.0 - smoothstep(0.25, 0.5, d), 1.0 - smoothstep(0.0, 0.5, d), vSoft);
        gl_FragColor = vec4(vColor, edge * vAlpha * uAlpha);
      }`,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = 6;
  layer.add(points);

  return {
    group: layer,
    resize(w, h, dist) {
      uniforms.uHalf.value = h / 2;
      uniforms.uDist.value = dist;
      uniforms.uPx.value = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 2);
    },
    update(time, progress, intro) {
      uniforms.uTime.value = reduced ? 0 : time;
      uniforms.uRush.value = progress;
      uniforms.uAlpha.value = intro * (1 - progress * 0.6);
    },
    destroy() { geometry.dispose(); material.dispose(); scene.remove(layer); },
  };
}
