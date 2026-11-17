// The hero graphic: soft blue wisps drifting out of the top-right corner,
// drawn in a three.js fragment shader. Domain-warped noise gives the strands,
// a falloff from the corner keeps them well clear of the type, and time moves
// them slowly enough that you notice it only if you watch.
import * as THREE from "./vendor/three.module.min.js";

const canvas = document.querySelector(".field");

const vertexShader = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;       // drawing-buffer size in px
  uniform float uReachX;   // how far left the glow reaches, as a share of width
  uniform float uFloor;    // exponent that keeps the bottom edge dark
  uniform float uTime;     // seconds
  uniform float uDevelop;  // 0 to 1, the one-time reveal

  const vec3 DEEP = vec3(10.0, 26.0, 64.0) / 255.0;
  const vec3 BLUE = vec3(47.0, 99.0, 196.0) / 255.0;
  const vec3 MIST = vec3(150.0, 182.0, 240.0) / 255.0;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 1.9 + 11.7; a *= 0.45; }
    return v;
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    // Coordinates from the top-right corner, scaled by height so the strands keep their shape.
    vec2 c = vec2(uRes.x - frag.x, uRes.y - frag.y) / uRes.y;
    float t = uTime;

    // Domain warp: the strands lean down and to the left, away from the corner.
    // Stretched along a diagonal so the strands run long and smooth, like smoke in still air.
    mat2 lean = mat2(0.86, 0.5, -0.5, 0.86);
    vec2 p = lean * c * vec2(1.4, 3.4);
    vec2 q = vec2(fbm(p + vec2(0.0, t * 0.020)), fbm(p + vec2(5.2, 1.3) - t * 0.016));
    vec2 r = vec2(fbm(p + 1.4 * q + vec2(1.7, 9.2) + t * 0.012), fbm(p + 1.4 * q + vec2(8.3, 2.8) - t * 0.010));
    float n = fbm(p + 1.5 * r);

    // Ridges of the warped noise become thin wisps; a broader haze sits under them.
    float ridge = 1.0 - abs(n * 2.0 - 1.0);
    float wisp = pow(ridge, 8.0);
    float haze = smoothstep(0.45, 0.95, n) * 0.18;

    // Falloff from the corner, and nothing near the bottom edge or the type.
    float dx = (uRes.x - frag.x) / (uRes.x * uReachX);
    float dy = (uRes.y - frag.y) / uRes.y;
    float d = length(vec2(dx, dy * 1.05));
    float mask = clamp(1.0 - d, 0.0, 1.0);
    mask = mask * mask * (3.0 - 2.0 * mask);
    mask *= max(0.0, 1.0 - pow(dy, uFloor));
    mask *= smoothstep(0.0, 1.0, (uDevelop * 1.3 - d) * 2.5);

    float light = (wisp * 0.8 + haze) * mask;
    vec3 col = mix(DEEP, BLUE, smoothstep(0.0, 0.55, light)) * light * 1.1;
    col += MIST * pow(wisp * mask, 4.0) * 0.14;

    // A touch of grain hides banding in the dark gradient.
    float ign = fract(52.9829189 * fract(dot(frag, vec2(0.06711056, 0.00583715))));
    col += (ign - 0.5) / 255.0;
    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;

function start() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "low-power" });
  } catch {
    canvas.classList.add("static");
    return;
  }
  renderer.setClearColor(0x000000, 1);

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const uniforms = {
    uRes: { value: new THREE.Vector2() },
    uReachX: { value: 0.75 },
    uFloor: { value: 3 },
    uTime: { value: 40 },
    uDevelop: { value: reduce.matches ? 1 : 0 },
  };
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    // The wisps are soft, so 1x resolution is enough and keeps the GPU cool.
    renderer.setPixelRatio(1);
    renderer.setSize(w, h, false);
    const narrow = w < 760;
    uniforms.uRes.value.set(w, h);
    uniforms.uReachX.value = narrow ? 1.3 : 0.75;
    uniforms.uFloor.value = narrow ? 1.6 : 3;
  }

  resize();
  let lastW = canvas.clientWidth;
  new ResizeObserver(() => {
    if (canvas.clientWidth === lastW && Math.abs(canvas.clientHeight - uniforms.uRes.value.y) < 40) return;
    lastW = canvas.clientWidth;
    resize();
    if (reduce.matches) renderer.render(scene, camera);
  }).observe(canvas);

  if (reduce.matches) {
    renderer.render(scene, camera);
    return;
  }

  // The drift is slow, so 30 frames a second is plenty.
  const t0 = performance.now();
  let last = 0;
  renderer.setAnimationLoop(now => {
    if (now - last < 33) return;
    last = now;
    const t = (now - t0) / 1000;
    uniforms.uTime.value = 40 + t;
    uniforms.uDevelop.value = 1 - Math.pow(2, -6 * Math.min(1, t / 2.4));
    renderer.render(scene, camera);
  });
}

if (canvas) start();
