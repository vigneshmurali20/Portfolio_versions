// A soft particle-forest clearing, rendered as one independent Three.js background layer.
export function createHeroWorld({ THREE, scene, reduced }) {
  const field = new THREE.Group();
  field.name = 'hero-particle-forest-background';
  scene.add(field);

  let state = 173;
  const random = () => { state = (state * 16807) % 2147483647; return (state - 1) / 2147483646; };
  const positions = [], colors = [], seeds = [], layers = [];
  const palettes = {
    leaf: [[.54,.58,.55],[.78,.81,.75],[.34,.41,.36],[.63,.69,.58]],
    moss: [[.28,.39,.27],[.46,.57,.36],[.67,.69,.47],[.19,.28,.23]],
    bark: [[.57,.59,.57],[.82,.82,.78],[.39,.42,.41]],
    mist: [[.47,.51,.51],[.68,.69,.65]]
  };
  const point = (x,y,z,palette,layer=0) => {
    const c = palette[Math.floor(random()*palette.length)];
    positions.push(x,y,z); colors.push(c[0],c[1],c[2]); seeds.push(.35+random()*.65); layers.push(layer);
  };
  const branch = (x1,y1,x2,y2,count,z) => {
    for(let i=0;i<count;i++){
      const t=random(), spread=(.004+Math.sin(t*Math.PI)*.012)*(random()-.5);
      point(x1+(x2-x1)*t+spread,y1+(y2-y1)*t+spread,z+random()*8,palettes.bark,0);
    }
  };

  // A broken tree line frames a quiet clearing in the center.
  const trees=[
    {x:-.91,y:.20,w:.20,h:.27,z:-118},
    {x:-.62,y:.29,w:.27,h:.31,z:-156},
    {x:-.30,y:.37,w:.22,h:.27,z:-210},
    {x:.34,y:.38,w:.23,h:.28,z:-208},
    {x:.66,y:.28,w:.27,h:.32,z:-154},
    {x:.94,y:.19,w:.19,h:.26,z:-116},
    {x:.08,y:.55,w:.16,h:.18,z:-270}
  ];
  trees.forEach((tree,index)=>{
    const {x,y,w,h,z}=tree, base=y-h-.31, crown=y+h*.12;
    branch(x,base,x,crown,460,z);
    const limbs=5+Math.floor(random()*4);
    for(let b=0;b<limbs;b++){
      const side=b%2?1:-1, start=base+(crown-base)*(.35+random()*.48);
      const endX=x+side*w*(.38+random()*.48), endY=crown+h*(.06+random()*.38);
      branch(x,start,endX,endY,130,z-8);
      branch(endX,endY,endX+side*w*.23,endY+h*.15,75,z-10);
    }
    // Overlapping elliptical clusters create a noisy scanned canopy, not a flat leaf shape.
    const lobes=12;
    for(let l=0;l<lobes;l++){
      const a=l/lobes*Math.PI*2, ring=.52+random()*.18;
      const cx=x+Math.cos(a)*w*ring, cy=crown+Math.sin(a)*h*ring;
      const rx=w*(.27+random()*.13), ry=h*(.22+random()*.14);
      for(let j=0;j<370;j++){
        const q=Math.sqrt(random()), t=random()*Math.PI*2;
        const px=cx+Math.cos(t)*rx*q, py=cy+Math.sin(t)*ry*q;
        if(Math.abs(px-x)<w*.13 && py<crown+h*.22) continue;
        point(px,py,z+random()*24,palettes.leaf,1);
      }
    }
  });

  // A low, broken scan of grass and earth, brighter around the open clearing.
  for(let i=0;i<10500;i++){
    const x=(random()*2-1)*1.18, edge=Math.pow(Math.abs(x),1.35);
    const ground=-.39-edge*.20+(random()-.5)*(.08+edge*.12);
    const clearing=Math.exp(-Math.pow(x/.43,2));
    const color=random()<clearing*.68?palettes.moss:palettes.leaf;
    point(x,ground,-72+random()*45,color,2);
  }
  // Soft suspended dust catches light above the clearing.
  for(let i=0;i<2600;i++){
    const x=(random()*2-1)*.9, y=-.20+random()*.68;
    if(random()>.32 && Math.abs(x)<.42) continue;
    point(x,y,-185+random()*100,palettes.mist,1);
  }

  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('aColor',new THREE.Float32BufferAttribute(colors,3));
  geometry.setAttribute('aSeed',new THREE.Float32BufferAttribute(seeds,1));
  geometry.setAttribute('aLayer',new THREE.Float32BufferAttribute(layers,1));
  const uniforms={uTime:{value:0},uPointer:{value:new THREE.Vector2()},uOpacity:{value:.8}};
  const material=new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,vertexColors:true,blending:THREE.AdditiveBlending,
    uniforms,
    vertexShader:`uniform float uTime; uniform vec2 uPointer; attribute vec3 aColor; attribute float aSeed; attribute float aLayer; varying vec3 vColor; varying float vAlpha;
      void main(){vec3 p=position; float sway=(aLayer==1.0?sin(uTime*.36+aSeed*9.0)*.006:0.0); p.x+=sway+uPointer.x*.004; p.y+=cos(uTime*.25+aSeed*7.0)*sway+uPointer.y*.003;
      vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=(.85+aSeed*1.8)*(aLayer==2.0?.8:1.0);
      vColor=aColor; vAlpha=(.24+aSeed*.5)*(aLayer==2.0?.38:1.0);}`,
    fragmentShader:`varying vec3 vColor; varying float vAlpha; uniform float uOpacity;
      void main(){float r=length(gl_PointCoord-.5); float dot=1.0-smoothstep(.12,.5,r); gl_FragColor=vec4(vColor,dot*vAlpha*uOpacity);}`
  });
  const points=new THREE.Points(geometry,material);
  points.frustumCulled=false; field.add(points);

  // Delicate scan geometry links distant points like a lidar survey.
  const vertices=[];
  const anchors=[[-.92,.25],[-.68,.48],[-.38,.34],[.08,.63],[.41,.39],[.72,.5],[.95,.22]];
  [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[0,2],[2,4],[4,6]].forEach(([a,b])=>{
    vertices.push(anchors[a][0],anchors[a][1],-300,anchors[b][0],anchors[b][1],-300);
  });
  const lineGeometry=new THREE.BufferGeometry(); lineGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  const lineMaterial=new THREE.LineBasicMaterial({color:0x9ba8a1,transparent:true,opacity:.12,depthWrite:false});
  const links=new THREE.LineSegments(lineGeometry,lineMaterial); field.add(links);

  return {
    resize(w,h){field.scale.set(w/2,h/2,1);},
    update(time,progress,pointer){uniforms.uTime.value=reduced?0:time;uniforms.uPointer.value.set(pointer?.inside?pointer.x:0,pointer?.inside?pointer.y:0);},
    destroy(){geometry.dispose();material.dispose();lineGeometry.dispose();lineMaterial.dispose();scene.remove(field);}
  };
}
