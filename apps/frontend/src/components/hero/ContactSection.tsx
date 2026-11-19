'use client';

import { motion } from 'framer-motion';
import AsciiHero from '@/components/hero/AsciiHero';

export default function ContactSection() {
  return (
    <section id="contact" aria-label="Contact Gold Renders" className="relative z-20 flex min-h-0 w-full flex-col overflow-hidden bg-black px-6 pb-6 pt-8 text-[#f2f0ea] sm:min-h-[100svh] sm:px-10 sm:pb-10 sm:pt-40 lg:px-[16vw] lg:pt-[24vh]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-45"><AsciiHero showLogo={false} /></div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-[650px]"
      >
        <p className="text-[clamp(15px,1.35vw,21px)] leading-[1.45] text-white/80">
          Let’s work together. If you have an idea, a project, or simply want to talk about visuals and editing, feel free to reach out. You can email me directly or say hello through the links below.
        </p>
      </motion.div>

      <motion.a
        href="mailto:umerh0025@gmail.com"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-6 block w-fit max-w-full break-words text-[clamp(28px,6.8vw,132px)] font-black leading-[0.9] tracking-[-0.085em] text-[#f2f0ea] transition-colors duration-300 hover:text-white/75 sm:mt-16"
      >
        umerh0025@gmail.com
      </motion.a>

    </section>
  );
}
