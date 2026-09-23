"use client";

import React, { useRef, useEffect } from "react";

const TESTIMONIALS = [
  { name: "Rashed Karim", city: "Dhaka", stars: 5, quote: "Dr. Medilink AI identified my condition before I even saw a specialist. Truly remarkable." },
  { name: "Nusrat Jahan", city: "Chittagong", stars: 5, quote: "The WhatsApp pharmacy saved me hours of waiting. My medicines arrived in under 2 hours." },
  { name: "Tariq Hossain", city: "Sylhet", stars: 5, quote: "The health dashboard is incredibly intuitive. I check my vitals every single morning now." },
  { name: "Fatema Akter", city: "Rajshahi", stars: 5, quote: "Found a verified cardiologist in under a minute. Medilink AI is genuinely a lifesaver." },
  { name: "Imran Hasan", city: "Khulna", stars: 5, quote: "Best healthcare platform in Bangladesh. The AI health advice is accurate and reassuring." },
  { name: "Sabrina Islam", city: "Barishal", stars: 5, quote: "Booked an appointment, received a prescription, and ordered medicine — all in one place." },
  { name: "Mahmudul Alam", city: "Mymensingh", stars: 5, quote: "I was skeptical about AI health tools. Medilink AI completely changed my perspective." },
  { name: "Sumaiya Begum", city: "Comilla", stars: 5, quote: "The verified doctor badge builds real trust. A genuinely premium healthcare experience." },
];

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
}

const TestimonialCard: React.FC<{ t: typeof TESTIMONIALS[0] }> = ({ t }) => (
  <div className="testimonial-card shrink-0 w-[320px] max-md:w-[280px] bg-white border border-brand/[0.18] rounded-3xl p-7 max-md:p-[22px] shadow-[0_24px_50px_-12px_rgba(23,120,111,0.12)] hover:-translate-y-2 hover:shadow-[0_32px_64px_-12px_rgba(23,120,111,0.22)] transition-all duration-500 cursor-default"
    style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
  >
    {/* Header */}
    <div className="flex items-center gap-3.5 mb-3.5">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-soft flex items-center justify-center font-heading font-bold text-[18px] text-white shrink-0">
        {getInitials(t.name)}
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="font-heading font-bold text-[16px] text-text-primary truncate">{t.name}</div>
        <div className="font-sans text-[13px] text-text-muted">{t.city}</div>
      </div>
      <span className="inline-flex items-center gap-1 font-sans text-[11px] font-medium text-success bg-success/10 rounded-full px-2.5 py-0.5 whitespace-nowrap">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Verified Patient
      </span>
    </div>
    {/* Stars */}
    <div className="flex gap-0.5 mb-3.5 text-accent text-[13px] leading-none">
      {Array.from({ length: t.stars }).map((_, i) => <span key={i}>★</span>)}
    </div>
    {/* Quote */}
    <div className="font-sans text-[15px] text-text-muted italic leading-[1.7] border-t border-brand/10 pt-3.5 mt-3.5">
      &ldquo;{t.quote}&rdquo;
    </div>
  </div>
);

export const ReviewsSection: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("testimonial-header-visible"); obs.unobserve(e.target); } }); },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("marquee-wrapper-visible"); obs.unobserve(e.target); } }); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cards = TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} />);
  const doubledCards = [...cards, ...cards.map((c, i) => React.cloneElement(c, { key: `dup-${i}` }))];

  return (
    <section className="py-[120px] md:py-[80px] bg-bg-soft overflow-hidden" id="testimonials">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 testimonial-header-reveal">
          <div className="w-[60px] h-[3px] rounded-full bg-gradient-to-r from-brand to-brand-soft mx-auto mb-7" />
          <span className="inline-block font-sans font-medium text-[11px] tracking-[0.12em] uppercase text-brand bg-brand/10 rounded-full px-3.5 py-1 mb-5">Patient Stories</span>
          <h2 className="font-heading font-extrabold text-[clamp(32px,4.5vw,52px)] text-text-primary leading-[1.15] mb-3.5">
            Trusted by Thousands
          </h2>
          <p className="font-sans text-[16px] text-text-muted leading-[1.75] max-w-[520px] mx-auto">
            Real experiences from real patients across Bangladesh.
          </p>
        </div>
      </div>

      {/* Marquee Wrapper */}
      <div ref={wrapperRef} className="marquee-wrapper-reveal relative w-screen overflow-hidden" style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}>
        {/* Row 1 — Scrolls Left */}
        <div className="marquee-track marquee-left flex gap-5 w-max hover:[animation-play-state:paused]">
          {doubledCards}
        </div>

        <div className="h-5" />

        {/* Row 2 — Scrolls Right */}
        <div className="marquee-track marquee-right flex gap-5 w-max hover:[animation-play-state:paused]">
          {doubledCards}
        </div>
      </div>

      <style jsx global>{`
        .testimonial-header-reveal > * { opacity: 0; transform: translateY(24px); filter: blur(2px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.7s cubic-bezier(0.16,1,0.3,1); }
        .testimonial-header-visible > *:nth-child(1) { transition-delay: 0s; }
        .testimonial-header-visible > *:nth-child(2) { transition-delay: 0.12s; }
        .testimonial-header-visible > *:nth-child(3) { transition-delay: 0.24s; }
        .testimonial-header-visible > *:nth-child(4) { transition-delay: 0.36s; }
        .testimonial-header-visible > * { opacity: 1 !important; transform: translateY(0) !important; filter: blur(0) !important; }
        .marquee-wrapper-reveal { opacity: 0; transform: scale(0.88) translateY(20px); filter: blur(4px); transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1), filter 1s cubic-bezier(0.16,1,0.3,1); }
        .marquee-wrapper-visible { opacity: 1 !important; transform: scale(1) translateY(0) !important; filter: blur(0) !important; }
        .marquee-left { animation: marqueeLeft 38s linear infinite; }
        .marquee-right { animation: marqueeRight 38s linear infinite; }
        @keyframes marqueeLeft { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        @keyframes marqueeRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }
        @media (max-width: 767px) {
          .marquee-wrapper-reveal { mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%) !important; -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%) !important; }
        }
      `}</style>
    </section>
  );
};

export default ReviewsSection;
