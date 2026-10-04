import { ThreeCanvas } from "@remotion/three";
import { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EI, EO, k } from "../lib/anim";

export const CATEGORIES = ["vapes", "prerolls", "flower", "edibles", "extracts", "drinks", "wellness", "accessories"] as const;
const TILE_COLORS = ["#11A4AC", "#0B6E76", "#D3F0EF", "#0E8890", "#0A5C63", "#BFE9E8", "#13A8B0", "#0B6E76"];

const useIconTextures = () => {
  const [tex, setTex] = useState<THREE.Texture[] | null>(null);
  const [handle] = useState(() => delayRender("category icon textures"));
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Promise.all(CATEGORIES.map((c) => loader.loadAsync(staticFile(`icons/${c}.png`))))
      .then((ts) => {
        ts.forEach((t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 8;
        });
        setTex(ts);
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [handle]);
  return tex;
};

/**
 * Eight glossy category tiles (Figma category icons on rounded slabs) that burst out of the phone
 * and twist into a helix stack. Everything is a pure function of the frame.
 *  appear: frame the burst starts; exit: frame they rush the camera.
 */
export const CategoryStack3D: React.FC<{ appear: number; exit: number; originY?: number }> = ({ appear, exit, originY = -0.9 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tex = useIconTextures();
  const geo = useMemo(() => new RoundedBoxGeometry(1.5, 1.5, 0.42, 5, 0.2), []);

  const spin = frame * 0.05;
  const centerY = -1.05;
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 12], fov: 35 }} style={{ position: "absolute", inset: 0 }}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 7, 9]} intensity={1.7} />
      <directionalLight position={[-6, -2, 4]} intensity={0.5} color="#7FDDE1" />
      <pointLight position={[0, 1, 5]} intensity={6} distance={14} color="#ffffff" />
      {tex
        ? CATEGORIES.map((c, i) => {
            const p = k(frame, appear + i * 2.2, appear + i * 2.2 + 22, 0, 1, EO);
            const out = k(frame, exit + (7 - i) * 0.8, exit + (7 - i) * 0.8 + 12, 0, 1, EI);
            const ph = i * 0.78 + spin;
            const fx = Math.sin(ph) * 1.05;
            const fy = centerY + (3.5 - i) * 0.58;
            const fz = Math.cos(ph) * 0.8 - 0.6;
            const x = THREE.MathUtils.lerp(0, fx, p) * (1 - out * 0.3);
            const y = THREE.MathUtils.lerp(originY, fy, p) + out * (fy - centerY) * 0.4;
            const z = THREE.MathUtils.lerp(-1.2, fz, p) + out * 11;
            const s = THREE.MathUtils.lerp(0.15, 0.66, p);
            const rx = 0.42 + (1 - p) * 1.4;
            const ry = Math.sin(ph) * 0.55 + (1 - p) * Math.PI;
            const rz = (i % 2 ? 0.07 : -0.07) + out * (i % 2 ? 0.6 : -0.6);
            const tex_ = tex[i];
            const img = tex_.image as { width: number; height: number };
            const aspect = img.width / img.height;
            const iw = aspect >= 1 ? 1.12 : 1.12 * aspect;
            const ih = aspect >= 1 ? 1.12 / aspect : 1.12;
            return (
              <group key={c} position={[x, y, z]} rotation={[rx, ry, rz]} scale={s}>
                <mesh geometry={geo}>
                  <meshPhysicalMaterial color={TILE_COLORS[i]} roughness={0.28} metalness={0.05} clearcoat={1} clearcoatRoughness={0.15} />
                </mesh>
                <mesh position={[0, 0, 0.215]}>
                  <planeGeometry args={[iw, ih]} />
                  <meshBasicMaterial map={tex_} transparent toneMapped={false} />
                </mesh>
              </group>
            );
          })
        : null}
    </ThreeCanvas>
  );
};
