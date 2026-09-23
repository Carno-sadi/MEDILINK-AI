"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroParticleCanvas = dynamic(() => import("./HeroParticleCanvas"), { ssr: false });
const ThreeDNAHelix = dynamic(() => import("./ThreeDNAHelix"), { ssr: false });

const TYPEWRITER_WORDS = ["Doctors", "Medicines", "AI Advice", "Health Solutions"];

export const HeroSection: React.FC = () => {
  const [displayText, setDisplayText] = useState("");
  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function typeWriter() {
      const currentWord = TYPEWRITER_WORDS[wordIndexRef.current];
      let delay = 100;

      if (isDeletingRef.current) {
        charIndexRef.current--;
        setDisplayText(currentWord.substring(0, charIndexRef.current));
        delay = 50;
      } else {
        charIndexRef.current++;
        setDisplayText(currentWord.substring(0, charIndexRef.current));
        delay = 100;
      }

      if (!isDeletingRef.current && charIndexRef.current === currentWord.length) {
        isDeletingRef.current = true;
        delay = 1800;
      } else if (isDeletingRef.current && charIndexRef.current === 0) {
        isDeletingRef.current = false;
        wordIndexRef.current = (wordIndexRef.current + 1) % TYPEWRITER_WORDS.length;
        delay = 400;
      }

      timeoutRef.current = setTimeout(typeWriter, delay);
    }

    const startTimeout = setTimeout(typeWriter, 1400);
    return () => {
      clearTimeout(startTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const scrollToBento = () => {
    const el = document.getElementById("bento-features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero-section" className="hero-section relative min-h-screen flex items-center overflow-hidden bg-bg-mint select-none">
      {/* Particle Background */}
      <HeroParticleCanvas />

      {/* DNA Container (Desktop Only) */}
      <ThreeDNAHelix />

      {/* Hero Content */}
      <div className="relative z-[3] max-w-[1280px] mx-auto px-6 w-full flex items-center min-h-screen pt-[88px] pb-16">
        <div className="max-w-[620px] lg:max-w-[620px] md:max-w-[540px]">
          {/* Badge with professional hover glow & lift */}
          <div className="group hero-badge inline-flex items-center gap-2.5 bg-brand-light/80 hover:bg-brand-light border border-brand/20 hover:border-brand/40 text-brand font-sans font-medium text-[13px] px-4 py-2 rounded-full mb-6 cursor-default transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(23,120,111,0.18)] opacity-0 -translate-y-4 animate-[badgeDrop_0.7s_cubic-bezier(0.16,1,0.3,1)_0.5s_forwards]">
            <span className="w-2 h-2 bg-success rounded-full shrink-0 animate-[pulseDot_2s_ease-in-out_infinite] group-hover:scale-125 transition-transform duration-300" />
            <span className="tracking-wide">AI-Powered Healthcare Network</span>
          </div>

          {/* H1 with interactive hover typography */}
          <h1 className="font-heading font-extrabold text-[clamp(2.2rem,4.8vw,3.65rem)] leading-[1.12] tracking-tight mb-5 opacity-0 -translate-x-10 animate-[titleSlide_0.9s_cubic-bezier(0.16,1,0.3,1)_0.6s_forwards] group cursor-default">
            <span className="text-text-primary transition-colors duration-300 group-hover:text-text-primary/90">
              We connect you to the best
            </span>
            <br />
            <span className="text-brand inline-block transition-transform duration-300 group-hover:translate-x-1">
              {displayText}
              <span className="inline text-brand-soft animate-[blinkCursor_0.8s_step-end_infinite]">|</span>
            </span>
          </h1>

          {/* Description with focus hover transition */}
          <p className="font-sans text-[17px] leading-[1.75] text-text-muted hover:text-text-primary max-w-[500px] mb-9 cursor-default transition-colors duration-300 opacity-0 translate-y-4 animate-[descFadeUp_0.7s_cubic-bezier(0.16,1,0.3,1)_0.8s_forwards]">
            Medilink AI bridges the gap between patients and world-class
            healthcare through intelligent matching, real-time availability, and
            AI-driven diagnostics.
          </p>

          {/* Action Buttons with Professional Hover Effects */}
          <div className="flex gap-4 flex-wrap opacity-0 translate-y-5 animate-[buttonsFloatUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.9s_forwards]">
            {/* Primary Button: Dr. Medilink (Shine sweep + 3D lift) */}
            <Link
              href="/chat"
              className="hero-btn-primary group relative overflow-hidden font-heading font-bold text-[15px] px-8 py-3.5 rounded-[12px] bg-brand text-white shadow-[0_4px_16px_rgba(23,120,111,0.3)] hover:bg-brand-dark hover:shadow-[0_12px_28px_-4px_rgba(23,120,111,0.45)] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <span className="relative z-10">Dr. Medilink</span>
              <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              {/* Shine sweep beam */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />
            </Link>

            {/* Outline Button: Subscription (Smooth fill + lift) */}
            <Link
              href="/register"
              className="hero-btn-outline group relative overflow-hidden font-heading font-bold text-[15px] px-8 py-3.5 rounded-[12px] bg-white/70 backdrop-blur-sm text-brand border-[1.5px] border-brand/80 hover:bg-brand hover:text-white hover:border-brand hover:shadow-[0_10px_24px_-4px_rgba(23,120,111,0.28)] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-1.5"
            >
              <span className="relative z-10">Subscription</span>
              <span className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Scroll Indicator (Clickable + Hover Pulse) */}
      <button
        onClick={scrollToBento}
        type="button"
        aria-label="Scroll to features"
        className="group absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] p-3 rounded-full hover:bg-brand/10 transition-all duration-300 hover:scale-125 cursor-pointer opacity-0 animate-[scrollFadeIn_0.6s_ease_1.4s_forwards]"
      >
        <div className="w-2.5 h-2.5 bg-brand group-hover:bg-brand-dark rounded-full animate-[bounceDot_1.6s_ease-in-out_infinite] shadow-sm" />
      </button>

      {/* Hero Animations */}
      <style jsx global>{`
        @keyframes particleFadeIn { to { opacity: 0.65; } }
        @keyframes dnaMaterialize { to { opacity: 1; transform: scale(1); } }
        @keyframes badgeDrop { to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.3); } }
        @keyframes titleSlide { to { opacity: 1; transform: translateX(0); } }
        @keyframes blinkCursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes descFadeUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes buttonsFloatUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes scrollFadeIn { to { opacity: 1; } }
        @keyframes bounceDot { 0%, 100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(10px); opacity: 0.45; } }
        
        @media (max-width: 768px) {
          .hero-section .hero-btn-primary,
          .hero-section .hero-btn-outline {
            width: 100%;
          }
          .hero-section > div:nth-child(3) {
            justify-content: center;
            text-align: center;
          }
          .hero-section > div:nth-child(3) > div {
            max-width: 100%;
          }
          .hero-section .hero-badge {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-section p {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-section > div:nth-child(3) > div > div:last-child {
            justify-content: center;
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
