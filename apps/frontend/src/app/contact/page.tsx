'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import AsciiHero from '@/components/hero/AsciiHero';

const contextItems = [
  'What kind of video you need',
  'Where it will be seen and who it is for',
  'Your target delivery date',
  'Any visual references or edits you like',
  'A budget range, if you have one',
];

const inputClass = 'mt-2 w-full border border-white/15 bg-white/[0.025] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/60';
const labelClass = 'font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/75';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.get('name'),
          email: values.get('email'),
          whatsapp: values.get('whatsapp'),
          projectType: values.get('projectType'),
          message: values.get('message'),
          website: values.get('website'),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not send your enquiry just now.');
      setStatus('success');
      setStatusMessage('Enquiry sent. We’ll be in touch soon.');
      form.reset();
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'We could not send your enquiry just now. Please try again.');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-10 pt-32 text-[#f2f0ea] sm:px-8 sm:pb-12 sm:pt-36 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-35"><AsciiHero showLogo={false} /></div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pt-3 lg:pt-8"
        >
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">Contact / Project enquiry</p>
          <h1 className="mt-5 max-w-[700px] text-[clamp(42px,6.5vw,86px)] font-bold leading-[0.92] tracking-[-0.065em]">
            What are we<br />making next?
          </h1>
          <p className="mt-5 max-w-[560px] text-sm leading-6 text-white/65 sm:text-base">
            A rough idea is enough to start. Tell us what you want the video to do, and we can shape the edit, motion, and finish around it.
          </p>

          <div className="mt-10 max-w-[560px] border-t border-white/15 pt-5">
            <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/75">Useful context</h2>
            <ul className="mt-4 space-y-3 text-[13px] leading-5 text-white/60">
              {contextItems.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-white/35">—</span><span>{item}</span></li>)}
            </ul>
          </div>

          <div className="mt-8 grid max-w-[560px] gap-4 border-t border-white/15 pt-5 sm:grid-cols-2">
            <a href="mailto:umerh0025@gmail.com" className="group">
              <span className="block font-mono text-[9px] uppercase tracking-[0.13em] text-white/45">Email</span>
              <span className="mt-1 block text-sm transition-colors group-hover:text-white/70">umerh0025@gmail.com</span>
            </a>
            <a href="https://wa.me/923332398655" target="_blank" rel="noreferrer" className="group">
              <span className="block font-mono text-[9px] uppercase tracking-[0.13em] text-white/45">WhatsApp</span>
              <span className="mt-1 block text-sm transition-colors group-hover:text-white/70">+92 333 2398655</span>
            </a>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="h-fit border border-white/10 bg-[#080808]/90 p-5 sm:p-7 lg:p-8"
          aria-labelledby="project-form-title"
        >
          <div className="mb-7">
            <h2 id="project-form-title" className="text-xl font-semibold tracking-[-0.035em] sm:text-2xl">Project enquiry</h2>
            <p className="mt-2 text-xs leading-5 text-white/55 sm:text-sm">A few details are enough. We can work out the rest together.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>Name <span className="text-white/50">*</span></label>
              <input id="name" name="name" autoComplete="name" required placeholder="Your name" className={inputClass} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelClass}>Email <span className="text-white/50">*</span></label>
                <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={inputClass} />
              </div>
              <div>
                <label htmlFor="whatsapp" className={labelClass}>WhatsApp number <span className="text-white/45">(optional)</span></label>
                <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" placeholder="Include country code, e.g. +1 555 123 4567" className={inputClass} />
              </div>
            </div>
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div>
              <label htmlFor="projectType" className={labelClass}>Project type <span className="text-white/50">*</span></label>
              <input id="projectType" name="projectType" required placeholder="e.g. brand film, social edit, podcast" className={inputClass} />
            </div>
            <div>
              <label htmlFor="message" className={labelClass}>Project details <span className="text-white/50">*</span></label>
              <textarea id="message" name="message" required rows={5} placeholder="Tell us about the idea, where the video will be used, your timeline, and any visual references or edits you like." className={`${inputClass} resize-y`} />
            </div>
            <button type="submit" disabled={status === 'sending'} className="flex w-full items-center justify-between bg-[#f2f0ea] px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.1em] text-black transition-colors hover:bg-white/80 disabled:cursor-wait disabled:opacity-70">
              <span>{status === 'sending' ? 'Sending enquiry…' : 'Send project enquiry'}</span><span aria-hidden="true">↗</span>
            </button>
            <p aria-live="polite" className={`min-h-4 text-[10px] leading-4 ${status === 'error' ? 'text-white/80' : 'text-white/55'}`}>
              {statusMessage}
            </p>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
