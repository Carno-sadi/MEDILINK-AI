"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Stethoscope, Pill, Siren, FileText, ArrowRight, Check, Sparkles, ShieldCheck } from "lucide-react";
import { useIntersectionOnce } from "@/lib/useIntersection";

// ── Particle Canvas for Dr. Medilink Master Card ──
const CardParticleCanvas: React.FC<{ cardRef: React.RefObject<HTMLDivElement | null> }> = ({ cardRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 1);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    for (let i = 0; i < 10; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.5 + 1,
      });
    }

    let isVisible = true;
    document.addEventListener("visibilitychange", () => {
      isVisible = !document.hidden;
      if (isVisible) animate();
    });

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(23, 120, 111, 0.4)";
        ctx.fill();
      }
      if (isVisible) animIdRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", () => { animate(); });

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("resize", () => {});
    };
  }, [cardRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[1] opacity-40 pointer-events-none"
    />
  );
};

// ── 3D Tilt Card Wrapper Component ──
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  maxTilt?: number;
  style?: React.CSSProperties;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = "", cardRef: externalRef, maxTilt = 8, style }) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const cardRef = externalRef || internalRef;
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.16,
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    setGlarePos((p) => ({ ...p, opacity: 0 }));
  };

  return (
    <div
      ref={(el) => {
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (externalRef) {
          (externalRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
       className={`group relative rounded-3xl bg-white border border-brand/15 shadow-[0_16px_40px_-12px_rgba(23,120,111,0.12)] hover:shadow-[0_24px_54px_-10px_rgba(23,120,111,0.22)] p-7 md:p-8 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col justify-between ${className}`}
       style={{ transformStyle: "preserve-3d", ...style }}
     >
      {/* Glare spotlight reflection */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(23, 120, 111, ${glarePos.opacity}), transparent 65%)`,
        }}
      />
      <div className="relative z-[2] flex flex-col h-full justify-between w-full" style={{ transform: "translateZ(26px)" }}>
        {children}
      </div>
    </div>
  );
};

export const ServicesSection: React.FC = () => {
  const masterCardRef = useRef<HTMLDivElement>(null);
  const { ref, isVisible } = useIntersectionOnce();

  return (
    <section className="py-[100px] bg-bg-mint" id="bento-features">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block font-sans font-medium text-[11px] tracking-[0.12em] uppercase text-brand bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5 mb-4">
            Platform Services
          </span>
          <h2 className="font-heading font-extrabold text-[clamp(34px,5vw,56px)] leading-[1.12] bg-gradient-to-br from-brand via-brand-dark to-brand-soft bg-clip-text text-transparent">
            Healthcare, Reimagined
          </h2>
          <p className="font-sans text-[16px] text-text-muted max-w-[560px] mx-auto mt-3.5 leading-relaxed">
            Our comprehensive digital healthcare platform combines state-of-the-art neural AI with verified doctors, rapid prescription pharmacy, and immediate emergency SOS.
          </p>
        </div>

         {/* Bento Grid */}
         <div ref={ref} className="grid grid-cols-12 gap-7">
            {/* CARD 1: DR. MEDILINK AI CARE */}
           <TiltCard
             cardRef={masterCardRef}
             maxTilt={5}
             className={`col-span-12 ${isVisible ? "animate-slideUp" : "opacity-0"}`}
             style={isVisible ? { animationDelay: "0.1s" } : undefined}
           >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand via-brand-soft to-accent z-[2]" />
            <CardParticleCanvas cardRef={masterCardRef} />

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center justify-between">
              {/* Left Column (Main Information) */}
              <div className="flex-1 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="inline-flex items-center gap-1.5 font-sans font-bold text-[11px] tracking-wider uppercase text-white bg-gradient-to-r from-brand to-brand-dark px-3 py-1 rounded-full shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    Our Core AI Service
                  </span>
                  <span className="inline-flex items-center gap-1 font-sans font-semibold text-[11px] text-brand bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-full">
                    24/7 Neural Intelligence
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-[clamp(26px,3.2vw,38px)] text-text-primary leading-[1.18] mb-3.5">
                  Dr. Medilink — Intelligent AI Health Advisor
                </h3>

                <p className="font-sans text-[15px] md:text-[16px] text-text-muted leading-relaxed mb-6">
                  Dr. Medilink is our primary clinical intelligence system, trained to understand symptoms, analyze medical context, and guide patients before they consult specialists. Experience instant, reliable triage with high diagnostic accuracy and zero waiting time.
                </p>

                {/* Feature Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                  {[
                    "Instant Symptom Triage & Guidance",
                    "Dual-Layer Model (Primary + Backup Fallback)",
                    "Prescription & Lab Report Explanations",
                    "Client-Side Privacy & Encryption",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[14px] text-text-primary font-medium">
                      <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Action */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 font-heading font-bold text-[15px] px-7 py-3 rounded-xl bg-brand text-white shadow-md hover:bg-brand-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span>Consult Dr. Medilink Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <span className="text-[13px] text-text-muted font-medium">
                    ⚡ Free & instant · No appointment required
                  </span>
                </div>
              </div>

              {/* Right Column (Live Scorecard & Diagnostic Preview) */}
              <div className="w-full lg:w-[380px] bg-bg-mint/80 border border-brand/20 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-brand/10 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-[15px] text-text-primary">
                        Clinical AI Engine
                      </div>
                      <div className="text-[11px] text-brand font-medium">Active & Online</div>
                    </div>
                  </div>
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-brand/10">
                    <div className="font-heading font-extrabold text-[18px] text-brand leading-none mb-1">98.7%</div>
                    <div className="text-[10px] text-text-muted font-medium">Accuracy</div>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-brand/10">
                    <div className="font-heading font-extrabold text-[18px] text-brand leading-none mb-1">&lt;2s</div>
                    <div className="text-[10px] text-text-muted font-medium">Response</div>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-brand/10">
                    <div className="font-heading font-extrabold text-[18px] text-brand leading-none mb-1">50K+</div>
                    <div className="text-[10px] text-text-muted font-medium">Queries</div>
                  </div>
                </div>

                {/* Common Triage Questions */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Sample Clinical Inquiries:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Fever & Headache", "High Blood Pressure", "Pediatric Cough", "Medication Dosage"].map((chip, i) => (
                      <span key={i} className="text-[11px] bg-white text-text-primary px-2.5 py-1 rounded-md border border-brand/10 font-medium shadow-2xs">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>

           {/* ══════════════════════════════════════════════════════════════════════
               CARD 2: FIND YOUR DOCTOR (6 columns)
               ══════════════════════════════════════════════════════════════════════ */}
           <TiltCard className={`col-span-12 md:col-span-6 min-h-[360px] ${isVisible ? "animate-slideLeft" : "opacity-0"}`} style={isVisible ? { animationDelay: "0.25s" } : undefined}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-sans font-medium text-[11px] tracking-wider uppercase text-brand bg-brand/10 rounded-full px-3 py-1">
                  Specialist Network
                </span>
                <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-heading font-bold text-[22px] text-text-primary mb-2.5">
                Find Your Specialist
              </h3>
              <p className="font-sans text-[14px] text-text-muted leading-relaxed mb-5">
                Locate and book certified doctors across Dhaka, Chittagong, Sylhet, and Comilla with verified credentials and direct WhatsApp scheduling.
              </p>

              {/* Interactive Search Mockup */}
              <div className="p-3 bg-bg-soft/70 border border-brand/15 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-[13px] text-text-muted/70 mb-2.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                  <span>Search by specialty or chamber...</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-white text-brand text-[11px] font-semibold rounded-full border border-brand/20 shadow-xs">Cardiologist</span>
                  <span className="px-2.5 py-1 bg-white text-brand text-[11px] font-semibold rounded-full border border-brand/20 shadow-xs">Neurologist</span>
                  <span className="px-2.5 py-1 bg-white text-brand text-[11px] font-semibold rounded-full border border-brand/20 shadow-xs">Gynecologist</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-brand/10 pt-4 mt-auto">
              <div className="text-[12px] font-semibold text-text-muted">
                500+ Verified Doctors
              </div>
              <Link href="/doctors" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand hover:text-brand-dark transition-colors">
                <span>Browse Network</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </TiltCard>

           {/* ══════════════════════════════════════════════════════════════════════
               CARD 3: WHATSAPP PHARMACY (6 columns)
               ══════════════════════════════════════════════════════════════════════ */}
           <TiltCard className={`col-span-12 md:col-span-6 min-h-[360px] ${isVisible ? "animate-slideRight" : "opacity-0"}`} style={isVisible ? { animationDelay: "0.35s" } : undefined}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-sans font-medium text-[11px] tracking-wider uppercase text-whatsapp bg-whatsapp/10 rounded-full px-3 py-1">
                  Express Delivery
                </span>
                <div className="w-10 h-10 rounded-2xl bg-whatsapp/10 text-whatsapp flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-heading font-bold text-[22px] text-text-primary mb-2.5">
                WhatsApp Pharmacy
              </h3>
              <p className="font-sans text-[14px] text-text-muted leading-relaxed mb-5">
                Upload your prescription directly or browse our medicine inventory. Verified pharmaceuticals dispatched straight to your door in under 2 hours.
              </p>

              {/* WhatsApp Floating Visual with Ripple */}
              <div className="relative flex items-center justify-center h-20 my-2">
                <div className="absolute w-12 h-12 rounded-full border border-whatsapp/30 animate-[rippleExpand_2s_ease-out_infinite]" />
                <div className="absolute w-12 h-12 rounded-full border border-whatsapp/20 animate-[rippleExpand_2s_ease-out_infinite_0.6s]" />
                <div className="relative z-10 w-12 h-12 rounded-full bg-whatsapp text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-brand/10 pt-4 mt-auto">
              <div className="text-[12px] font-semibold text-whatsapp">
                Under 2 Hours Delivery
              </div>
              <Link href="/pharmacy" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-whatsapp hover:text-whatsapp/80 transition-colors">
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </TiltCard>

           {/* ══════════════════════════════════════════════════════════════════════
               CARD 4: EMERGENCY SOS & 999 (6 columns)
               ══════════════════════════════════════════════════════════════════════ */}
           <TiltCard className={`col-span-12 md:col-span-6 min-h-[360px] ${isVisible ? "animate-slideUp" : "opacity-0"}`} style={isVisible ? { animationDelay: "0.45s" } : undefined}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-sans font-medium text-[11px] tracking-wider uppercase text-emergency bg-emergency/10 rounded-full px-3 py-1">
                  Critical Response
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emergency/10 text-emergency flex items-center justify-center">
                  <Siren className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-heading font-bold text-[22px] text-text-primary mb-2.5">
                Emergency SOS & 999
              </h3>
              <p className="font-sans text-[14px] text-text-muted leading-relaxed mb-4">
                One-tap emergency broadcast that dispatches your real-time GPS coordinates to 999, trusted contacts, and connects with nearby emergency hospitals.
              </p>

              <div className="space-y-2 mb-6">
                {["One-Touch 999 Integration", "Live GPS Location Sharing", "Nearest Hospital Route Finder"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[13px] text-text-muted">
                    <Check className="w-4 h-4 text-emergency shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-brand/10 pt-4 mt-auto">
              <div className="text-[12px] font-semibold text-emergency">
                Instant Dispatch · 0s Delay
              </div>
              <Link href="/emergency" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-emergency hover:text-emergency/80 transition-colors">
                <span>View SOS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </TiltCard>

           {/* ══════════════════════════════════════════════════════════════════════
               CARD 5: PERSONAL HEALTH RECORDS (PRIVATE & ENCRYPTED) (6 columns)
               ══════════════════════════════════════════════════════════════════════ */}
           <TiltCard className={`col-span-12 md:col-span-6 min-h-[360px] ${isVisible ? "animate-scaleUp" : "opacity-0"}`} style={isVisible ? { animationDelay: "0.55s" } : undefined}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-sans font-medium text-[11px] tracking-wider uppercase text-brand bg-brand/10 rounded-full px-3 py-1">
                  Private & Encrypted
                </span>
                <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <h3 className="font-heading font-bold text-[22px] text-text-primary mb-2.5">
                Personal Health Records
              </h3>
              <p className="font-sans text-[14px] text-text-muted leading-relaxed mb-4">
                Keep past prescriptions, blood test reports, and doctor consultation notes securely organized in your on-device health record vault.
              </p>

              <div className="p-3 bg-bg-soft/70 border border-brand/15 rounded-xl space-y-1.5 mb-4">
                <div className="flex justify-between text-[12px]">
                  <span className="text-text-muted font-medium">Data Storage:</span>
                  <span className="text-brand font-bold">100% Client-Side</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-text-muted font-medium">Export Format:</span>
                  <span className="text-brand font-bold">PDF & Digital Share</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-text-muted font-medium">Cloud Server Logging:</span>
                  <span className="text-success font-bold">None (Zero-Log)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-brand/10 pt-4 mt-auto">
              <div className="text-[12px] font-semibold text-brand">
                Zero Cloud Tracking
              </div>
              <Link href="/register" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand hover:text-brand-dark transition-colors">
                <span>View Records</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </TiltCard>
        </div>
      </div>

      <style jsx global>{`
        @keyframes rippleExpand {
          0% {
            width: 48px;
            height: 48px;
            opacity: 0.8;
            transform: scale(0.8);
          }
          100% {
            width: 120px;
            height: 120px;
            opacity: 0;
            transform: scale(1.3);
          }
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;
