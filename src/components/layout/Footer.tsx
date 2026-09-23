"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const footerRef = useRef<HTMLElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyrightRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    colRefs.current.forEach((col) => {
      if (col) observer.observe(col);
    });
    if (copyrightRef.current) observer.observe(copyrightRef.current);
    if (giantRef.current) observer.observe(giantRef.current);

    return () => observer.disconnect();
  }, [pathname]);

  // Completely remove Footer on /chat, /emergency, and /register
  if (
    pathname.startsWith("/chat") ||
    pathname.startsWith("/emergency") ||
    pathname.startsWith("/register")
  ) {
    return null;
  }

  return (
    <footer id="site-footer" ref={footerRef} className="w-full overflow-hidden bg-bg-main">
      {/* ═══════════════════════════════════════════════
          LAYER 1 — Top Content Strip (4-column balanced grid)
          ═══════════════════════════════════════════════ */}
      <div className="footer-layer-1 border-t border-brand/12 py-16 px-[6%] max-lg:py-12">
        <div className="footer-grid max-w-[1400px] mx-auto grid grid-cols-[2fr_1fr_1fr_1.3fr] max-lg:grid-cols-2 max-sm:grid-cols-1 gap-12 max-lg:gap-10">
          {/* Column 1: Brand Identity */}
          <div
            ref={(el) => {
              colRefs.current[0] = el;
            }}
            className="footer-column footer-reveal-col"
            style={{ "--delay": "0s" } as React.CSSProperties}
          >
            <Link href="/" className="group inline-flex items-center gap-3 mb-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-xs">
                <span className="font-heading font-extrabold text-white text-base">M</span>
              </div>
              <div className="font-heading font-extrabold text-[22px] text-text-primary tracking-tight transition-colors duration-300 group-hover:text-brand">
                Medi<span className="text-brand">link</span> AI
              </div>
            </Link>
            <p className="font-sans font-normal text-[14px] text-text-muted leading-relaxed mb-6">
              Your Intelligent Health Partner
            </p>

            {/* Social Icons Row with Hover Glow */}
            <div className="flex gap-3" aria-label="Social media links">
              <a
                href="https://www.facebook.com/profile.php?id=61587520773135"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all duration-300 hover:scale-115 hover:shadow-[0_4px_16px_rgba(23,120,111,0.35)]"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/sylhetroboticsclub?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all duration-300 hover:scale-115 hover:shadow-[0_4px_16px_rgba(23,120,111,0.35)]"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div
            ref={(el) => {
              colRefs.current[1] = el;
            }}
            className="footer-column footer-reveal-col"
            style={{ "--delay": "0.08s" } as React.CSSProperties}
          >
            <h3 className="font-heading font-bold text-[13px] tracking-[0.08em] uppercase text-text-primary mb-5">
              Platform
            </h3>
            <nav className="flex flex-col gap-3" aria-label="Platform navigation">
              {[
                { href: "/", label: "Home" },
                { href: "/doctors", label: "Find a Doctor" },
                { href: "/chat", label: "AI Health Advisor" },
                { href: "/pharmacy", label: "Pharmacy" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="group flex items-center gap-1.5 font-sans text-[15px] text-text-muted hover:text-brand transition-all duration-300 hover:translate-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Company */}
          <div
            ref={(el) => {
              colRefs.current[2] = el;
            }}
            className="footer-column footer-reveal-col"
            style={{ "--delay": "0.16s" } as React.CSSProperties}
          >
            <h3 className="font-heading font-bold text-[13px] tracking-[0.08em] uppercase text-text-primary mb-5">
              Company
            </h3>
            <nav className="flex flex-col gap-3" aria-label="Company navigation">
              {[
                { href: "/about", label: "About Us" },
                { href: "/about#team-section", label: "Meet the Team" },
                { href: "/contact", label: "Contact Us" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="group flex items-center gap-1.5 font-sans text-[15px] text-text-muted hover:text-brand transition-all duration-300 hover:translate-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Contact with Interactive Hover Pills */}
          <div
            ref={(el) => {
              colRefs.current[3] = el;
            }}
            className="footer-column footer-reveal-col"
            style={{ "--delay": "0.24s" } as React.CSSProperties}
          >
            <h3 className="font-heading font-bold text-[13px] tracking-[0.08em] uppercase text-text-primary mb-5">
              Get in Touch
            </h3>

            <div className="flex flex-col gap-2.5">
              {/* WhatsApp Link */}
              <a
                href="https://wa.me/8801811389672"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 -mx-2 px-2.5 py-1.5 rounded-xl font-sans text-[15px] text-whatsapp font-medium hover:bg-whatsapp/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-whatsapp/10 group-hover:bg-whatsapp text-whatsapp group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <span>+880 1811-389672</span>
              </a>

              {/* Email Link */}
              <a
                href="mailto:medilink123@gmail.com"
                className="group flex items-center gap-2.5 -mx-2 px-2.5 py-1.5 rounded-xl font-sans text-[15px] text-text-muted hover:text-brand hover:bg-brand/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-brand/10 group-hover:bg-brand text-brand group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span className="truncate">medilink123@gmail.com</span>
              </a>

              {/* Emergency Link */}
              <a
                href="tel:999"
                className="group flex items-center gap-2.5 -mx-2 px-2.5 py-1.5 rounded-xl font-sans text-[15px] text-emergency font-bold hover:bg-emergency/10 hover:text-emergency-dark transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emergency/10 group-hover:bg-emergency text-emergency group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <span>Emergency: 999</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          LAYER 2 — Bottom Copyright Bar
          ═══════════════════════════════════════════════ */}
      <div
        ref={copyrightRef}
        className="footer-layer-2 border-t border-brand/12 py-5 px-[6%] bg-bg-main transition-opacity duration-700 opacity-0 [&.is-visible]:opacity-100"
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="font-sans font-normal text-[13px] text-text-muted hover:text-text-primary transition-colors duration-300 cursor-default">
            Disclaimer: Medilink AI is an assistive technology, not a substitute
            for professional medical advice. Always consult a doctor in
            emergencies. Built with ❤️ by Sylhet Robotics Club. | © 2026 Medilink
            AI.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          LAYER 3 — Oversized Architectural Typography
          ═══════════════════════════════════════════════ */}
      <div className="footer-layer-3 bg-bg-main w-full overflow-hidden pt-5 pb-0 select-none">
        <div
          ref={giantRef}
          className="giant-text-watermark cursor-pointer"
          aria-hidden="true"
        >
          MEDILINK AI
        </div>
      </div>

      <style jsx>{`
        .footer-reveal-col {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s),
            transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s);
        }
        .footer-reveal-col.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .giant-text-watermark {
          font-family: var(--font-head), Montserrat, sans-serif;
          font-weight: 800;
          font-size: clamp(80px, 16vw, 200px);
          color: #d1fae5;
          letter-spacing: 8px;
          line-height: 0.85;
          text-align: center;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s,
            transform 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s,
            letter-spacing 1.8s cubic-bezier(0.16, 1, 0.3, 1),
            color 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .giant-text-watermark.is-visible {
          opacity: 1;
          transform: translateY(0);
          letter-spacing: -6px;
        }

        .giant-text-watermark:hover {
          color: #a7f3d0;
          letter-spacing: -2px;
        }

        @media (max-width: 640px) {
          .giant-text-watermark {
            letter-spacing: -2px;
          }
          .giant-text-watermark.is-visible {
            letter-spacing: -2px;
          }
          .giant-text-watermark:hover {
            letter-spacing: -1px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
