import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../components/Overlay";
import { C, ease, FPS, lerp, prog } from "../theme";

// 05 PATH & OFFSET — a twisted figure-eight ribbon of offset strokes draws
// itself in 3D, with the planet riding the leading edge.
const STROKES = 22;
const STEPS = 240;

function ribbon(u: number, k: number): THREE.Vector3 {
  const x = 3.3 * Math.sin(u);
  const y = 1.45 * Math.sin(2 * u) * 0.9;
  const z = 1.3 * Math.cos(u) + (k - STROKES / 2) * 0.055;
  const twist = Math.sin(u) * 0.35 + k * 0.012;
  return new THREE.Vector3(x, y * Math.cos(twist) - z * Math.sin(twist) * 0.3, z);
}

export const Path: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { width, height } = useVideoConfig();
  const draw = ease.inOutCubic(prog(t, 0.05, 1.55));
  const exit = ease.inExpo(prog(t, 1.85, 2.1));
  const span = Math.PI * 2 * draw;
  const rot = -0.5 + t * 0.35;

  const lines = useMemo(
    () =>
      Array.from({ length: STROKES }, (_, k) => {
        const pts: number[] = [];
        for (let s = 0; s <= STEPS; s++) {
          const u = -Math.PI / 2 + (Math.PI * 2 * s) / STEPS;
          const p = ribbon(u, k);
          pts.push(p.x, p.y, p.z);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
        const highlight = k === 14 || k === 15;
        const mat = new THREE.LineBasicMaterial({
          color: highlight ? C.cyan : C.white,
          transparent: true,
          opacity: highlight ? 1 : 0.22 + 0.55 * (k / STROKES),
        });
        return new THREE.Line(geo, mat);
      }),
    [],
  );
  const visible = Math.max(2, Math.floor((STEPS + 1) * draw));
  lines.forEach((l) => l.geometry.setDrawRange(0, visible));
  const head = ribbon(-Math.PI / 2 + span, STROKES / 2);
  const scale = lerp(1, 0.02, exit);

  return (
    <AbsoluteFill style={{ background: exit > 0.97 ? C.ink : C.deep }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 10], fov: 35 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 4, 6]} intensity={60} color={C.lilac} />
        <group rotation={[0.5, rot, 0]} scale={scale}>
          {lines.map((l, i) => (
            <primitive key={i} object={l} />
          ))}
          {draw > 0.001 && (
            <mesh position={head}>
              <sphereGeometry args={[0.16, 48, 48]} />
              <meshStandardMaterial color={C.purple} emissive={C.purple} emissiveIntensity={0.9} roughness={0.25} metalness={0.1} />
            </mesh>
          )}
          {draw > 0.001 && (
            <mesh position={head}>
              <sphereGeometry args={[0.32, 32, 32]} />
              <meshBasicMaterial color={C.lilac} transparent opacity={0.18} />
            </mesh>
          )}
        </group>
      </ThreeCanvas>
      <Caption t={t} text="From dashboards to motion." from={0.55} to={1.9} />
    </AbsoluteFill>
  );
};
