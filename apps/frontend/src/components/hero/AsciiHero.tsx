'use client';

import { useEffect, useRef } from 'react';

const GLYPHS = '%@#3RT*';

type LogoCell = { x: number; y: number; col: number; row: number; phase: number; jitter: number; offsetX: number; offsetY: number };
type AmbientCell = { x: number; y: number; col: number; row: number; phase: number };
type PointerTrailPoint = { x: number; y: number; time: number; strength: number };

function hash(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export default function AsciiHero({ showLogo = true }: { showLogo?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pointer = { x: -1000, y: -1000 };
    const pointerTrail: PointerTrailPoint[] = [];
    let lastPointer: { x: number; y: number } | null = null;
    let width = 0;
    let height = 0;
    let cellW = 8;
    let cellH = 10;
    let frame = 0;
    let raf = 0;
    let previousTime = 0;
    let dpr = 1;
    let background: HTMLCanvasElement | null = null;
    let logoCells: LogoCell[] = [];
    let ambientCells: AmbientCell[] = [];
    let logoScale = 1;
    let logoMaskWidth = 0;
    let logoMaskHeight = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      if (width < 1 || height < 1) {
        canvas.width = 0;
        canvas.height = 0;
        background = null;
        logoCells = [];
        ambientCells = [];
        return;
      }
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = window.innerWidth < 600;
      cellW = 8;
      cellH = 10;

      // Draw the ambient grid once; the pointer animation never alters it.
      background = document.createElement('canvas');
      background.width = Math.ceil(width);
      background.height = Math.ceil(height);
      const bg = background.getContext('2d')!;
      bg.fillStyle = '#000000';
      bg.fillRect(0, 0, width, height);
      bg.lineWidth = 0.55;
      bg.strokeStyle = 'rgba(255,255,255,0.105)';
      for (let x = 0; x <= width; x += cellW) {
        bg.beginPath(); bg.moveTo(x, 0); bg.lineTo(x, height); bg.stroke();
      }
      for (let y = 0; y <= height; y += cellH) {
        bg.beginPath(); bg.moveTo(0, y); bg.lineTo(width, y); bg.stroke();
      }
      // More sparse ambient marks than before, distributed across the full view.
      ambientCells = [];
      const ambientDensity = mobile ? 0.0038 : 0.005;
      for (let row = 0; row < Math.ceil(height / cellH); row += 1) {
        for (let col = 0; col < Math.ceil(width / cellW); col += 1) {
          const seed = hash(col, row);
          if (seed < ambientDensity) ambientCells.push({ x: col * cellW, y: row * cellH, col, row, phase: hash(col + 103, row + 211) });
        }
      }

      logoCells = [];
      if (!showLogo) return;

      // Build the mobile lockup at desktop proportions, then scale the complete
      // ASCII cell field as one centered unit so its letter spacing stays even.
      logoScale = 1;
      const mask = document.createElement('canvas');
      const size = mobile ? 205 : Math.min(width * 0.132, height * 0.31, 205);
      const measureCanvas = document.createElement('canvas');
      const measureCtx = measureCanvas.getContext('2d')!;
      measureCtx.font = `900 ${size}px Arial, Helvetica, sans-serif`;
      if (mobile) {
        const widestWord = Math.max(measureCtx.measureText('GOLD').width, measureCtx.measureText('RENDERS').width);
        const logoHeight = size * 1.68;
        logoScale = Math.min(1, (width * 0.88) / widestWord, (height * 0.34) / logoHeight);
        mask.width = Math.ceil(widestWord + cellW * 2);
        mask.height = Math.ceil(logoHeight + cellH * 2);
      } else {
        mask.width = Math.ceil(width);
        mask.height = Math.ceil(height);
      }
      logoMaskWidth = mask.width;
      logoMaskHeight = mask.height;
      const maskCtx = mask.getContext('2d', { willReadFrequently: true })!;
      maskCtx.font = `900 ${size}px Arial, Helvetica, sans-serif`;
      maskCtx.textAlign = 'center';
      maskCtx.textBaseline = 'middle';
      maskCtx.lineJoin = 'round';
      maskCtx.lineWidth = Math.max(1, size * 0.045);
      maskCtx.fillStyle = '#fff';
      maskCtx.strokeStyle = '#fff';
      if (mobile) {
        maskCtx.fillText('GOLD', mask.width / 2, mask.height / 2 - size * 0.48);
        maskCtx.strokeText('GOLD', mask.width / 2, mask.height / 2 - size * 0.48);
        maskCtx.fillText('RENDERS', mask.width / 2, mask.height / 2 + size * 0.55);
        maskCtx.strokeText('RENDERS', mask.width / 2, mask.height / 2 + size * 0.55);
      } else {
        maskCtx.fillText('GOLD RENDERS', width / 2, height / 2, width * 0.96);
        maskCtx.strokeText('GOLD RENDERS', width / 2, height / 2, width * 0.96);
      }

      const pixels = maskCtx.getImageData(0, 0, mask.width, mask.height).data;
      logoCells = [];
      const columns = Math.ceil(mask.width / cellW);
      const rows = Math.ceil(mask.height / cellH);
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns; col += 1) {
          const x = col * cellW;
          const y = row * cellH;
          const px = Math.min(mask.width - 1, Math.floor(x + cellW / 2));
          const py = Math.min(mask.height - 1, Math.floor(y + cellH / 2));
          if (pixels[(py * mask.width + px) * 4 + 3] > 32) {
            logoCells.push({ x, y, col, row, phase: hash(col + 31, row + 17), jitter: hash(col + 71, row + 53) - 0.5, offsetX: 0, offsetY: 0 });
          }
        }
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      if (lastPointer) {
        const dx = pointer.x - lastPointer.x;
        const dy = pointer.y - lastPointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 2) {
          pointerTrail.push({ x: pointer.x, y: pointer.y, strength: Math.min(1, 0.2 + distance / 24), time: performance.now() });
          if (pointerTrail.length > 16) pointerTrail.shift();
        }
      }
      lastPointer = { x: pointer.x, y: pointer.y };
    };
    const onLeave = () => { lastPointer = null; };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      // Redraw at display refresh rate for smooth cursor-driven scatter. Glyphs
      // advance about 2.5x faster than before while remaining legible.
      const elapsed = previousTime ? Math.min(now - previousTime, 48) : 16;
      previousTime = now;
      frame = Math.floor(now / 34);
      if (!background || width < 1 || height < 1) return;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(background, 0, 0, width, height);

      // Ambient characters flicker and change in place without pointer input.
      ctx.font = `700 ${cellH * 0.9}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      for (const cell of ambientCells) {
        const period = 70 + cell.phase * 85;
        const position = now / period;
        const tick = Math.floor(position);
        const rawBlend = position - tick;
        const blend = rawBlend * rawBlend * (3 - 2 * rawBlend);
        const seedA = hash(cell.col + tick * 13 + 401, cell.row - tick * 7 - 89);
        const seedB = hash(cell.col + (tick + 1) * 13 + 401, cell.row - (tick + 1) * 7 - 89);
        const alphaA = seedA < 0.2 ? 0 : 0.3 + hash(cell.col + tick * 17, cell.row - tick * 23) * 0.65;
        const alphaB = seedB < 0.2 ? 0 : 0.3 + hash(cell.col + (tick + 1) * 17, cell.row - (tick + 1) * 23) * 0.65;
        const charA = GLYPHS[Math.floor(hash(cell.col - tick * 17, cell.row + tick * 19) * GLYPHS.length)];
        const charB = GLYPHS[Math.floor(hash(cell.col - (tick + 1) * 17, cell.row + (tick + 1) * 19) * GLYPHS.length)];
        ctx.fillStyle = `rgba(255,255,255,${alphaA * (1 - blend)})`;
        ctx.fillText(charA, cell.x, cell.y + cellH * 0.88);
        ctx.fillStyle = `rgba(255,255,255,${alphaB * blend})`;
        ctx.fillText(charB, cell.x, cell.y + cellH * 0.88);
      }

      const radius = Math.min(105, width * 0.12);
      ctx.font = `700 ${cellH}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillStyle = '#f8f8f8';
      if (window.innerWidth < 600 && logoScale < 1) {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(logoScale, logoScale);
        ctx.translate(-logoMaskWidth / 2, -logoMaskHeight / 2);
      }
      for (const cell of logoCells) {
        let influence = 0;
        let pushX = 0;
        let pushY = 0;
        for (let trailIndex = pointerTrail.length - 1; trailIndex >= 0; trailIndex -= 1) {
          const trailPoint = pointerTrail[trailIndex];
          const age = (now - trailPoint.time) / 430;
          if (age >= 1) { pointerTrail.splice(trailIndex, 1); continue; }
          const trailDx = cell.x + cellW / 2 - trailPoint.x;
          const trailDy = cell.y + cellH / 2 - trailPoint.y;
          const trailDistance = Math.hypot(trailDx, trailDy);
          if (trailDistance >= radius) continue;
          const weight = trailPoint.strength * Math.pow(1 - age, 2) * Math.pow(1 - trailDistance / radius, 1.35);
          influence += weight;
          const push = weight * cellW * (4 + cell.phase * 8);
          pushX += (trailDx / Math.max(trailDistance, 1)) * push;
          pushY += (trailDy / Math.max(trailDistance, 1)) * push;
        }
        const totalInfluence = influence;
        influence = Math.min(1, influence);
        const glyphSeed = hash(cell.col + frame * 17, cell.row - frame * 23);
        const glyph = GLYPHS[Math.floor(glyphSeed * GLYPHS.length)];
        const targetX = pushX / Math.max(1, totalInfluence) + cell.jitter * influence * cellW;
        const targetY = pushY / Math.max(1, totalInfluence) - cell.jitter * influence * cellH;
        const currentDistance = Math.hypot(cell.offsetX, cell.offsetY);
        const targetDistance = Math.hypot(targetX, targetY);
        const responseTime = targetDistance > currentDistance ? 65 : 210;
        const response = 1 - Math.exp(-elapsed / responseTime);
        cell.offsetX += (targetX - cell.offsetX) * response;
        cell.offsetY += (targetY - cell.offsetY) * response;
        ctx.fillText(glyph, cell.x + cell.offsetX, cell.y + cellH * 0.9 + cell.offsetY);
      }
      if (window.innerWidth < 600 && logoScale < 1) ctx.restore();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    if (showLogo) {
      canvas.addEventListener('pointermove', onMove, { passive: true });
      canvas.addEventListener('pointerleave', onLeave, { passive: true });
    }
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      if (showLogo) {
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerleave', onLeave);
      }
    };
  }, [showLogo]);

  return <canvas ref={canvasRef} aria-label={showLogo ? 'ASCII GOLD RENDERS wordmark' : 'Animated ASCII character background'} role="img" className={`absolute inset-0 h-full w-full ${showLogo ? 'ascii-logo-canvas' : 'pointer-events-none'}`} />;
}

















