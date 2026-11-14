// Hero-only point-cloud environment: distant scan terrain/city and near drifting field.
export function createHeroWorld({ THREE, scene, reduced }) {
  const background = new THREE.Group(); background.name = 'hero-scan-background'; scene.add(background);
  const foreground = new THREE.Group(); foreground.name = 'hero-particle-foreground'; scene.add(foreground);
  const uniforms = { uTime:{value:0}, uTravel:{value:0}, uPointer:{value:new THREE.Vector2()}, uOpacity:{value:0.82} };
  const vertex = `uniform float uTime; uniform float uTravel; uniform vec2 uPointer; attribute float aSeed; attribute float aLayer; varying float vAlpha; varying float vSeed;
    void main(){ vec3 p=position; float z=p.z; p.y += uTravel*.025;
      if(aLayer<0.5){ p.x += sin(uTime*.22+aSeed*8.)*.012; p.y += sin(p.x*2.2+aSeed*6.)*.012; }
      else { p.x += sin(uTime*.34+aSeed*12.)*.035; p.y += cos(uTime*.27+aSeed*9.)*.022; }
      vec2 delta=p.xy-uPointer; float d=length(delta); float repel=exp(-d*7.)*(aLayer<.5?.045:.12);
      p.xy += normalize(delta+vec2(.0001))*repel; p.z=z+sin(uTime*.3+aSeed*7.)*.01;
      vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
      gl_PointSize=(aLayer<.5?1.35:2.2)+aSeed*(aLayer<.5?1.2:2.8); vAlpha=(aLayer<.5?.36:.42)+aSeed*.46; vSeed=aSeed;
 }`;
  const fragment = `uniform float uOpacity; varying float vAlpha; varying float vSeed; void main(){ float r=length(gl_PointCoord-.5); float a=1.-smoothstep(.12,.5,r); vec3 c=mix(vec3(.15,.83,.96),vec3(.76,.35,1.),vSeed); gl_FragColor=vec4(c,a*vAlpha*uOpacity); }`;
  const points=(parent,positions,seeds,layers)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('aSeed',new THREE.Float32BufferAttribute(seeds,1));g.setAttribute('aLayer',new THREE.Float32BufferAttribute(layers,1));const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms,vertexShader:vertex,fragmentShader:fragment});const p=new THREE.Points(g,m);parent.add(p);return {g,m,p};};
  const pos=[],seed=[],layer=[];
  // Dense scan terrain: layered ridgelines recede behind the portrait.
  for(let row=0;row<78;row++){const y=-.18+row*.009;for(let col=0;col<150;col++){const x=-1.25+col*.017;const ridge=Math.sin(x*4.4+row*.07)*.04+Math.sin(x*9-row*.025)*.016;const valley=Math.exp(-Math.pow((x+.08)/.38,2))*.09;const yy=y+ridge+valley;if(yy<.76){pos.push(x,yy,-.35-row*.001);seed.push(Math.random());layer.push(0);}}}
  // Sparse skyline scan points, independently positioned behind the subject.
  for(let b=0;b<22;b++){const x=-1.18+b*.112,w=.025+Math.random()*.026,h=.08+Math.random()*.18;for(let j=0;j<70;j++){const px=x+(Math.random()-.5)*w,py=-.05+Math.random()*h;pos.push(px,py,-.18);seed.push(Math.random());layer.push(0);}}
  const back=points(background,pos,seed,layer);
  const fp=[],fs=[],fl=[];
  for(let i=0;i<640;i++){fp.push((Math.random()-.5)*2.7,(Math.random()-.5)*1.8,.08+Math.random()*.42);fs.push(Math.random());fl.push(1);}
  const near=points(foreground,fp,fs,fl);
  let width=1,height=1;
  return { resize(w,h){width=w;height=h;background.scale.set(w/2,h/2,1);foreground.scale.set(w/2,h/2,1);}, update(t,progress,pointer){uniforms.uTime.value=reduced?0:t;uniforms.uTravel.value=progress;uniforms.uPointer.value.set(pointer?.inside?pointer.x*.5:0,pointer?.inside?pointer.y*.5:0);}, destroy(){for(const item of [back,near]){item.g.dispose();item.m.dispose();}scene.remove(background,foreground);} };
}
