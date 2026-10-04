import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Orb } from "../components/Orb";
import { Caption } from "../components/Overlay";
import { C, clamp, ease, FPS, hexA, HEIGHT, lerp, prog, rng, WIDTH } from "../theme";

// 06 DEPTH & SPEED — a Three.js tunnel of broken rings rushes toward the
// camera, accelerating, then collapses into a single ring around the planet.
const RINGS = 18;
const DEPTH = 40;

export const Depth: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { width, height } = useVideoConfig();
  const rings = useMemo(() => {
    const r = rng(23);
    return Array.from({ length: RINGS }, (_, i) => ({
      arcs: Array.from({ length: 3 + Math.floor(r() * 3) }, () => ({ start: r() * Math.PI * 2, len: 0.25 + r() * 1.2 })),
      color: [C.white, C.purple, C.cyan, C.lilac][Math.floor(r() * 4)],
      spin: (r() - 0.5) * 2.4,
      phase: i / RINGS,
      tube: 0.012 + r() * 0.02,
    }));
  }, []);
  // speed ramps up: travel is the integral of an accelerating speed
  const travel = 0.22 * t + 0.3 * Math.pow(Math.min(t, 1.8), 3) / 3;
  const collapse = ease.inOutExpo(prog(t, 1.75, 2.1));
  const appear = ease.outExpo(prog(t, 0, 0.5));

  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 6], fov: 60, far: 100 }} gl={{ alpha: true, antialias: true }}>
        <fog attach="fog" args={[C.ink, 8, DEPTH]} />
        <ambientLight intensity={1} />
        {rings.map((ring, i) => {
          const z = (ring.phase + travel) % 1; // 0 far → 1 at the camera
          const zPos = lerp(-DEPTH, 5.5, z);
          const radius = 1.9 * appear;
          const opacity = clamp(z * 4) * clamp((1 - z) * 8) * (1 - collapse);
          return (
            <group key={i} position={[0, 0, zPos]} rotation={[0, 0, t * ring.spin]}>
              {ring.arcs.map((a, j) => (
                <mesh key={j} rotation={[0, 0, a.start]}>
                  <torusGeometry args={[radius, ring.tube * (1 + z * 2), 6, 64, a.len]} />
                  <meshBasicMaterial color={ring.color} transparent opacity={opacity} />
                </mesh>
              ))}
            </group>
          );
        })}
      </ThreeCanvas>
      {collapse > 0 && (
        <div
          style={{
            position: "absolute",
            left: WIDTH / 2 - 70,
            top: HEIGHT / 2 - 70,
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: `2px solid ${hexA(C.white, 0.7 * collapse)}`,
            transform: `scale(${lerp(6, 1, collapse)})`,
          }}
        />
      )}
      <Orb x={WIDTH / 2} y={HEIGHT / 2} r={30} glow={1} />
      <Caption t={t} text="Made for tech brands." from={0.45} to={1.7} />
    </AbsoluteFill>
  );
};
