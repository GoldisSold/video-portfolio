'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';
import AsciiHero from '@/components/hero/AsciiHero';

const workflow = [
  {
    number: '01 / ASSEMBLY & RHYTHM',
    title: 'LOCK THE SPINE',
    description: 'We ingest raw footage, strip out dead air, map the narrative arc, and lock the core pacing before a single graphic or effect touches the timeline.',
  },
  {
    number: '02 / MOTION & DESIGN',
    title: 'BUILD THE SYSTEM',
    description: 'Custom kinetic typography, seamless transitions, and clean visual overlays engineered around your brand identity—never recycled templates.',
  },
  {
    number: '03 / COLOR, SOUND & MASTER',
    title: 'FINAL FINISH',
    description: 'Cohesive color grading, crisp sound design, frame-accurate client revisions, and multi-ratio exports formatted for web, cinema, and social.',
  },
];

const specifications = [
  ['LOCATION & TIMEZONE', 'Karachi, Pakistan (UTC+5) — Remote global delivery across US, UK, UAE & APAC timezones'],
  ['CORE PIPELINE', 'Adobe Premiere Pro / After Effects / Photoshop / DaVinci Resolve / Generative AI Workflows'],
  ['DELIVERABLE FORMATS', 'Short-Form Reels & TikTok / YouTube Long-Form / Brand & Commercial Films / Real Estate / Podcasts'],
  ['CLIENT COMMUNICATION', 'Frame-accurate review links / Direct async updates / Fluent in English & Urdu'],
];

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function AboutPage() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let current = window.scrollY;
    let target = current;
    let frame = 0;

    const animateScroll = () => {
      current += (target - current) * 0.085;
      if (Math.abs(target - current) < 0.6) {
        current = target;
        frame = 0;
      }
      window.scrollTo({ top: current, behavior: 'instant' });
      if (frame) frame = window.requestAnimationFrame(animateScroll);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      if (!frame) {
        current = window.scrollY;
        target = current;
      }
      const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? window.innerHeight
          : 1;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.max(0, Math.min(maxScroll, target + event.deltaY * multiplier));
      if (!frame) frame = window.requestAnimationFrame(animateScroll);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main className="relative isolate min-h-screen overflow-clip bg-black text-[#f2f0ea] selection:bg-white selection:text-black">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-35">
        <AsciiHero showLogo={false} />
      </div>

      <section id="about" className="relative z-10 border-b border-white/20 px-5 pb-14 pt-36 sm:px-8 sm:pb-20 sm:pt-40 lg:px-12 lg:pb-28 lg:pt-44">
        <motion.div {...reveal}>
          <p className="mb-6 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 sm:text-[10px]">GOLD RENDERS / ABOUT</p>
          <h1 className="max-w-5xl text-[clamp(48px,10.2vw,132px)] font-black uppercase leading-[0.86] tracking-[-0.075em]">
            PRECISION IN<br />EVERY FRAME.
          </h1>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 items-end gap-8 sm:mt-20 md:grid-cols-12 lg:mt-24">
          <motion.p {...reveal} className="max-w-md text-[13px] leading-relaxed text-white/75 sm:text-sm md:col-span-5">
            Gold Renders is an independent post-production studio based in Karachi, partnering with creators, brands, and agencies worldwide. We turn raw footage into sharp, story-driven edits with disciplined rhythm, custom motion, and a cohesive final finish.
          </motion.p>
          <motion.p {...reveal} className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50 md:col-span-7 md:text-right sm:text-[10px]">
            EST. KARACHI — WORKING GLOBALLY [UTC+5]
          </motion.p>
        </div>
      </section>

      <section className="relative z-10 border-b border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="flex flex-col justify-between border-b border-white/20 px-5 py-10 sm:px-8 sm:py-14 md:col-span-4 md:border-b-0 md:border-r lg:px-12 lg:py-16">
            <motion.div {...reveal}>
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 sm:text-[10px]">01 / PHILOSOPHY</p>
              <h2 className="text-2xl font-bold uppercase leading-tight tracking-[-0.04em] sm:text-3xl">CUT WITH INTENT.<br />NO FILLER.</h2>
            </motion.div>

            <motion.div {...reveal} className="mt-12 pt-5 sm:mt-16">
              <svg aria-label="Raw footage moves through shaping to a finished master" role="img" viewBox="0 0 220 64" fill="none" className="h-auto w-[220px] max-w-full opacity-80">
                <line x1="24" y1="32" x2="196" y2="32" stroke="#777" />
                <line x1="24" y1="32" x2="196" y2="32" stroke="#f2f0ea" strokeDasharray="3 5" className="about-flow-line" />
                <rect x="18" y="26" width="12" height="12" fill="#050505" stroke="#f2f0ea" className="about-pulse-1" />
                <text x="14" y="54" fill="#888" fontFamily="monospace" fontSize="8">RAW</text>
                <circle cx="110" cy="32" r="6" fill="#050505" stroke="#f2f0ea" className="about-pulse-2" />
                <text x="98" y="54" fill="#888" fontFamily="monospace" fontSize="8">SHAPE</text>
                <polygon points="196,25 203,32 196,39 189,32" fill="#050505" stroke="#f2f0ea" className="about-pulse-3" />
                <text x="181" y="54" fill="#888" fontFamily="monospace" fontSize="8">MASTER</text>
              </svg>
            </motion.div>
          </div>

          <div className="flex flex-col justify-between gap-10 px-5 py-10 sm:px-8 sm:py-14 md:col-span-8 lg:px-12 lg:py-16">
            <motion.p {...reveal} className="max-w-2xl text-lg font-light leading-snug text-white/90 sm:text-xl md:text-2xl">
              Great post-production isn’t about burying weak footage under flashy presets. It’s about pacing, restraint, and knowing exactly when to hold a frame—and when to cut.
            </motion.p>
            <div className="grid grid-cols-1 gap-7 border-t border-white/20 pt-5 text-[12px] leading-relaxed text-white/60 sm:text-[13px] md:grid-cols-2 md:gap-8">
              <motion.p {...reveal}>
                Every project starts with story structure and rhythm. Whether it’s a high-retention short-form reel, a real estate showcase, or a long-form brand documentary, we build the edit from the timeline up so every transition earns its place.
              </motion.p>
              <motion.p {...reveal}>
                From custom typography and motion systems to balanced color grading and clean audio finishing, we handle the entire post-production pipeline under one roof—delivering masters ready for every screen and aspect ratio.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b border-white/20">
        <div className="flex items-center justify-between border-b border-white/20 px-5 py-5 sm:px-8 lg:px-12">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 sm:text-[10px]">02 / STUDIO WORKFLOW</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 sm:text-[10px]">[ 01 — 03 ]</p>
        </div>
        <div className="grid grid-cols-1 divide-y divide-white/20 md:grid-cols-3 md:divide-x md:divide-y-0">
          {workflow.map((step, index) => (
            <motion.article key={step.number} {...reveal} whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }} transition={{ duration: 0.35 }} className="group px-5 py-9 sm:px-8 sm:py-12 lg:px-12">
              <p className="mb-8 font-mono text-[10px] text-white/50 transition-colors duration-300 group-hover:text-white sm:text-xs">{step.number}</p>
              <h3 className="mb-4 text-xl font-bold uppercase tracking-[-0.04em] sm:text-2xl">{step.title}</h3>
              <p className="text-[12px] leading-relaxed text-white/60 sm:text-[13px]">{step.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative z-10 border-b border-white/20">
        <div className="border-b border-white/20 px-5 py-5 sm:px-8 lg:px-12">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 sm:text-[10px]">03 / TECHNICAL SPECIFICATIONS</p>
        </div>
        <div className="divide-y divide-white/20 font-mono text-[10px] sm:text-[11px]">
          {specifications.map(([label, value]) => (
            <motion.div key={label} whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }} transition={{ duration: 0.3 }} className="grid grid-cols-1 px-5 py-5 transition-colors sm:px-8 md:grid-cols-12 lg:px-12">
              <div className="mb-2 uppercase tracking-[0.12em] text-white/45 md:col-span-4 md:mb-0">{label}</div>
              <div className="leading-relaxed text-white/80 md:col-span-8">{value}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 border-b border-white/20 px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <motion.div {...reveal}>
          <p className="mb-6 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 sm:text-[10px]">HAVE A PROJECT IN MIND?</p>
          <h2 className="mb-9 text-[clamp(48px,9.5vw,120px)] font-black uppercase leading-[0.86] tracking-[-0.075em]">
            LET’S MAKE<br />IT MATTER.
          </h2>
          <Link href="/contact" className="group inline-flex items-center gap-3 border-b border-white/80 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-white/45 hover:text-white/55 sm:text-xs">
            <span>START A PROJECT</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
