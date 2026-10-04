import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Orb } from "../components/Orb";
import { Caption } from "../components/Overlay";
import { C, clamp, ease, FPS, hexA, HEIGHT, lerp, LOGO_PATH, prog, rng, WIDTH } from "../theme";

// 03 FORM & DEPTH — a Three.js point cloud blooms into a rotating sphere around
// the planet, then re-forms as Vignesh's V logo.
const N = 900;
const RADIUS = 2.7;

function sampleLogo(count: number): Array<[number, number, number]> {
  const w = 400;
  const h = 280;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d")!;
  g.translate(0, h - 2);
  g.scale((w / 39.25) * 0.98, (-h / 27.3) * 0.98);
  g.fill(new Path2D(LOGO_PATH));
  const data = g.getImageData(0, 0, w, h).data;
  const r = rng(7);
  const pts: Array<[number, number, number]> = [];
  let guard = 0;
  while (pts.length < count && guard++ < 300000) {
    const x = Math.floor(r() * w);
    const y = Math.floor(r() * h);
    if (data[(y * w + x) * 4 + 3] > 128) {
      // world units: logo ~6 wide, centred, y up
      pts.push([((x - w / 2) / w) * 6.4, (-(y - h / 2) / h) * 4.48 + 0.15, (r() - 0.5) * 0.25]);
    }
  }
  return pts;
}

export const Form: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { width, height } = useVideoConfig();

  const data = useMemo(() => {
    const r = rng(11);
    const ga = Math.PI * (3 - Math.sqrt(5));
    const sphere = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = ga * i;
      return [Math.cos(th) * rad, y, Math.sin(th) * rad] as [number, number, number];
    });
    const kinds = Array.from({ length: N }, () => {
      const k = r();
      return k < 0.1 ? C.purple : k < 0.16 ? C.cyan : C.ink;
    });
    const delays = Array.from({ length: N }, () => r() * 0.25);
    return { sphere, kinds, delays, logo: sampleLogo(N) };
  }, []);

  const dotTexture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    g.beginPath();
    g.arc(32, 32, 30, 0, Math.PI * 2);
    g.fillStyle = "#fff";
    g.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const appear = ease.outExpo(prog(t, 0, 0.6));
  const morph = prog(t, 0.85, 1.55);
  const collapse = ease.inExpo(prog(t, 1.72, 1.9));
  const rotY = t * 1.1 * (1 - ease.outCubic(morph) * 0.85);
  const rotX = 0.38 * (1 - ease.inOutCubic(morph));
  const logoTurn = Math.sin(t * 1.4) * 0.25 * morph;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const mist = new THREE.Color(C.mist);
    const cy = Math.cos(rotY);
    const sy = Math.sin(rotY);
    const cx = Math.cos(rotX);
    const sx = Math.sin(rotX);
    const cl = Math.cos(logoTurn);
    const sl = Math.sin(logoTurn);
    for (let i = 0; i < N; i++) {
      const [px, py, pz] = data.sphere[i];
      // rotate sphere point
      let X = px * cy + pz * sy;
      let Z = -px * sy + pz * cy;
      const Y = py * cx - Z * sx;
      Z = py * sx + Z * cx;
      const R = RADIUS * appear;
      const [lx, ly, lz] = data.logo[i % data.logo.length];
      const LX = lx * cl + lz * sl;
      const LZ = -lx * sl + lz * cl;
      const m = ease.inOutCubic(clamp((morph - data.delays[i]) / 0.75));
      let x = lerp(X * R, LX, m);
      let y = lerp(Y * R, ly, m);
      let z = lerp(Z * R, LZ, m);
      x = lerp(x, 0, collapse);
      y = lerp(y, 0, collapse);
      z = lerp(z, 0, collapse);
      pos.set([x, y, z], i * 3);
      // far side of the sphere fades into the mist ground
      const depth = lerp(clamp((Z + 1) / 2) * 0.75 + 0.25, 1, m);
      const base = new THREE.Color(m > 0.5 && data.kinds[i] === C.ink ? C.deep : data.kinds[i]);
      const c = mist.clone().lerp(base, depth);
      col.set([c.r, c.g, c.b], i * 3);
    }
    return { positions: pos, colors: col };
  }, [data, appear, morph, collapse, rotX, rotY, logoTurn]);

  return (
    <AbsoluteFill style={{ background: collapse > 0.97 ? C.ink : C.mist }}>
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 300 * appear,
          top: HEIGHT / 2 + 360,
          width: 600 * appear,
          height: 64 * appear,
          borderRadius: "50%",
          background: hexA(C.deep, 0.16 * (1 - morph)),
          filter: "blur(10px)",
        }}
      />
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 10], fov: 35 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1} />
        <points key={frame}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.105} map={dotTexture} vertexColors alphaTest={0.5} sizeAttenuation transparent={false} />
        </points>
      </ThreeCanvas>
      <Orb x={WIDTH / 2} y={HEIGHT / 2} r={lerp(22, 12, morph) * (1 - collapse * 0.3)} glow={0.6 * (1 - morph)} />
      <Caption t={t} text="4 years. 9 disciplines." from={0.6} to={1.72} color={C.ink} />
    </AbsoluteFill>
  );
};
