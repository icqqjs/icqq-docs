// Twin-runtime nebula — autonomous WebGL background for the icqq portal.
//
// Self-contained: owns its GL program, animation loop and lifecycle. The field
// auto-rotates its energy balance between the two runtimes (Node ↔ Rust); a
// pin() call (card hover) holds one side. `onMode` is invoked whenever the
// discrete mode (balanced | node | rust) flips, so the UI can react.
//
//   const field = createNebula(canvas, { onMode })
//   field.start()                  // returns false if WebGL is unavailable
//   field.pin('node') / field.unpin()
//   field.destroy()

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2  uRes;
uniform float uBalance;   // -1 node .. +1 rust (autonomous)

float hash(vec2 p){
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

// Soft drifting bokeh / star layer
float stars(vec2 p, float thr){
  vec2 g = floor(p), f = fract(p);
  float c = 0.0;
  for (int y = -1; y <= 1; y++){
    for (int x = -1; x <= 1; x++){
      vec2 o = vec2(float(x), float(y));
      vec2 id = g + o;
      float h = hash(id);
      if (h < thr){
        vec2 pos = o + vec2(hash(id + 1.3), hash(id + 2.7));
        float d = length(f - pos);
        float tw = 0.55 + 0.45 * sin(uTime * 1.6 + h * 42.0);
        c += smoothstep(0.10, 0.0, d) * tw;
      }
    }
  }
  return c;
}

void main(){
  vec2 R = uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * R) / R.y;
  float bal = uBalance;
  float t = uTime * 0.05;

  // ---- Domain-warped liquid nebula ----
  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm(p * 1.3 + 1.7 * q + vec2(1.7, 9.2) + t * 0.6),
                fbm(p * 1.3 + 1.7 * q + vec2(8.3, 2.8) - t * 0.6));
  float f = fbm(p * 1.5 + 2.2 * r);

  float density = smoothstep(0.30, 1.18, f + 0.10);
  float fil = pow(max(0.0, 1.0 - abs(f - 0.55) * 2.0), 4.5); // bright filaments

  // ---- Palette: deep space + green / blue poles (vivid, no muddy midtone) ----
  vec3 deep    = vec3(0.012, 0.020, 0.040);
  vec3 nodeCol = mix(vec3(0.0, 0.62, 0.95), vec3(0.12, 1.0, 0.58), 0.66);
  vec3 rustCol = mix(vec3(0.0, 0.30, 0.85), vec3(0.05, 0.50, 1.0), 0.5);

  // ---- Diagonal wave sweep (top-left <-> bottom-right) ----
  // axis: negative toward top-left, positive toward bottom-right.
  float axis = (p.x - p.y) * 0.66;
  // Big, slow undulation → a rolling beach wave rather than a straight line.
  float wob = (fbm(p * 0.8 + vec2(t * 0.9, -t * 0.6)) - 0.5) * 0.55;
  // Reduced amplitude keeps the crest on-screen — it never parks in a corner
  // and vanishes; the wave just rolls back and forth across the view.
  float front = bal * 0.82 + wob;
  float w = 1.0 - smoothstep(front - 0.12, front + 0.12, axis);
  vec3 medium = mix(nodeCol, rustCol, w);
  // Wide, luminous crest so the wavefront clearly reads as a rolling wave.
  float edge = smoothstep(0.34, 0.0, abs(axis - front));

  vec3 col = deep;
  col += medium * density * 0.26;   // less flat fog
  col += medium * fil * 2.0;        // clean filament structure

  // Bright breathing cores anchored at the two corners the wave runs between.
  float nI = mix(0.10, 1.65, clamp((1.0 - bal) * 0.5, 0.0, 1.0));
  float rI = mix(0.10, 1.65, clamp((1.0 + bal) * 0.5, 0.0, 1.0));
  col += nodeCol * nI * 0.11 / (0.05 + length(p - vec2(-0.6, 0.36)));   // top-left
  col += rustCol * rI * 0.11 / (0.05 + length(p - vec2( 0.6, -0.36)));  // bottom-right
  // The wave carries the new colour across, led by a bright crest band.
  col += (medium * 1.3 + 0.10) * edge * 0.32;

  // ---- Drifting bokeh (two parallax layers) ----
  float s1 = stars((p + vec2(t * 0.25, 0.0)) * 6.0, 0.16);
  float s2 = stars((p + vec2(t * 0.55, 0.03)) * 11.0, 0.11);
  col += vec3(0.80, 0.86, 1.0) * s1 * 0.45;
  col += vec3(0.90, 0.95, 1.0) * s2 * 0.28;

  // ---- Grade ----
  col = col / (col + vec3(0.58));                 // brighter exposure
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, 1.38);                // cleaner, more vivid color
  col = pow(max(col, 0.0), vec3(0.82));
  float vig = smoothstep(1.75, 0.25, length(p * vec2(0.82, 1.0)));
  col *= vig;
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.016; // film grain

  gl_FragColor = vec4(col, 1.0);
}
`

export function createNebula(canvas, { onMode, onBalance, onProgress } = {}) {
  let gl = null
  let program = null
  let rafId = null
  let paused = false
  let bal = 0
  let lastMode = null
  let clock = 0    // monotonic seconds (survives pause/resume)
  let lastNow = 0
  const LAP = 14   // seconds per switch lap — slow, languid rolling wave
  const A = 0.95   // balance amplitude
  const u = {}

  function compile(type, src) {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('nebula shader compile error:', gl.getShaderInfoLog(s))
      return null
    }
    return s
  }

  function initGL() {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
      || canvas.getContext('experimental-webgl')
    if (!gl) return false

    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return false

    program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('nebula program link error:', gl.getProgramInfoLog(program))
      return false
    }
    gl.useProgram(program)

    // Fullscreen triangle
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    u.uTime = gl.getUniformLocation(program, 'uTime')
    u.uRes = gl.getUniformLocation(program, 'uRes')
    u.uBalance = gl.getUniformLocation(program, 'uBalance')
    return true
  }

  function resize() {
    if (!canvas || !gl) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
    const w = Math.floor(window.innerWidth * dpr)
    const h = Math.floor(window.innerHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame)
    if (paused || !gl) return
    if (!lastNow) lastNow = now
    const dt = Math.min(0.05, (now - lastNow) / 1000) // clamp to survive tab stalls
    lastNow = now
    clock += dt

    // Forward "lap" timeline: one lap = one switch. The balance eases pole-to-pole
    // each lap (velocity ~0 at the ends → smooth reversal), and the lap parity
    // decides which runtime is incoming. The progress bar, the diagonal wave and
    // the card wipe all ride this single monotonic clock.
    const phase = clock / LAP
    const lap = Math.floor(phase)
    const p = phase - lap                       // 0 → 1 within the lap
    const dir = lap % 2 === 0 ? 1 : -1          // even laps head to Rust, odd to Node
    // Steady (linear) sweep so the front crosses the centre/card slowly like a
    // rolling wave, instead of zipping through the middle (smoothstep did that).
    // The direction reversal happens at the off-card corner → reads as recede.
    bal = -dir * A + dir * A * 2 * p
    bal = Math.max(-A, Math.min(A, bal))
    const incoming = dir > 0 ? 'rust' : 'node'  // colour sweeping in this lap
    const base = dir > 0 ? 'node' : 'rust'      // colour being covered

    onBalance && onBalance(bal)
    onProgress && onProgress(p, incoming, base)

    const m = bal < -0.16 ? 'node' : bal > 0.16 ? 'rust' : 'balanced'
    if (m !== lastMode) {
      lastMode = m
      onMode && onMode(m)
    }

    gl.uniform1f(u.uTime, clock)
    gl.uniform2f(u.uRes, canvas.width, canvas.height)
    gl.uniform1f(u.uBalance, bal)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  function onVisibility() {
    paused = document.hidden
    if (!paused) lastNow = 0 // reset the dt baseline; the lap clock continues
  }

  function start() {
    if (!canvas) return false
    if (!initGL()) {
      canvas.style.display = 'none' // CSS fallback background shows through
      return false
    }
    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    rafId = requestAnimationFrame(frame)
    return true
  }

  function destroy() {
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibility)
    if (rafId) cancelAnimationFrame(rafId)
    rafId = null
  }

  return { start, destroy }
}
