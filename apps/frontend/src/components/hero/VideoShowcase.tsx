'use client';

import { useEffect, useRef, useState } from 'react';

const MONTAGE_URL = 'https://res.cloudinary.com/uljycst6/video/upload/v1794321632/Montage.mp4';
const REAL_ESTATE_URL = 'https://res.cloudinary.com/uljycst6/video/upload/v1794330468/realestatevid.mp4';
const GLYPHS = '%@#3RT*';

type TrailPoint = { x: number; y: number; angle: number; strength: number; time: number };

function hash(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_video;
  uniform sampler2D u_nextVideo;
  uniform vec2 u_resolution;
  uniform vec2 u_videoSize;
  uniform vec2 u_nextVideoSize;
  uniform float u_time;
  uniform float u_progress;
  uniform float u_radius;
  uniform vec4 u_trail[10];

  float randomCell(vec2 cell) {
    return fract(sin(cell.x * 127.1 + cell.y * 311.7) * 43758.5453);
  }

  vec2 coverUV(vec2 uv, vec2 sourceSize) {
    float screenAspect = u_resolution.x / u_resolution.y;
    float sourceAspect = sourceSize.x / sourceSize.y;
    if (screenAspect > sourceAspect) {
      uv.y = (uv.y - 0.5) * (sourceAspect / screenAspect) + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * (screenAspect / sourceAspect) + 0.5;
    }
    return clamp(uv, vec2(0.0), vec2(1.0));
  }

  void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 distortion = vec2(0.0);
    float totalWeight = 0.0;
    for (int i = 0; i < 10; i++) {
      vec4 point = u_trail[i];
      vec2 delta = vec2((v_uv.x - point.x) * aspect, v_uv.y - point.y);
      float distanceToPoint = length(delta);
      float mask = 1.0 - smoothstep(u_radius * 0.14, u_radius, distanceToPoint);
      float amount = point.w * mask;
      vec2 direction = vec2(cos(point.z), sin(point.z));
      vec2 tangent = normalize(vec2(-delta.y, delta.x) + vec2(0.00001));
      float wave = sin(distanceToPoint * 105.0 - u_time * 19.0 + float(i) * 0.7) * 0.008 * amount;
      distortion += direction * (0.045 * amount + wave) + tangent * 0.02 * amount;
      totalWeight += amount;
    }
    vec2 samplePoint = v_uv + distortion / max(totalWeight, 1.0);

    vec2 cell = floor(vec2(samplePoint.x * u_resolution.x / 10.0, (1.0 - samplePoint.y) * u_resolution.y / 12.0));
    float threshold = clamp(v_uv.x * 0.78 + randomCell(cell) * 0.22, 0.0, 1.0);
    float reveal = smoothstep(threshold - 0.025, threshold + 0.025, u_progress);
    vec4 currentFrame = texture2D(u_video, coverUV(samplePoint, u_videoSize));
    vec4 nextFrame = texture2D(u_nextVideo, coverUV(samplePoint, u_nextVideoSize));
    gl_FragColor = mix(currentFrame, nextFrame, reveal);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function VideoShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const montageRef = useRef<HTMLVideoElement>(null);
  const realEstateRef = useRef<HTMLVideoElement>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement>(null);
  const asciiCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const webglReadyRef = useRef(false);
  const typeRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const montage = montageRef.current;
    const realEstate = realEstateRef.current;
    const webglCanvas = webglCanvasRef.current;
    const asciiCanvas = asciiCanvasRef.current;
    const asciiCtx = asciiCanvas?.getContext('2d');
    if (!section || !frame || !montage || !realEstate || !webglCanvas || !asciiCanvas || !asciiCtx) return;
    const mobileLayout = window.matchMedia('(max-width: 639px)').matches;

    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let progressRaf = 0;
    let webglRaf = 0;
    let lastAsciiDraw = 0;
    let lastMontageTime = -1;
    let lastRealEstateTime = -1;
    let isVisible = false;
    let gl: WebGLRenderingContext | null = null;
    let glFailed = false;
    let glReady = false;
    let lastPointer: { x: number; y: number } | null = null;
    const trail: TrailPoint[] = [];
    const sampleCanvas = document.createElement('canvas');
    const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

    const resize = () => {
      const rect = frame.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      webglCanvas.width = Math.max(1, Math.round(width * dpr));
      webglCanvas.height = Math.max(1, Math.round(height * dpr));
      asciiCanvas.width = Math.max(1, Math.round(width));
      asciiCanvas.height = Math.max(1, Math.round(height));
      columns = Math.ceil(width / 10);
      rows = Math.ceil(height / 12);
      sampleCanvas.width = columns;
      sampleCanvas.height = rows;
      if (gl) gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
      drawAscii(progressRef.current, performance.now(), true);
    };

    const drawAscii = (progress: number, now: number, force = false) => {
      if (mobileLayout) return;
      if (!force && now - lastAsciiDraw < 32) return;
      lastAsciiDraw = now;
      asciiCtx.clearRect(0, 0, width, height);
      if (progress <= 0.015 || progress >= 0.985) return;

      let pixels: Uint8ClampedArray | null = null;
      if (sampleCtx && realEstate.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        try {
          sampleCtx.drawImage(realEstate, 0, 0, columns, rows);
          pixels = sampleCtx.getImageData(0, 0, columns, rows).data;
        } catch {
          pixels = null;
        }
      }

      asciiCtx.font = '700 10px ui-monospace, SFMono-Regular, Menlo, monospace';
      asciiCtx.textBaseline = 'alphabetic';
      asciiCtx.globalAlpha = 0.72;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns; col += 1) {
          const threshold = (col * 10 / Math.max(width, 1)) * 0.78 + hash(col, row) * 0.22;
          const cellNoise = hash(col + 97, row + 53);
          if (Math.abs(threshold - progress) > 0.075 || cellNoise < 0.38) continue;
          const pixel = (row * columns + col) * 4;
          const luminance = pixels ? pixels[pixel] * 0.299 + pixels[pixel + 1] * 0.587 + pixels[pixel + 2] * 0.114 : 30;
          asciiCtx.fillStyle = luminance > 145 ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.92)';
          const glyph = GLYPHS[Math.floor(hash(col + 13, row + 31) * GLYPHS.length)];
          asciiCtx.fillText(glyph, col * 10, row * 12 + 10);
        }
      }
      asciiCtx.globalAlpha = 1;
    };

    const onNextVideoReady = () => onScroll();

    const updateScrollProgress = () => {
      progressRaf = 0;
      const rect = section.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / Math.max(window.innerHeight, 1)));
      const nextVideoReady = realEstate.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !realEstate.error;
      const progress = !mobileLayout && nextVideoReady ? Math.max(0, Math.min(1, (scrollProgress - 0.06) / 0.88)) : 0;
      progressRef.current = progress;
      if (!glReady) {
        montage.style.opacity = mobileLayout ? '1' : String(1 - progress);
        realEstate.style.opacity = mobileLayout ? '1' : String(progress);
      }
      if (typeRef.current) typeRef.current.textContent = progress < 0.5 ? 'Montage' : 'Real Estate';
      if (taglineRef.current) taglineRef.current.textContent = progress >= 0.985
        ? "WE'RE NOT A CULT.\nBUT PEOPLE DO KEEP\nCOMING BACK"
        : 'WE LISTEN.\nWE CRAFT.\nWE DELIVER.';
      drawAscii(progress, performance.now());
    };

    const onScroll = () => {
      if (!progressRaf) progressRaf = requestAnimationFrame(updateScrollProgress);
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (lastPointer) {
        const dx = x - lastPointer.x;
        const dy = y - lastPointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 2) {
          trail.push({ x: x / rect.width, y: 1 - y / rect.height, angle: Math.atan2(-dy, dx), strength: Math.min(1, 0.2 + distance / 24), time: performance.now() });
          if (trail.length > 10) trail.shift();
        }
      }
      lastPointer = { x, y };
    };
    const onPointerLeave = () => { lastPointer = null; };

    const playbackObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
      if (isVisible && !mobileLayout) {
        montage.play().catch(() => undefined);
        realEstate.play().catch(() => undefined);
      } else {
        montage.pause();
        realEstate.pause();
      }
    }, { threshold: [0, 0.1] });
    playbackObserver.observe(section);

    const mobilePlaybackObserver = mobileLayout
      ? new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const activeVideo = entry.target === montage ? montage : realEstate;
          const otherVideo = activeVideo === montage ? realEstate : montage;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            otherVideo.pause();
            activeVideo.play().catch(() => undefined);
          } else if (entry.intersectionRatio < 0.15) {
            activeVideo.pause();
          }
        }
      }, { threshold: [0, 0.15, 0.6, 1] })
      : null;
    mobilePlaybackObserver?.observe(montage);
    mobilePlaybackObserver?.observe(realEstate);

    window.addEventListener('scroll', onScroll, { passive: true });
    realEstate.addEventListener('loadeddata', onNextVideoReady);
    realEstate.addEventListener('canplay', onNextVideoReady);
    window.addEventListener('resize', resize);
    frame.addEventListener('pointermove', onPointerMove, { passive: true });
    frame.addEventListener('pointerleave', onPointerLeave, { passive: true });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(frame);

    // Keep the mobile video in its native landscape frame; the shader's cover
    // sampling is reserved for desktop where the full-screen crop is intended.
    gl = !mobileLayout
      ? webglCanvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' })
      : null;
    let program: WebGLProgram | null = null;
    let vertex: WebGLShader | null = null;
    let fragment: WebGLShader | null = null;
    let montageTexture: WebGLTexture | null = null;
    let realEstateTexture: WebGLTexture | null = null;
    let buffer: WebGLBuffer | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};

    if (gl) {
      vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (vertex && fragment) {
        program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vertex);
          gl.attachShader(program, fragment);
          gl.linkProgram(program);
          if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            buffer = gl.createBuffer();
            montageTexture = gl.createTexture();
            realEstateTexture = gl.createTexture();
            if (buffer && montageTexture && realEstateTexture) {
              gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
              const position = gl.getAttribLocation(program, 'a_position');
              gl.enableVertexAttribArray(position);
              gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
              for (const texture of [montageTexture, realEstateTexture]) {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
              }
              gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
              uniforms = {
                montage: gl.getUniformLocation(program, 'u_video'),
                realEstate: gl.getUniformLocation(program, 'u_nextVideo'),
                resolution: gl.getUniformLocation(program, 'u_resolution'),
                montageSize: gl.getUniformLocation(program, 'u_videoSize'),
                realEstateSize: gl.getUniformLocation(program, 'u_nextVideoSize'),
                time: gl.getUniformLocation(program, 'u_time'),
                progress: gl.getUniformLocation(program, 'u_progress'),
                radius: gl.getUniformLocation(program, 'u_radius'),
                trail: gl.getUniformLocation(program, 'u_trail[0]'),
              };
            } else glFailed = true;
          } else glFailed = true;
        } else glFailed = true;
      } else glFailed = true;
    } else glFailed = true;

    const drawWebGL = (now: number) => {
      webglRaf = requestAnimationFrame(drawWebGL);
      if (!isVisible || glFailed || !gl || !program || !montageTexture || !realEstateTexture) return;

      try {
        if (montage.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && montage.currentTime !== lastMontageTime) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, montageTexture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, montage);
          lastMontageTime = montage.currentTime;
        }
        if (realEstate.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && realEstate.currentTime !== lastRealEstateTime) {
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, realEstateTexture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, realEstate);
          lastRealEstateTime = realEstate.currentTime;
        }
        if (lastMontageTime >= 0 && lastRealEstateTime >= 0 && !glReady) {
          glReady = true;
          webglReadyRef.current = true;
          setWebglReady(true);
          montage.style.opacity = '0';
          realEstate.style.opacity = '0';
        }
      } catch {
        glFailed = true;
        webglReadyRef.current = false;
        setWebglReady(false);
        montage.style.opacity = String(1 - progressRef.current);
        realEstate.style.opacity = String(progressRef.current);
        return;
      }

      gl.useProgram(program);
      gl.uniform1i(uniforms.montage, 0);
      gl.uniform1i(uniforms.realEstate, 1);
      gl.uniform2f(uniforms.resolution, webglCanvas.width, webglCanvas.height);
      gl.uniform2f(uniforms.montageSize, Math.max(montage.videoWidth, 1), Math.max(montage.videoHeight, 1));
      gl.uniform2f(uniforms.realEstateSize, Math.max(realEstate.videoWidth, 1), Math.max(realEstate.videoHeight, 1));
      gl.uniform1f(uniforms.time, now / 1000);
      gl.uniform1f(uniforms.progress, progressRef.current);
      gl.uniform1f(uniforms.radius, 0.072);

      const points = new Float32Array(10 * 4);
      for (let i = 0; i < trail.length; i += 1) {
        const point = trail[i];
        const age = Math.max(0, (now - point.time) / 430);
        const offset = i * 4;
        points[offset] = point.x;
        points[offset + 1] = point.y;
        points[offset + 2] = point.angle;
        points[offset + 3] = point.strength * Math.pow(Math.max(0, 1 - age), 2);
      }
      gl.uniform4fv(uniforms.trail, points);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    resize();
    updateScrollProgress();
    if (!glFailed) webglRaf = requestAnimationFrame(drawWebGL);
    return () => {
      cancelAnimationFrame(progressRaf);
      cancelAnimationFrame(webglRaf);
      playbackObserver.disconnect();
      mobilePlaybackObserver?.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      realEstate.removeEventListener('loadeddata', onNextVideoReady);
      realEstate.removeEventListener('canplay', onNextVideoReady);
      window.removeEventListener('resize', resize);
      frame.removeEventListener('pointermove', onPointerMove);
      frame.removeEventListener('pointerleave', onPointerLeave);
      if (gl) {
        if (montageTexture) gl.deleteTexture(montageTexture);
        if (realEstateTexture) gl.deleteTexture(realEstateTexture);
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        if (vertex) gl.deleteShader(vertex);
        if (fragment) gl.deleteShader(fragment);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="works" className="relative z-10 w-full sm:h-[200svh]">
      <div ref={frameRef} className="relative h-auto w-full bg-black text-white sm:sticky sm:top-0 sm:h-[100svh] sm:overflow-hidden">
        <div className="relative h-[100svh] w-full overflow-hidden bg-black sm:absolute sm:inset-0 sm:h-full">
          <video ref={montageRef} src={MONTAGE_URL} crossOrigin="anonymous" muted loop playsInline preload="auto" className={`absolute inset-0 h-full w-full bg-black object-contain sm:object-cover ${webglReady ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55 sm:hidden" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-4 px-5 pb-8 sm:hidden">
            <h2 className="whitespace-pre-line text-[clamp(28px,8vw,38px)] font-black uppercase leading-[0.9] tracking-[-0.06em]">WE LISTEN.{`\n`}WE CRAFT.{`\n`}WE DELIVER.</h2>
            <p className="font-mono text-[8px] font-bold uppercase leading-[1.6] tracking-[0.05em] text-white/85">TYPE&nbsp;&nbsp; MONTAGE</p>
          </div>
        </div>

        <div className="relative h-[100svh] w-full overflow-hidden bg-black sm:absolute sm:inset-0 sm:h-full">
          <video ref={realEstateRef} src={REAL_ESTATE_URL} crossOrigin="anonymous" muted loop playsInline preload="auto" className={`absolute inset-0 h-full w-full bg-black object-contain sm:object-cover ${webglReady ? 'opacity-0' : 'opacity-0'}`} aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55 sm:hidden" />
          <dl className="pointer-events-none absolute inset-x-5 bottom-8 z-10 grid grid-cols-2 gap-8 font-mono text-[8px] font-bold uppercase leading-[1.6] tracking-[0.05em] text-white/90 sm:hidden">
            <div><dt className="text-white/60">Type</dt><dd>Real Estate</dd></div>
            <div><dt className="text-white/60">Studio</dt><dd>GOLD RENDERS</dd></div>
          </dl>
        </div>

        <canvas ref={webglCanvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 hidden h-full w-full sm:block ${webglReady ? 'opacity-100' : 'opacity-0'}`} />
        <canvas ref={asciiCanvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-b from-black/30 via-transparent to-black/55 sm:block" />

        <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden flex-col items-start justify-end gap-5 px-5 pb-8 sm:flex sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pb-10 lg:px-12">
          <h2 ref={taglineRef} className="whitespace-pre-line text-[clamp(28px,5vw,64px)] font-black uppercase leading-[0.9] tracking-[-0.06em]">WE LISTEN.{`\n`}WE CRAFT.{`\n`}WE DELIVER.</h2>
          <dl className="grid w-full max-w-[430px] grid-cols-2 gap-x-8 font-mono text-[8px] font-bold uppercase leading-[1.6] tracking-[0.04em] text-white/90 sm:w-auto sm:grid-cols-2 sm:text-[10px]">
            <div><dt className="text-white/60">Type</dt><dd ref={typeRef}>Montage</dd></div>
            <div><dt className="text-white/60">Studio</dt><dd>GOLD RENDERS</dd></div>
          </dl>
        </footer>
      </div>
    </section>
  );
}






