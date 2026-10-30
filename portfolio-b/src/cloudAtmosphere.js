import * as THREE from 'three';

const vertex = `varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fragment = `
uniform sampler2D uCloud;
uniform float uTime;
uniform float uBreeze;
uniform float uPhase;
uniform float uOpacity;
uniform vec2 uPointer;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
}
float fbm(vec2 p){float value=0.,weight=.57;for(int i=0;i<3;i++){value+=weight*noise(p);p=mat2(1.6,1.2,-1.2,1.6)*p+3.7;weight*=.5;}return value;}
void main(){
  float t=uTime*.09+uPhase;
  vec2 p=vUv*vec2(5.5,2.7);
  vec2 flow=vec2(fbm(p+vec2(t,-t*.28)),fbm(p+vec2(-t*.6,t*.37)+8.2))-.5;
  vec2 delta=(vUv-uPointer)*vec2(2.4,1.);
  float localWind=exp(-dot(delta,delta)*9.)*uBreeze;
  vec2 uv=vUv+flow*vec2(.025,.045);
  uv+=vec2(sin(t*.7)*.009,cos(t*.5)*.006);
  uv+=delta*localWind*.025;
  vec4 cloud=texture2D(uCloud,clamp(uv,vec2(.001),vec2(.999)));
  float density=fbm(p*1.7+vec2(-t*.45,t*.2));
  float edge=1.-smoothstep(.2,.8,cloud.a);
  // Slow local formation/erosion, with overlapping noise fields so a layer
  // never cuts out as a whole. Density varies smoothly even without hover.
  float formation=smoothstep(.16,.68,density+sin(t*.65+p.x*.7)*.10);
  cloud.a*=mix(.42,1.,formation);
  cloud.a*=mix(1.,smoothstep(.08,.65,density+cloud.a*.35),edge*.55);
  cloud.rgb*=.98+density*.035;
  gl_FragColor=vec4(cloud.rgb,clamp(cloud.a*uOpacity,0.,1.));
}`;

// Real cloud photography supplies the volume; advected fractal noise evolves
// the contours and wisps continuously. Mouse movement adds local airflow.
export function createCloudAtmosphere({ scene, camera, hero, reduced }) {
  const elements = [...hero.querySelectorAll('.cinema-cloud')];
  const geometry = new THREE.PlaneGeometry(1, 1);
  const layers = [];
  let map = null;
  let disposed = false;
  let breeze = 0;
  const pointerTarget = new THREE.Vector2(.5, .5);
  const ready = Promise.all(elements.map(async (element, index) => {
    const image = element.querySelector('img');
    await image.decode();
    if (disposed) return;
    if (!map) { map = new THREE.Texture(image); map.colorSpace = THREE.NoColorSpace; map.needsUpdate = true; }
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex, fragmentShader: fragment, transparent: true,
      depthWrite: false, depthTest: false,
      uniforms: { uCloud: { value: map }, uTime: { value: 0 }, uBreeze: { value: 0 }, uPhase: { value: index * 14.7 }, uOpacity: { value: index ? 1 : .62 }, uPointer: { value: new THREE.Vector2(.5,.5) } },
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = index ? 6 : 0;
    scene.add(mesh); layers.push({ element, image, material, mesh, depth: index ? 100 : -100 });
  })).then(() => { if (!disposed) document.documentElement.classList.add('live-clouds'); }).catch(() => {
    // The photographic CSS layers remain available on decode/GPU failure.
  });

  return { ready,
    update(time, state, dt) {
      breeze += ((state.pointer.inside && !reduced ? 1 : 0) - breeze) * (1 - Math.exp(-2 * dt));
      const hr = hero.getBoundingClientRect();
      layers.forEach(({ element, image, material, mesh, depth }) => {
        const r = image.getBoundingClientRect();
        const k = (camera.position.z - depth) / camera.position.z;
        mesh.scale.set(r.width * k, r.height * k, 1);
        mesh.position.set((r.left - hr.left + r.width / 2 - hr.width / 2) * k, (hr.height / 2 - (r.top - hr.top + r.height / 2)) * k, depth);
        material.uniforms.uTime.value = reduced ? 0 : time;
        material.uniforms.uBreeze.value = breeze;
        const x = (state.pointer.x + 1) / 2 * hr.width;
        const y = (1 - state.pointer.y) / 2 * hr.height;
        pointerTarget.set((x - (r.left - hr.left)) / Math.max(1,r.width), 1 - (y - (r.top - hr.top)) / Math.max(1,r.height));
        material.uniforms.uPointer.value.lerp(pointerTarget, 1 - Math.exp(-3 * dt));
        material.uniforms.uOpacity.value = Number(getComputedStyle(element).opacity);
      });
    },
    destroy() {
      disposed = true;
      layers.forEach(({ mesh, material }) => { scene.remove(mesh); material.dispose(); });
      map?.dispose(); geometry.dispose(); document.documentElement.classList.remove('live-clouds');
    },
  };
}
