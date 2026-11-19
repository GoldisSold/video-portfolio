'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import AsciiHero from '@/components/hero/AsciiHero';

const services = [
  {
    number: '01',
    title: 'EDITING',
    description: 'We shape raw footage into a clear, compelling story. From the first assembly to the final cut, every frame earns its place and every transition serves the pace.',
  },
  {
    number: '02',
    title: 'MOTION DESIGN',
    description: 'Type, graphics, and movement built around the idea. We create visual systems that bring a brand film, product story, or social cut to life without distracting from the message.',
  },
  {
    number: '03',
    title: 'COLOR & FINISH',
    description: 'A considered final pass makes the whole piece feel intentional. We balance color, clean up the image, refine sound, and prepare versions for every platform.',
  },
  {
    number: '04',
    title: 'AI-ASSISTED VISUALS',
    description: 'When the brief calls for something beyond the ordinary, we explore emerging image and video tools with a human eye on the story, the craft, and the final result.',
  },
];

function ServiceGraphic({ index }: { index: number }) {
  const common = 'h-auto w-[clamp(195px,27.5vw,377px)] opacity-70 transition-opacity duration-500 group-hover:opacity-100';

  if (index === 0) return (
    <svg aria-hidden="true" viewBox="0 0 260 64" fill="none" className={common}>
      <path d="M0 14H260M0 32H260M0 50H260" stroke="#292929" />
      <path d="M24 8h68v12H24zM138 8h84v12h-84zM4 26h104v12H4zM108 26h76v12h-76zM192 26h58v12h-58z" fill="#090909" stroke="#444" />
      <rect x="4" y="44" width="218" height="12" stroke="#383838" />
      <path className="service-wave" d="M12 50h12l3-4 3 8 3-6 3 4 3-2h39l3-5 3 10 3-8 3 5 3-2h52l3-4 3 8 3-5 3 1h53" stroke="#b5b5b5" />
      <g className="service-playhead"><path d="M20 0v64" stroke="white" /><path d="m16 0 4 5 4-5" fill="white" /></g>
    </svg>
  );

  if (index === 1) return (
    <svg aria-hidden="true" viewBox="0 0 260 64" fill="none" className={common}>
      <rect x="1" y="4" width="140" height="56" stroke="#333" />
      <path d="M1 32h140M71 4v56" stroke="#242424" strokeDasharray="2 3" />
      <path id="service-motion-curve" d="M12 52C62 52 78 12 130 12" stroke="#aaa" strokeWidth="1.2" />
      <path d="M12 52h50m68-40H78" stroke="#606060" />
      <path d="m12 48 4 4-4 4-4-4zM130 8l4 4-4 4-4-4z" fill="#050505" stroke="#ddd" />
      <circle cx="62" cy="52" r="2.5" fill="#050505" stroke="#888" /><circle cx="78" cy="12" r="2.5" fill="#050505" stroke="#888" />
      <circle r="2.5" fill="white"><animateMotion dur="3.2s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1"><mpath href="#service-motion-curve" /></animateMotion></circle>
      <path d="M160 32h90" stroke="#333" />
      <polygon className="service-kf-1" points="175,28 179,32 175,36 171,32" stroke="#ddd" fill="#050505" />
      <polygon className="service-kf-2" points="210,28 214,32 210,36 206,32" stroke="white" fill="#ddd" />
      <polygon className="service-kf-3" points="242,28 246,32 242,36 238,32" stroke="#ddd" fill="#050505" />
    </svg>
  );

  if (index === 2) return (
    <svg aria-hidden="true" viewBox="0 0 260 64" fill="none" className={common}>
      <rect x="1" y="4" width="56" height="56" stroke="#333" />
      <path d="M1 60 57 4" stroke="#222" />
      <path id="service-lut-curve" d="M1 60C18 56 36 14 57 4" stroke="#ddd" strokeWidth="1.1" />
      <circle r="2.2" fill="white"><animateMotion dur="4.5s" repeatCount="indefinite" keyPoints="0.2;0.8;0.2" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"><mpath href="#service-lut-curve" /></animateMotion></circle>
      <rect x="72" y="4" width="180" height="56" stroke="#333" />
      <path d="M72 16h180M72 32h180M72 48h180" stroke="#242424" strokeDasharray="2 3" />
      <path className="service-scope-a" d="M76 44q14 4 26-8t26-14 27 12 27-16 30 10 36 12" stroke="#ddd" />
      <path className="service-scope-b" d="M76 49q18 3 34-7t30-12 30 10 32-15 46 21" stroke="#777" />
    </svg>
  );

  return (
    <svg aria-hidden="true" viewBox="0 0 260 64" fill="none" className={common}>
      <g fill="#888"><circle cx="10" cy="14" r="1.5" /><circle cx="26" cy="48" r="1.5" /><circle cx="42" cy="22" r="1.5" /><circle cx="18" cy="34" r="1.5" /><circle cx="56" cy="44" r="1.5" /><circle cx="64" cy="12" r="1.5" /></g>
      <path d="m10 14 32 8-16 26 70-16 58 0" stroke="#555" />
      <path className="service-stream" d="M154 32H96" stroke="#ddd" strokeDasharray="3 5" />
      <circle cx="96" cy="32" r="2.5" fill="#050505" stroke="#bbb" />
      <rect x="154" y="8" width="48" height="48" stroke="#555" />
      <path d="m178 16 16 30h-32z" stroke="#ddd" />
      <circle cx="178" cy="34" r="2" fill="white" className="service-core" />
    </svg>
  );
}

export default function ServicesPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 0.55, 0]);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    let current = window.scrollY;
    let target = current;
    let frame = 0;

    const animate = () => {
      current += (target - current) * 0.085;
      if (Math.abs(target - current) < 0.6) {
        current = target;
        frame = 0;
      }
      window.scrollTo({ top: current, behavior: 'instant' });
      if (frame) frame = window.requestAnimationFrame(animate);
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
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main className="relative isolate overflow-clip bg-black text-[#f2f0ea]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-50"><AsciiHero showLogo={false} /></div>

      <motion.section ref={heroRef} style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 flex min-h-[88svh] flex-col justify-between px-5 pb-10 pt-36 sm:min-h-screen sm:px-8 sm:pb-12 sm:pt-40 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
          <p className="mb-7 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/55 sm:text-[10px]">GOLD RENDERS / SERVICES</p>
          <h1 className="max-w-[1180px] text-[clamp(58px,12.2vw,180px)] font-black uppercase leading-[0.78] tracking-[-0.075em]">
            WE SHAPE<br />THE CUT.
          </h1>
        </motion.div>
        <div className="flex items-end justify-between gap-8 pb-4">
          <p className="max-w-[440px] text-sm leading-6 text-white/65 sm:text-base">Post-production for stories that need a sharper rhythm, a stronger image, and a finish that feels complete.</p>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-white/50 sm:block">Scroll to explore ↓</span>
        </div>
      </motion.section>

      <div className="relative z-10 isolate pb-[max(44svh,280px)]">
        {services.map((service, index) => (
          <section key={service.number} style={{ zIndex: index + 1 }} className="service-card group sticky top-[110px] isolate flex h-[44svh] min-h-[280px] flex-col border-t border-white/45 bg-[#050505] px-5 pb-5 pt-5 transition-colors duration-500 hover:bg-[#101010] sm:top-[114px] sm:px-8 sm:pb-6 sm:pt-6 lg:top-[122px] lg:px-12 lg:pb-7 lg:pt-6">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-40"><AsciiHero showLogo={false} /></div>
              <div className="relative z-10 flex h-full flex-col">
              <div className="grid grid-cols-[17vw_1fr] items-start gap-2 sm:gap-5">
                <span className="pt-0.5 text-[clamp(32px,4.2vw,64px)] font-medium leading-none tracking-[-0.065em] text-white/90">{service.number}</span>
                <h2 className="max-w-[1200px] text-[clamp(34px,5.2vw,80px)] font-semibold uppercase leading-[0.9] tracking-[-0.065em]">{service.title}</h2>
              </div>
              <div className="mt-auto flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <ServiceGraphic index={index} />
                <motion.p
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.2, once: false }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-full pb-1 text-[11px] leading-[1.4] text-white/75 sm:max-w-[34%] sm:text-[13px] sm:leading-[1.45]"
                >
                  {service.description}
                </motion.p>
              </div>
              </div>
          </section>
        ))}
      </div>

      <section className="relative z-20 isolate -mt-[max(44svh,280px)] flex min-h-[62svh] flex-col items-start justify-center gap-8 border-t border-white/30 bg-[#050505] px-5 py-20 sm:px-8 lg:px-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-40"><AsciiHero showLogo={false} /></div>
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/50">Have a project in mind?</p>
          <h2 className="max-w-[1000px] text-[clamp(42px,9vw,124px)] font-black uppercase leading-[0.84] tracking-[-0.075em]">Let’s make<br />it matter.</h2>
        </motion.div>
        <Link href="/contact" className="group relative z-10 inline-flex items-center gap-4 border-b border-white/60 pb-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors hover:text-white/60">
          Start a project <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
        </Link>
      </section>
    </main>
  );
}
