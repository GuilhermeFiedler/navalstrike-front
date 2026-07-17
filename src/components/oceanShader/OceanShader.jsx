import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

float ship(vec2 uv, float id) {
    float hull = step(0.0, uv.y) * step(uv.y, 0.02) * step(abs(uv.x), 0.04);
    hull += step(0.02, uv.y) * step(uv.y, 0.03) * step(abs(uv.x), 0.03);
    float mast = step(0.03, uv.y) * step(uv.y, 0.08) * step(abs(uv.x), 0.005);
    float sails = step(0.04, uv.y) * step(uv.y, 0.07) * step(uv.x, 0.025) * step(0.005, uv.x);
    return clamp(hull + mast + sails, 0.0, 1.0);
}

void main() {
    vec2 uv = v_texCoord;

    float pixelScale = 240.0;
    vec2 pixelUv = floor(uv * pixelScale) / pixelScale;

    vec3 deepBlue = vec3(0.086, 0.196, 0.310);
    vec3 midBlue = vec3(0.165, 0.384, 0.561);
    vec3 shipColor = vec3(0.949, 0.910, 0.812);
    vec3 highlight = vec3(0.980, 0.953, 0.878);

    float wave = sin(pixelUv.x * 8.0 + u_time * 1.2) * 0.04;
    vec3 color = mix(deepBlue, midBlue, uv.y + wave);

    for(float i = 0.0; i < 3.0; i++) {
        float speed = (0.1 + i * 0.05);
        float rowY = 0.2 + i * 0.25;
        float dir = mod(i, 2.0) == 0.0 ? 1.0 : -1.0;

        float spacing = 0.8;
        float xPos = fract((pixelUv.x * dir + u_time * speed) * spacing) - 0.5;
        vec2 shipUv = vec2(xPos, pixelUv.y - rowY + wave * 0.5);

        float s = ship(shipUv, i);
        if(s > 0.5) {
            color = mix(color, shipColor, 0.9);
            if(shipUv.x > 0.01) color *= 0.8;
        }

        float wake = step(abs(shipUv.y + 0.01), 0.005) * step(abs(shipUv.x + 0.1 * dir), 0.15);
        if(wake > 0.5) color = mix(color, highlight, 0.3);
    }

    float lines = sin(pixelUv.y * 150.0 + u_time * 0.5);
    if(lines > 0.96) color = mix(color, highlight, 0.1);

    float scanline = sin(uv.y * 800.0) * 0.04;
    color -= scanline;

    gl_FragColor = vec4(color, 1.0);
}`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function OceanShader({ className }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;


    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const observer = new ResizeObserver(syncSize);
    observer.observe(canvas);
    syncSize();

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");

    function render(t) {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
