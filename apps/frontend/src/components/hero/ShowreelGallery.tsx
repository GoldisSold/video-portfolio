'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AsciiHero from '@/components/hero/AsciiHero';

const projects = [
  {
    title: 'TALKING HEAD',
    src: 'https://res.cloudinary.com/uljycst6/video/upload/v1794384040/podcast_comp.mp4',
  },
  {
    title: 'FOOD REVIEW',
    src: 'https://res.cloudinary.com/uljycst6/video/upload/v1794379966/foodvid.mp4',
  },
  {
    title: 'COMMERCIAL',
    src: 'https://res.cloudinary.com/uljycst6/video/upload/v1795034349/product_ad_ai.mp4',
  },
];

const spring = { type: 'spring' as const, stiffness: 170, damping: 24, mass: 0.85 };

export default function ShowreelGallery() {
  const [focus, setFocus] = useState(1);
  const [sideOffset, setSideOffset] = useState(180);
  const touchStartX = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const suppressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateOffset = () => setSideOffset(window.innerWidth < 640
      ? Math.min(window.innerWidth * 0.31, 142)
      : Math.min(window.innerWidth * 0.145, 210));
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  useEffect(() => () => {
    if (suppressTimer.current) clearTimeout(suppressTimer.current);
  }, []);

  return (
    <section id="showreel" aria-label="Selected video projects" className="relative z-20 flex min-h-[100svh] w-full items-center overflow-hidden bg-black px-5 pb-10 pt-28 text-white sm:px-8 sm:pt-24 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-55"><AsciiHero showLogo={false} /></div>
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] items-center gap-8 lg:grid-cols-[0.85fr_1.5fr] lg:gap-3">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-[620px] lg:pb-2"
        >
          <h2 className="text-[clamp(34px,6vw,82px)] font-black uppercase leading-[0.88] tracking-[-0.065em]">
            Stylish<br />Production.<br />Seamless<br />Execution.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto h-[56svh] min-h-[300px] w-full max-w-[820px] sm:h-[68svh] sm:min-h-[440px] lg:ml-auto lg:mr-0 lg:-translate-x-10"
          onPointerDown={(event) => {
            if (event.pointerType === 'touch') touchStartX.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (event.pointerType !== 'touch' || touchStartX.current === null) return;
            const delta = event.clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) < 36) return;
            suppressClick.current = true;
            if (suppressTimer.current) clearTimeout(suppressTimer.current);
            suppressTimer.current = setTimeout(() => { suppressClick.current = false; }, 500);
            setFocus((current) => (current + (delta < 0 ? 1 : 2)) % projects.length);
          }}
          onPointerCancel={() => { touchStartX.current = null; }}
          style={{ touchAction: 'pan-y' }}
        >
          {projects.map((project, index) => {
            const order = (index - focus + projects.length) % projects.length;
            const isFocused = index === focus;
            const x = isFocused ? 0 : order === 1 ? sideOffset : -sideOffset;
            return (
              <motion.article
                key={project.title}
                initial={false}
                animate={{ x, scale: isFocused ? 1.055 : 0.94, y: '-50%' }}
                transition={spring}
                onClick={() => {
                  if (suppressClick.current) { suppressClick.current = false; return; }
                  setFocus(index);
                }}
                onFocus={() => setFocus(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setFocus(index);
                  }
                }}
                style={{ zIndex: isFocused ? 5 : 2, left: '50%', top: '50%' }}
                className={`showreel-card pointer-events-auto absolute h-[min(52svh,460px)] min-h-[280px] aspect-[9/16] cursor-pointer overflow-hidden border bg-[#101010] shadow-[0_18px_70px_rgba(0,0,0,0.45)] outline-none transition-colors duration-500 focus-visible:border-white sm:h-[min(68svh,680px)] sm:min-h-[440px] ${isFocused ? 'border-white/80' : 'border-white/25'}`}
                role="button"
                tabIndex={0}
                aria-label={`Focus ${project.title} video`}
              >
                <video
                  src={project.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={isFocused ? 'auto' : 'metadata'}
                  className="absolute inset-0 h-full w-full object-cover"
                  aria-label={project.title}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/65" />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-end p-3 font-mono text-[7px] font-bold uppercase tracking-[0.14em] text-white/85 sm:p-4 sm:text-[9px]">
                  <span>0{index + 1} / 03</span>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-5">
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/60 sm:text-[9px]">GOLD RENDERS</p>
                  <h3 className="mt-1 text-[clamp(15px,1.6vw,24px)] font-bold uppercase leading-none tracking-[-0.045em]">{project.title}</h3>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
