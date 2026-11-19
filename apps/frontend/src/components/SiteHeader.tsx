'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const links = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.16, ease: 'easeOut' }} className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 pt-5 text-white sm:px-8 sm:pt-8 lg:px-12 lg:pt-10">
      <nav aria-label="Main navigation" className="pointer-events-auto flex flex-col items-start gap-1 text-[8px] uppercase tracking-[0.12em] text-white/80 sm:gap-2 sm:text-[10px] sm:tracking-[0.16em]">
        {links.map((item) => (
          <motion.div key={item.label} initial="rest" whileHover="hover" className="group flex items-center gap-2">
            <motion.span variants={{ rest: { width: 0 }, hover: { width: 12 } }} transition={{ duration: 0.22 }} className="h-px bg-white" />
            <Link href={item.href} className="transition-colors hover:text-white">{item.label}</Link>
          </motion.div>
        ))}
      </nav>

      <motion.div whileHover={{ scale: 1.045, opacity: 0.76 }} transition={{ duration: 0.24, ease: 'easeOut' }} className="pointer-events-auto absolute left-1/2 top-5 -translate-x-1/2 sm:top-7">
        <Link
          href="/"
          aria-label="GOLD RENDERS home"
          onClick={(event) => {
            if (pathname === '/') {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center"
        >
          <span className="flex h-[27px] min-w-[76px] items-center justify-center border border-white/80 bg-[#f2f0ea] px-2 text-black shadow-[0_0_18px_rgba(255,255,255,0.08)]">
            <span className="font-mono text-[16px] font-bold leading-none tracking-[0.18em]">GOLD</span>
          </span>
          <span className="mt-1 text-[7px] font-medium uppercase tracking-[0.42em] text-white/90">RENDERS</span>
        </Link>
      </motion.div>

      <p className="max-w-[92px] text-right text-[8px] uppercase leading-[1.55] tracking-[0.08em] text-white/90 sm:max-w-none sm:text-[10px] sm:tracking-[0.13em]">
        <span className="block">Post-Production Studio</span>Pakistan
      </p>
    </motion.header>
  );
}
