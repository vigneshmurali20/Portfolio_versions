/*
 * The journey backdrop: one fixed canvas behind the page that paints the
 * world you are in, from heaven down to the warm below, and the transitions
 * between them. A single fullscreen shader, drawn at reduced resolution and
 * at most 30 fps, paused when the tab is hidden. Without WebGL the CSS
 * gradients in styles.css (keyed off html[data-world-now]) stand in.
 *
 * uWorld runs 0 → 4 with scroll: 0 heaven, 1 earth, 2 ocean, 3 ocean floor,
 * 4 the warm below. It changes only while a .descent band crosses the middle
 * of the screen, so each world holds still while you read its sections.
 */

const WORLDS = ['heaven', 'earth', 'ocean', 'abyss', 'hell'];
const NAMES = ['Heaven', 'Earth', 'Ocean', 'Ocean floor', 'The warm below'];

const vert = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const frag = `precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uWorld;
uniform float uScroll;
uniform vec2 uSun;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(1.6,1.2,-1.2,1.6)*p;a*=.5;}return v;}

// soft rays fanning down from a point above the screen
float rays(vec2 uv,vec2 o,float n,float t){
  vec2 d=uv-o;float a=atan(d.x,-d.y);
  float r=pow(.5+.5*sin(a*n+t),5.)*.6+pow(.5+.5*sin(a*n*1.7-t*1.3),7.)*.4;
  return r*smoothstep(1.4,.1,length(d));
}

// particles in a moving grid: one dot per cell, drifting with the cell
float dots(vec2 uv,vec2 grid,vec2 drift,float size,float seed){
  vec2 g=uv*grid+drift;vec2 id=floor(g);vec2 f=fract(g)-.5;
  float h=hash(id+seed);vec2 off=vec2(hash(id+seed+1.7),hash(id+seed+4.1))-.5;
  float d=length((f-off*.7)*vec2(grid.y/grid.x,1.));
  return smoothstep(size,0.,d)*step(.55,h);
}

vec3 heaven(vec2 uv,float t){
  // warm high-altitude sky: pale gold near the sun, cooler cream overhead
  vec2 asp=vec2(uRes.x/uRes.y,1.);
  vec3 c=mix(vec3(.99,.95,.88),vec3(.93,.88,.80),smoothstep(.2,1.,uv.y));
  vec2 d=(uv-uSun)*asp;
  float r=length(d);
  // the sun sits behind the portrait's head: core, bloom and a wide glow
  c+=vec3(1.,.96,.86)*exp(-r*9.)*.9;
  c+=vec3(1.,.90,.70)*exp(-r*3.2)*.45;
  c=mix(c,vec3(1.,.94,.80),exp(-r*1.3)*.25);
  // volumetric rays: the light broken into shafts by noise in the air
  float ang=atan(d.y,d.x);
  float shafts=fbm(vec2(ang*5.,t*.04))*.7+fbm(vec2(ang*13.+1.3,-t*.03))*.3;
  shafts=smoothstep(.42,.86,shafts);
  c+=vec3(1.,.93,.78)*shafts*exp(-r*1.15)*.38;
  // high wisps catch the light
  float w=fbm(uv*vec2(2.6,5.)+vec2(t*.01,0.));
  c=mix(c,vec3(1.,.98,.95),smoothstep(.56,.86,w)*smoothstep(.8,.05,uv.y)*.5);
  return c;
}

vec3 earth(vec2 uv,float t,float sc){
  // a dark, mossy forest floor in mist, lit softly from the middle
  vec2 a=uv*vec2(uRes.x/uRes.y,1.);
  vec3 c=mix(vec3(.012,.03,.028),vec3(.04,.10,.095),smoothstep(0.,.85,uv.y));
  c+=vec3(.30,.48,.44)*.32*exp(-length((uv-vec2(.5,.62))*vec2(1.2,1.6))*2.4);
  float fog=fbm(uv*vec2(2.2,4.)+vec2(t*.018,sc*.00008));
  float fog2=fbm(uv*vec2(4.,7.)+vec2(-t*.03,1.7));
  c+=vec3(.22,.34,.32)*(fog*.22+fog2*.08)*smoothstep(.05,.75,uv.y);
  // trunks close in at the edges
  float edge=(1.-smoothstep(0.,.2,uv.x+fbm(vec2(uv.y*3.,1.))*.05))+(1.-smoothstep(1.,.8,uv.x-fbm(vec2(uv.y*3.,4.))*.05));
  c*=1.-clamp(edge,0.,1.)*.75;
  // fireflies and violet spores drifting up
  float ff=dots(a,vec2(16.,10.),vec2(sin(t*.2)*.25,t*.035),.05,13.);
  c+=vec3(1.,.78,.32)*ff*(.55+.45*sin(t*3.+uv.x*30.))*.7;
  float vi=dots(a,vec2(24.,15.),vec2(-t*.01,t*.02),.04,21.);
  c+=vec3(.62,.52,1.)*vi*.35;
  // the pool at your feet catches the light
  float sh=pow(noise(vec2(uv.x*38.,uv.y*5.-t*.45)),6.)*smoothstep(.22,.0,uv.y);
  c+=vec3(.6,.78,.72)*sh*.45;
  return c;
}

vec3 ocean(vec2 uv,float t){
  vec3 c=mix(vec3(.02,.13,.20),vec3(.06,.38,.48),smoothstep(0.,1.,uv.y));
  vec2 q=uv*vec2(uRes.x/uRes.y,1.)*3.;
  float w=fbm(q+vec2(t*.05,t*.03));
  float ca=pow(1.-abs(sin((q.x+w*3.)*2.)*sin((q.y+w*2.5)*2.3)),8.);
  c+=vec3(.45,.85,.9)*ca*smoothstep(.45,1.,uv.y)*.35;
  c+=vec3(.6,.9,1.)*rays(uv,vec2(.3,1.25),7.,t*.04)*.16*smoothstep(.0,.9,uv.y);
  float b=dots(uv*vec2(uRes.x/uRes.y,1.),vec2(14.,9.),vec2(0.,-t*.25),.05,3.);
  c+=vec3(.7,.95,1.)*b*.35;
  return c;
}

vec3 abyss(vec2 uv,float t){
  vec3 c=mix(vec3(.005,.015,.03),vec3(.02,.07,.11),smoothstep(0.,1.,uv.y));
  vec2 a=uv*vec2(uRes.x/uRes.y,1.);
  float s=dots(a,vec2(26.,18.),vec2(t*.01,t*.05),.06,7.)*.6+dots(a,vec2(48.,32.),vec2(-t*.01,t*.08),.07,11.)*.4;
  c+=vec3(.75,.85,.9)*s*.35;
  for(int i=0;i<3;i++){float fi=float(i);
    vec2 p=vec2(.2+.3*fi+.05*sin(t*.11+fi*2.),.25+.2*sin(t*.07+fi*4.));
    c+=vec3(.2,.95,.78)*.10*exp(-length((uv-p)*vec2(uRes.x/uRes.y,1.))*9.);}
  return c;
}

vec3 hell(vec2 uv,float t){
  vec2 h=uv+vec2(0.,(fbm(uv*6.+vec2(0.,-t*.6))-.5)*.02);
  vec3 c=mix(vec3(.36,.07,.03),vec3(.07,.02,.015),smoothstep(0.,1.,h.y));
  c+=vec3(1.,.42,.12)*.55*exp(-length((h-vec2(.5,-.15))*vec2(.9,1.6))*2.2);
  vec2 a=uv*vec2(uRes.x/uRes.y,1.);
  float e=dots(a,vec2(18.,12.),vec2(sin(t*.3)*.3,-t*.35),.06,5.)*.7+dots(a,vec2(30.,20.),vec2(0.,-t*.55),.05,9.)*.5;
  c+=vec3(1.,.55,.18)*e*(.6+.4*sin(t*6.+uv.x*40.))*smoothstep(1.,.1,uv.y);
  return c;
}

vec3 scene(float i,vec2 uv,float t){
  if(i<.5)return heaven(uv,t);
  if(i<1.5)return earth(uv,t,uScroll);
  if(i<2.5)return ocean(uv,t);
  if(i<3.5)return abyss(uv,t);
  return hell(uv,t);
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float t=uTime;
  float w=clamp(uWorld,0.,4.);
  float i=min(floor(w),3.);
  float f=w-i;
  vec3 a=scene(i,uv,t);
  vec3 col=a;
  if(f>.001){
    vec3 b=scene(i+1.,uv,t);
    float m=smoothstep(0.,1.,f);
    if(i<.5){
      // falling through the clouds: they rush up past you and white out the middle
      float cl=fbm(uv*vec2(2.2,3.)+vec2(0.,f*4.+t*.02));
      col=mix(a,b,m);
      col=mix(col,vec3(1.,.99,.97),smoothstep(.3,.75,cl+sin(f*3.1416)*.55)*sin(f*3.1416));
    }else if(i<1.5){
      // the waterline rises up the screen as you sink below it
      float s=-.15+f*1.3+sin(uv.x*14.+t*1.5)*.012+sin(uv.x*31.-t*2.)*.006;
      float under=1.-smoothstep(s-.004,s+.004,uv.y);
      col=mix(a,b,under);
      col+=vec3(.85,.97,1.)*exp(-abs(uv.y-s)*90.)*.55;
    }else if(i<2.5){
      col=mix(a,b,m);
    }else{
      // heat rises from below with a ragged, glowing front
      float fr=-.25+f*1.45;
      float n=(fbm(uv*vec2(5.,3.)+vec2(0.,-t*.4))-.5)*.22;
      float hot=1.-smoothstep(fr-.05,fr+.05,uv.y+n);
      col=mix(a,b,hot);
      col+=vec3(1.,.5,.15)*exp(-abs(uv.y+n-fr)*28.)*.6;
    }
  }
  // a shared drift field threads every chapter together. In the light
  // sky it reads as fine silver points; deeper down it picks up each world's
  // own color and movement, like a route continuing behind the story.
  vec2 field = uv * vec2(uRes.x / uRes.y, 1.0);
  float trail = dots(field, vec2(76.0, 46.0), vec2(t * 0.018, -t * 0.024 + uWorld * 0.6), 0.035, 37.0);
  vec3 trailColor = mix(vec3(0.78, 0.70, 1.0), vec3(0.78, 0.91, 0.94), clamp(uWorld / 4.0, 0.0, 1.0));
  col += trailColor * trail * 0.11;
  // fine grain keeps the gradients from banding
  col+=(hash(uv*uRes+t)-.5)*.018;
  gl_FragColor=vec4(col,1.);
}`;

export function createWorld({ reduced }) {
  const root = document.documentElement;
  const canvas = document.querySelector('[data-world-canvas]');
  const label = document.querySelector('[data-alt-label]');
  const value = document.querySelector('[data-alt-value]');
  const fill = document.querySelector('[data-alt-fill]');
  const worldName = document.querySelector('[data-alt-world]');

  // scroll keyframes: each .descent band moves uWorld from n to n + 1 while
  // its centre crosses the middle of the screen
  let keys = [];
  const measure = () => {
    keys = [...document.querySelectorAll('[data-descent]')].map((band, n) => {
      const r = band.getBoundingClientRect();
      const top = r.top + scrollY;
      return { start: top - innerHeight * 0.5, end: top + r.height - innerHeight * 0.5, from: n };
    });
  };
  const worldAt = (y) => {
    let w = 0;
    for (const k of keys) {
      if (y >= k.end) w = k.from + 1;
      else if (y > k.start) return k.from + (y - k.start) / (k.end - k.start);
    }
    return w;
  };

  // altitude above ground, then depth below the surface, then the core
  const stops = [12000, 0, 200, 4000, 6371000];
  const readout = (w) => {
    const i = Math.min(3, Math.floor(w));
    const f = w - i;
    const m = stops[i] + (stops[i + 1] - stops[i]) * (i === 3 ? f * f * f : f);
    if (w < 1) return ['Altitude', `${Math.round(m).toLocaleString('en-US')} m`];
    if (w < 3.5) return ['Depth', `${Math.round(m).toLocaleString('en-US')} m`];
    return ['Below', `${Math.round(m / 1000).toLocaleString('en-US')} km`];
  };

  // the sun sits just behind the portrait's head, wherever the layout puts it
  const portrait = document.querySelector('[data-portrait]');
  const hero = document.querySelector('[data-hero]');
  const sun = [0.74, 0.66];
  const trackSun = () => {
    if (!portrait) return;
    const r = portrait.getBoundingClientRect();
    const x = (r.left + r.width * 0.5) / innerWidth;
    const y = (r.top + r.height * 0.24) / innerHeight;
    sun[0] = x;
    sun[1] = 1 - y;
    if (hero) {
      const h = hero.getBoundingClientRect();
      hero.style.setProperty('--sun-x', `${r.left - h.left + r.width * 0.5}px`);
      hero.style.setProperty('--sun-y', `${r.top - h.top + r.height * 0.24}px`);
    }
  };

  let current = -1;
  let w = 0;
  const update = () => {
    if (w < 1.2) trackSun();
    w = worldAt(scrollY);
    const now = Math.round(w);
    if (now !== current) {
      current = now;
      root.dataset.worldNow = WORLDS[now];
      if (worldName) worldName.textContent = NAMES[now];
    }
    const [l, v] = readout(w);
    if (label) label.textContent = l;
    if (value) value.textContent = v;
    if (fill) fill.style.transform = `scaleY(${Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))})`;
  };
  measure();
  update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', () => { measure(); update(); });
  addEventListener('load', () => { measure(); update(); });
  // sections above can change height (pinned hero, lazy media); re-measure
  new ResizeObserver(() => { measure(); update(); }).observe(document.body);

  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;
  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (err) {
    console.warn('World backdrop disabled:', err);
    return;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(prog, n);
  const uRes = u('uRes'), uTime = u('uTime'), uWorld = u('uWorld'), uScroll = u('uScroll'), uSun = u('uSun');

  // the scene is soft (gradients, noise, glow), so a reduced buffer looks the
  // same and costs a fraction; phones get less still
  const coarse = matchMedia('(pointer: coarse)').matches;
  const scale = coarse ? 0.4 : 0.6;
  const resize = () => {
    canvas.width = Math.max(1, Math.round(innerWidth * scale));
    canvas.height = Math.max(1, Math.round(innerHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  addEventListener('resize', resize);

  const draw = (t) => {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform1f(uWorld, w);
    gl.uniform1f(uScroll, scrollY);
    gl.uniform2f(uSun, sun[0], sun[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  root.classList.add('world-live');

  if (reduced) {
    // no motion: redraw only when the scroll position changes the scene
    let last = -1;
    const still = () => { if (Math.abs(w - last) > 0.002) { last = w; draw(12); } };
    addEventListener('scroll', still, { passive: true });
    addEventListener('resize', still);
    draw(12);
    return;
  }

  let raf = 0;
  let prev = 0;
  const start = performance.now();
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (now - prev < 33) return; // ~30 fps is plenty for slow skies and water
    prev = now;
    draw((now - start) / 1000);
  };
  const run = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : run()));
  run();
}
