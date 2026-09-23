"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function useCountUp(target: number, suffix: string, duration = 1800) {
  const [value, setValue] = useState("0" + suffix);
  const hasCountedRef = useRef(false);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasCountedRef.current) {
            hasCountedRef.current = true;
            const start = performance.now();
            const step = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = easeOutQuart(progress);
              const current = Math.floor(eased * target);
              setValue(current.toLocaleString() + suffix);
              if (progress < 1) requestAnimationFrame(step);
              else setValue(target.toLocaleString() + suffix);
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix, duration]);

  return { value, elRef };
}

const STATS = [
  { target: 50000, suffix: "+", label: "Satisfied Patients", gradient: "from-brand to-brand-soft" },
  { target: 500, suffix: "+", label: "Verified Doctors", gradient: "from-brand-soft to-[#7C3AED]" },
  { target: 98, suffix: "%", label: "AI Accuracy Rate", gradient: "from-brand to-brand-soft" },
  { target: 24, suffix: "/7", label: "Live AI Support", gradient: "from-[#0E3B3A] to-brand-soft" },
];

export const TrustStripSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Scroll reveal for header
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("stats-header-visible"); obs.unobserve(e.target); } }); },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-[120px] md:py-[80px] bg-bg-mint" id="stats">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-[72px] stats-header-reveal">
          <div className="w-[60px] h-[3px] rounded-full bg-gradient-to-r from-brand to-brand-soft mx-auto mb-7 origin-center scale-x-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transitionDelay: "0s" }} />
          <span className="inline-block font-sans font-medium text-[11px] tracking-[0.12em] uppercase text-brand bg-brand/10 rounded-full px-3.5 py-1 mb-5">Our Impact in Numbers</span>
          <h2 className="font-heading font-extrabold text-[clamp(32px,4.5vw,52px)] text-text-primary leading-[1.15] mb-3.5">
            Medilink AI By The Numbers
          </h2>
          <p className="font-sans text-[16px] text-text-muted leading-[1.75] max-w-[520px] mx-auto">
            Trusted by patients, doctors, and caregivers across Bangladesh.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 md:grid-cols-2 max-md:grid-cols-2 gap-0 relative">
          {STATS.map((stat, index) => {
            const { value, elRef } = useCountUp(stat.target, stat.suffix);
            return (
              <StatItem key={index} stat={stat} value={value} elRef={elRef} index={index} isLast={index === STATS.length - 1} />
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .stats-header-reveal > * { opacity: 0; transform: translateY(24px); filter: blur(2px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.7s cubic-bezier(0.16,1,0.3,1); }
        .stats-header-visible > *:nth-child(1) { transition-delay: 0s; }
        .stats-header-visible > *:nth-child(2) { transition-delay: 0.12s; }
        .stats-header-visible > *:nth-child(3) { transition-delay: 0.24s; }
        .stats-header-visible > *:nth-child(4) { transition-delay: 0.36s; }
        .stats-header-visible > * { opacity: 1 !important; transform: translateY(0) !important; filter: blur(0) !important; }
        .stats-header-visible > div:first-child { transform: scaleX(1) !important; }
      `}</style>
    </section>
  );
};

interface StatItemProps {
  stat: typeof STATS[0];
  value: string;
  elRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  isLast: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ stat, value, elRef, index, isLast }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("stat-item-visible"); obs.unobserve(e.target); } }); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={(node) => {
        (itemRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (elRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className="stat-item-reveal relative text-center py-8 px-4 md:py-5 md:px-2"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {!isLast && (
        <div className="absolute right-0 top-[20%] bottom-[20%] w-px bg-brand/10 max-md:hidden" />
      )}
      <div className="w-1.5 h-1.5 rounded-full bg-brand opacity-45 mx-auto mb-4" />
      <div className={`font-heading font-extrabold text-[clamp(44px,6vw,72px)] leading-none mb-2.5 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="font-sans text-[14px] font-medium text-text-muted tracking-[0.01em]">{stat.label}</div>
    </div>
  );
};

export default TrustStripSection;
