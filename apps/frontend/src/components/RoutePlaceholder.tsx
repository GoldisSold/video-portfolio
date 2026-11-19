import Link from 'next/link';

export default function RoutePlaceholder({ title }: { title: string }) {
  return (
    <main className="relative flex min-h-screen w-full items-center bg-black px-6 text-[#f2f0ea] sm:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-[1500px] pt-28">
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">GOLD RENDERS / {title}</p>
        <h1 className="text-[clamp(48px,12vw,160px)] font-black uppercase leading-[0.85] tracking-[-0.07em]">Coming soon.</h1>
        <p className="mt-6 max-w-xl font-mono text-xs uppercase leading-relaxed tracking-[0.08em] text-white/60">This page is being shaped. Check back soon.</p>
        <Link href="/" className="mt-10 inline-flex border-b border-white/40 pb-2 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors hover:text-white/60">Back to home ↗</Link>
      </div>
    </main>
  );
}
