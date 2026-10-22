"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Siren, User, Sparkles, Crown } from "lucide-react";
import { useProfileStore } from "@/stores/useProfileStore";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { Badge } from "@/components/ui/Badge";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isRegistered = useProfileStore((s) => s.isRegistered());
  const profile = useProfileStore((s) => s.profile);
  const isPremium = useSubscriptionStore((s) => s.isPremium());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      // Totally transparent at the top intro section; blurry as soon as user starts scrolling
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // The CSS arrival runs from first paint. Mark the end of the sequence so
    // the hero knows whether it is arriving with the navbar (first load) or
    // after a client-side navigation (navbar already settled).
    const navArrivalTimer = window.setTimeout(() => {
      document.documentElement.dataset.navArrived = "true";
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(navArrivalTimer);
    };
  }, []);

  const navLinks = [
    { href: "/chat", label: "Chat" },
    { href: "/pharmacy", label: "Pharmacy" },
    { href: "/doctors", label: "Doctors" },
    { href: "/about", label: "About" },
  ];

  const isHomePage = pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? "h-16 bg-white/95 border-b border-brand/15 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]"
          : isHomePage
          ? "h-[76px] bg-white/95 border-b border-transparent shadow-none"
          : "h-[76px] bg-white/95 border-b border-border-soft shadow-xs"
      }`}
    >
      {/* Navbar surface arrival — decorative layer, the header keeps its
          solid fallback background so navigation is never invisible. */}
      <span aria-hidden className="nav-surface pointer-events-none absolute inset-0" />

      <div className="relative z-10 max-w-[1240px] mx-auto h-full px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          style={{ animationDelay: "0.07s" }}
          className="nav-logo nav-enter-left group flex items-center gap-2 font-heading font-extrabold text-[22px] text-text-primary tracking-tight focus-visible:outline-brand rounded-md"
        >
          <span className="transition-transform duration-300 group-hover:scale-105 inline-block">
            Medi<span className="text-brand">Link</span> AI
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map((link, idx) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ animationDelay: `${(0.15 + idx * 0.07).toFixed(2)}s` }}
                className={`nav-item nav-enter-up relative py-1 text-[15px] font-semibold transition-all duration-300 focus-visible:outline-brand rounded-sm group ${
                  active ? "text-brand" : "text-text-muted hover:text-text-primary"
                }`}
              >
                <span className="relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5 inline-block">
                  {link.label}
                </span>
                {/* Expanding animated underline */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-brand rounded-full transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* SOS Trigger with pulsing hover effect */}
          <Link
            href="/emergency"
            aria-label="Emergency SOS"
            style={{ animationDelay: "0.43s" }}
            className="nav-enter-right group relative flex items-center justify-center w-10 h-10 rounded-full bg-emergency-soft text-emergency border border-emergency/20 hover:bg-emergency hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_16px_rgba(217,45,32,0.3)] focus-visible:outline-emergency"
          >
            <Siren className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute inset-0 rounded-full border border-emergency/40 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" />
          </Link>

          {/* Mobile Register */}
          <Link
            href="/register"
            style={{ animationDelay: "0.43s" }}
            className="nav-enter-right sm:hidden text-[14px] font-semibold text-brand hover:underline"
          >
            Register
          </Link>

          {/* Mobile Premium Indicator */}
          {mounted && isPremium && (
            <Link
              href="/subscription"
              aria-label="Manage Premium subscription"
              style={{ animationDelay: "0.43s" }}
              className="nav-enter-right sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-accent-soft text-accent border border-accent/30"
            >
              <Crown className="w-5 h-5" />
            </Link>
          )}

          {/* Desktop Auth / Subscription */}
          <div
            style={{ animationDelay: "0.5s" }}
            className="nav-enter-right hidden sm:flex items-center gap-3 border-l border-brand/15 pl-4 min-w-[140px] justify-end"
          >
            {!mounted ? (
              <Link
                href="/register"
                className="text-[14px] font-semibold text-brand hover:underline"
              >
                Profile
              </Link>
            ) : isRegistered ? (
              <Link
                href="/register"
                className="group flex items-center gap-2 py-1 px-2.5 rounded-full hover:bg-brand-light/60 transition-all duration-300 text-[14px] font-semibold text-text-primary hover:text-brand focus-visible:outline-brand"
              >
                <div className="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center font-bold text-sm shadow-xs transition-transform duration-300 group-hover:scale-105">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <span className="max-w-[100px] truncate">{profile?.name}</span>
              </Link>
            ) : (
              <Link
                href="/register"
                className="relative overflow-hidden px-4 py-2 rounded-lg bg-brand text-white font-heading font-semibold text-[13px] shadow-[0_2px_8px_rgba(23,120,111,0.25)] hover:bg-brand-dark hover:shadow-[0_4px_16px_rgba(23,120,111,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
              >
                <span className="relative z-10">Register</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </Link>
            )}

            {mounted && (
              !isPremium ? (
                <Link
                  href="/subscription"
                  className="group relative overflow-hidden px-3 py-1.5 rounded-full bg-accent-soft text-accent border border-accent/30 text-[12px] font-bold hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_2px_12px_rgba(245,158,11,0.3)] flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Get Premium</span>
                </Link>
              ) : (
                <Link
                  href="/subscription"
                  aria-label="Manage Premium subscription"
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <Badge variant="warn">Premium</Badge>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
