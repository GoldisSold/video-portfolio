'use client';

import { useEffect, useState } from 'react';
import AsciiHero from '@/components/hero/AsciiHero';

const links = [
  { label: 'Instagram', value: '@gold.renders', href: 'https://www.instagram.com/gold.renders/' },
  { label: 'Phone', value: '+92 333 2398655', href: 'tel:+923332398655' },
  { label: 'WhatsApp', value: 'Start a conversation ↗', href: 'https://wa.me/923332398655' },
];

export default function SiteFooter() {
  const [pktTime, setPktTime] = useState('--:--:--');

  useEffect(() => {
    const updateTime = () => setPktTime(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).format(new Date()));
    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className="relative z-20 w-full overflow-hidden border-t border-white/20 bg-black px-6 py-6 font-mono text-[10px] text-white sm:px-10 sm:py-8 sm:text-[11px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-45"><AsciiHero showLogo={false} /></div>
      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:justify-items-center lg:gap-8">
        {links.map((link) => (
          <a key={link.label} href={link.href} target={link.href.startsWith('https://') ? '_blank' : undefined} rel={link.href.startsWith('https://') ? 'noreferrer' : undefined} className="group flex items-center justify-between gap-4 uppercase tracking-[0.07em] text-white/85 transition-colors hover:text-white sm:justify-start sm:gap-3 lg:justify-center">
            <span className="text-white/45">{link.label}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">{link.value}</span>
          </a>
        ))}
        <div className="flex items-center justify-between gap-4 uppercase tracking-[0.07em] text-white/85 sm:justify-start sm:gap-3 lg:justify-center">
          <span className="text-white/45">PKT UTC+5</span>
          <time aria-label="Current Pakistan Standard Time" suppressHydrationWarning>{pktTime}</time>
        </div>
      </div>
    </footer>
  );
}
