"use client";

import React, { useState, useEffect } from "react";
import { useIntersectionOnce } from "@/lib/useIntersection";

function useCountUp(target: number, suffix: string, duration = 1800) {
  const [value, setValue] = useState("0" + suffix);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * target);
      setValue(current.toLocaleString() + suffix);
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target.toLocaleString() + suffix);
    };
    requestAnimationFrame(step);
  }, [target, suffix, duration]);

  return value;
}

const STATS = [
  { target: 50000, suffix: "+", label: "Satisfied Patients", gradient: "from-brand to-brand-soft" },
  { target: 500, suffix: "+", label: "Verified Doctors", gradient: "from-brand-soft to-[#7C3AED]" },
  { target: 98, suffix: "%", label: "AI Accuracy Rate", gradient: "from-brand to-brand-soft" },
  { target: 24, suffix: "/7", label: "Live AI Support", gradient: "from-[#0E3B3A] to-brand-soft" },
];

export const TrustStripSection: React.FC = () => {
  const { ref: sectionRef, isVisible } = useIntersectionOnce(0.1);

  return (
    <section ref={sectionRef} className="py-[120px] md:py-[80px] bg-bg-mint" id="stats">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-[72px] ${isVisible ? "animate-dropDown" : "opacity-0"}`} style={isVisible ? { animationDelay: "0.1s" } : undefined}>
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
            const value = useCountUp(stat.target, stat.suffix);
            return (
              <StatItem key={index} stat={stat} value={value} index={index} isLast={index === STATS.length - 1} />
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .stat-item-reveal { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  );
};

interface StatItemProps {
  stat: typeof STATS[0];
  value: string;
  index: number;
  isLast: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ stat, value, index, isLast }) => {
  const { ref, isVisible } = useIntersectionOnce(0.5);
  return (
    <div ref={ref} className={`stat-item-reveal relative text-center py-8 px-4 md:py-5 md:px-2 ${isVisible ? "animate-scaleUp" : "opacity-0"}`} style={isVisible ? { animationDelay: `${index * 0.15}s` } : undefined}>
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
