'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AsciiHero from '@/components/hero/AsciiHero';
import VideoShowcase from '@/components/hero/VideoShowcase';
import ShowreelGallery from '@/components/hero/ShowreelGallery';
import ContactSection from '@/components/hero/ContactSection';

export default function Home() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let current = window.scrollY;
    let target = current;
    let raf = 0;

    const animateScroll = () => {
      current += (target - current) * 0.085;
      if (Math.abs(target - current) < 0.6) {
        current = target;
        raf = 0;
      }
      window.scrollTo({ top: current, behavior: 'instant' });
      if (raf) raf = requestAnimationFrame(animateScroll);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      if (!raf) { current = window.scrollY; target = current; }
      const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.max(0, Math.min(maxScroll, target + event.deltaY * multiplier));
      if (!raf) raf = requestAnimationFrame(animateScroll);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-clip bg-black text-[#f2f0ea] selection:bg-white selection:text-black">
      <section id="about" className="sticky top-0 z-0 h-[100svh] min-h-[480px] w-screen overflow-hidden bg-black">
        <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 1.015 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}>
          <AsciiHero />
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.58, ease: [0.22, 1, 0.36, 1] }} className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-start justify-between gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:gap-6 sm:px-8 sm:pb-8 lg:px-12 lg:pb-10" aria-label="Studio introduction">
          <h1 className="max-w-full text-[clamp(20px,3.2vw,48px)] font-medium uppercase leading-[0.96] tracking-[-0.055em] sm:max-w-[55vw]">POST-PRODUCTION REIMAGINED</h1>
          <p className="max-w-[440px] font-mono text-[9px] font-medium uppercase leading-[1.65] tracking-[0.045em] text-white/80 sm:text-right sm:text-[10px]">A multidisciplinary post-production studio blending precision editing, immersive motion design, and raw storytelling to elevate modern digital brands.</p>
        </motion.section>
      </section>

      <VideoShowcase />
      <ShowreelGallery />
      <ContactSection />
    </main>
  );
}



