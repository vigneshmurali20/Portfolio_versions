import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
// Satin folds: domain-warped sines lit with a soft key light and a specular sheen.
const FS = `
precision highp float;
uniform float P; uniform vec2 R; uniform float B;
float H(vec2 p){
  p += 0.42*vec2(sin(p.y*1.25 + P), cos(p.x*1.05 - P));
  float v = sin(p.x*1.45 + p.y*0.85 + P + 1.15*sin(p.y*1.2 - P));
  v += 0.62*sin(-p.x*1.05 + p.y*1.9 + 2.0*P + 0.8*sin(p.x*1.6 + P));
  v += 0.30*sin(p.x*2.9 - p.y*1.6 - P + 0.5*sin(p.y*2.2 + 2.0*P));
  return v;
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
void main(){
  vec2 uv = gl_FragCoord.xy / R;
  vec2 p = (uv - 0.5) * vec2(1.0, 1.7778) * 2.3 + vec2(0.0, 0.25*sin(P));
  float e = 0.012; float c = H(p);
  vec3 n = normalize(vec3(-(H(p+vec2(e,0.))-c)/e, -(H(p+vec2(0.,e))-c)/e, 3.2));
  vec3 L = normalize(vec3(-0.45, 0.65, 0.62));
  float dif = clamp(dot(n, L), 0.0, 1.0);
  float spec = pow(clamp(dot(reflect(-L, n), vec3(0.,0.,1.)), 0.0, 1.0), 26.0);
  float rim = pow(1.0 - n.z, 2.0);
  vec3 col = mix(vec3(0.008,0.06,0.068), vec3(0.02,0.30,0.33), smoothstep(0.15, 1.0, dif));
  col += vec3(0.45,0.88,0.90) * spec * 0.55 + vec3(0.05,0.35,0.38) * rim * 0.9;
  vec2 g = uv - vec2(0.5 + 0.14*sin(P), 0.56 + 0.08*cos(P)); g.y *= 1.6;
  col += vec3(0.02,0.24,0.26) * exp(-dot(g,g) * 5.0);
  col *= mix(0.45, 1.0, smoothstep(1.15, 0.25, length((uv - 0.5) * vec2(1.0, 1.25))));
  col *= B;
  col += (hash(gl_FragCoord.xy + floor(P * 47.0)) - 0.5) * 0.018;
  gl_FragColor = vec4(col, 1.0);
}`;

type GLState = { gl: WebGLRenderingContext; uP: WebGLUniformLocation | null; uR: WebGLUniformLocation | null; uB: WebGLUniformLocation | null };

/** Full-frame WebGL silk. Driven purely by the frame number; one loop every `period` seconds. */
export const Silk: React.FC<{ period?: number; brightness?: number }> = ({ period = 20, brightness = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const st = useRef<GLState | null>(null);

  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (!st.current) {
      const gl = cv.getContext("webgl", { preserveDrawingBuffer: true, antialias: false });
      if (!gl) return;
      const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); return o; };
      const pr = gl.createProgram()!;
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
      gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(pr);
      gl.useProgram(pr);
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      st.current = { gl, uP: gl.getUniformLocation(pr, "P"), uR: gl.getUniformLocation(pr, "R"), uB: gl.getUniformLocation(pr, "B") };
    }
    const { gl, uP, uR, uB } = st.current;
    gl.viewport(0, 0, cv.width, cv.height);
    gl.uniform1f(uP, (Math.PI * 2 * (frame / fps)) / period);
    gl.uniform2f(uR, cv.width, cv.height);
    gl.uniform1f(uB, brightness);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, [frame, fps, period, brightness]);

  return (
    <AbsoluteFill style={{ background: "#021416" }}>
      <canvas ref={ref} width={width / 2} height={height / 2} style={{ width, height }} />
    </AbsoluteFill>
  );
};
