import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './client-atlas.css';
import { clientRegions } from './content.js';
import { pointInPolygon } from './globe.js';
import { WORLD_LAND_DOTS, CLIENT_REGION_DOTS, CLIENT_COUNTRY_POLYGONS } from './worldMapData.js';

const REGION_COLORS = {
  US: '#C46D4F',
  AE: '#8B70B7',
  AU: '#648B73',
  GB: '#557D99',
};
const MAP_WIDTH = 3.5;
const MAP_HEIGHT = 1.75;

const toMap = ([longitude, latitude]) => [longitude / 180 * MAP_WIDTH, latitude / 90 * MAP_HEIGHT, 0];

function makePointGeometry(points, bounds) {
  const positions = new Float32Array(points.length * 3);
  const directions = new Float32Array(points.length * 3);
  const phases = new Float32Array(points.length);
  const centerLon = bounds ? (bounds.minLon + bounds.maxLon) / 2 : 0;
  const centerLat = bounds ? (bounds.minLat + bounds.maxLat) / 2 : 0;
  points.forEach((coordinate, index) => {
    const [x, y, z] = toMap(coordinate);
    positions.set([x, y, z], index * 3);
    const dx = x - centerLon / 180 * MAP_WIDTH;
    const dy = y - centerLat / 90 * MAP_HEIGHT;
    const length = Math.hypot(dx, dy) || 1;
    directions.set([dx / length, dy / length, 0], index * 3);
    phases[index] = Math.random() * Math.PI * 2;
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aDirection', new THREE.BufferAttribute(directions, 3));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  return geometry;
}

function pointMaterial(color, size, opacity) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uSize: { value: size },
      uOpacity: { value: opacity },
      uBurst: { value: 0 },
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute vec3 aDirection;
      attribute float aPhase;
      uniform float uSize;
      uniform float uBurst;
      uniform float uTime;
      varying float vPulse;
      void main() {
        vec3 moved = position + aDirection * uBurst * 0.3;
        vec4 viewPosition = modelViewMatrix * vec4(moved, 1.0);
        vPulse = 0.88 + 0.12 * sin(uTime * 1.4 + aPhase);
        gl_PointSize = uSize * (1.0 + uBurst * 1.4) * vPulse;
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vPulse;
      void main() {
        float edge = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.18, 0.5, edge);
        gl_FragColor = vec4(uColor, alpha * uOpacity * vPulse);
      }
    `,
  });
}

function ParticleLayer({ points, bounds, color, size, opacity, burst, animate }) {
  const material = useMemo(() => pointMaterial(color, size, opacity), [color, size, opacity]);
  const geometry = useMemo(() => makePointGeometry(points, bounds), [points, bounds]);
  useFrame((state, delta) => {
    material.uniforms.uTime.value = animate ? state.clock.elapsedTime : 0;
    const target = animate ? (burst ? 1 : 0) : (burst ? 0.25 : 0);
    material.uniforms.uBurst.value = THREE.MathUtils.damp(material.uniforms.uBurst.value, target, 7, delta);
  });
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return (
    <points geometry={geometry} frustumCulled={false}>
      <primitive object={material} attach="material" />
    </points>
  );
}

function AtlasMap({ activeCode, hoveredCode, onHover, onSelect, reducedMotion }) {
  const { viewport } = useThree();
  const scale = Math.min(viewport.width / 7, viewport.height / 3.5);
  const regional = useMemo(() => clientRegions.map((region) => {
    const points = CLIENT_REGION_DOTS[region.code] ?? [];
    const bounds = points.reduce((box, [lon, lat]) => ({ minLon: Math.min(box.minLon, lon), maxLon: Math.max(box.maxLon, lon), minLat: Math.min(box.minLat, lat), maxLat: Math.max(box.maxLat, lat) }), { minLon: 180, maxLon: -180, minLat: 90, maxLat: -90 });
    return { ...region, points, bounds };
  }), []);
  const countryContains = (code, lon, lat) => CLIENT_COUNTRY_POLYGONS[code]?.some((polygon) => pointInPolygon(lon, lat, polygon));
  const handleMove = (event) => {
    event.stopPropagation();
    const longitude = event.point.x / (MAP_WIDTH * scale) * 180;
    const latitude = event.point.y / (MAP_HEIGHT * scale) * 90;
    const region = clientRegions.find(({ code }) => countryContains(code, longitude, latitude));
    onHover(region?.code ?? null);
    document.body.style.cursor = region ? 'pointer' : '';
  };
  const selectAtPoint = (event) => {
    event.stopPropagation();
    const longitude = event.point.x / (MAP_WIDTH * scale) * 180;
    const latitude = event.point.y / (MAP_HEIGHT * scale) * 90;
    const region = clientRegions.find(({ code }) => countryContains(code, longitude, latitude));
    if (region) onSelect(region.code);
  };
  return (
    <>
      <group scale={[scale, scale, 1]}>
        <ParticleLayer points={WORLD_LAND_DOTS} bounds={null} color={LAND_COLOR} size={2.2} opacity={0.76} burst={false} animate={false} />
        {regional.map((region) => (
          <ParticleLayer key={region.code} points={region.points} bounds={region.bounds} color={REGION_COLORS[region.code]} size={3.2} opacity={region.code === activeCode || region.code === hoveredCode ? 1 : 0.9} burst={region.code === hoveredCode} animate={!reducedMotion} />
        ))}
        <mesh position={[0, 0, -0.1]} onPointerMove={handleMove} onClick={selectAtPoint}>
          <planeGeometry args={[7, 3.5]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

function AtlasFallback() { return null; }

function ClientAtlas() {
  const [activeCode, setActiveCode] = useState(clientRegions[0].code);
  const [hoveredCode, setHoveredCode] = useState(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const visualRef = useRef(null);
  const activeRegion = clientRegions.find(({ code }) => code === activeCode) ?? clientRegions[0];

  useEffect(() => {
    const node = visualRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <>
      <div className="atlas__copy">
        <p className="global__kicker"><span /> Client map</p>
        <h3 className="global__country" data-globe-name>{activeRegion.name}</h3>
        <div className="global__total" aria-live="polite" aria-atomic="true">
          <strong data-globe-count>{activeRegion.count == null ? 'Count pending' : activeRegion.count}</strong>
          <span>clients worked with</span>
        </div>
        <p className="global__hint">Select a highlighted country to explore.</p>
      </div>
      <div className="atlas__visual" ref={visualRef} onPointerLeave={() => { setHoveredCode(null); document.body.style.cursor = ''; }}>
        <div className="atlas__topline"><span>01 / GLOBAL CLIENTS</span><span>HOVER · SELECT</span></div>
        <div className="atlas__map" role="group" aria-label="Interactive dotted world atlas highlighting client countries">
          <Canvas orthographic camera={{ position: [0, 0, 10], zoom: 100, near: 0.1, far: 50 }} dpr={[1, 1.5]} frameloop={visible ? 'always' : 'never'} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={<AtlasFallback />}>
            {visible && <AtlasMap activeCode={activeCode} hoveredCode={hoveredCode} onHover={(code) => { setHoveredCode(code); if (code) setActiveCode(code); }} onSelect={(code) => { setActiveCode(code); setHoveredCode(code); }} reducedMotion={reducedMotion} />}
          </Canvas>
          {clientRegions.map((region) => {
            const selected = activeCode === region.code;
            const hovered = hoveredCode === region.code;
            const anchors = { US: { left: '23%', top: '28%' }, GB: { left: '49%', top: '20%' }, AE: { left: '65%', top: '37%' }, AU: { left: '87%', top: '64%' } };
            return <button key={region.code} type="button" className={`atlas__pin${selected ? ' is-active' : ''}${hovered ? ' is-hovered' : ''}`} style={{ ...anchors[region.code], '--region-color': REGION_COLORS[region.code] }} aria-label={`${region.name}: ${region.count == null ? 'client count pending' : `${region.count} clients`}`} aria-pressed={selected} onClick={() => { setActiveCode(region.code); setHoveredCode(region.code); }} onPointerEnter={() => { setHoveredCode(region.code); setActiveCode(region.code); }} onPointerLeave={() => setHoveredCode(null)} onFocus={() => { setActiveCode(region.code); setHoveredCode(region.code); }}>
              <span className="atlas__pin-code">{region.short}</span><span className="atlas__pin-count">{region.count == null ? 'Pending' : region.count}</span>
            </button>;
          })}
        </div>
        <div className="atlas__regions" role="group" aria-label="Choose a client country">
          {clientRegions.map((region) => {
            const selected = region.code === activeCode;
            const hovered = region.code === hoveredCode;
            return <button key={region.code} className={`atlas__region${selected ? ' is-active' : ''}${hovered ? ' is-hovered' : ''}`} type="button" aria-pressed={selected} onClick={() => { setActiveCode(region.code); setHoveredCode(region.code); }} onPointerEnter={() => { setHoveredCode(region.code); setActiveCode(region.code); }} onPointerLeave={() => setHoveredCode(null)} onFocus={() => setActiveCode(region.code)}>
              <span className="atlas__swatch" style={{ '--region-color': REGION_COLORS[region.code] }} aria-hidden="true">{region.short}</span>
              <span className="atlas__region-copy"><span className="atlas__region-name">{region.name}</span><span className="atlas__region-count">{region.count == null ? 'Count pending' : `${region.count} clients`}</span></span>
              <span className="atlas__region-arrow" aria-hidden="true">↗</span>
            </button>;
          })}
        </div>
      </div>
    </>
  );
}

export function mountClientAtlas(rootElement) {
  if (!rootElement) return null;
  rootElement.classList.add('atlas');
  const root = createRoot(rootElement);
  root.render(<ClientAtlas />);
  return () => { root.unmount(); rootElement.classList.remove('atlas'); };
}
