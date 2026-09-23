"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Pill, Stethoscope, Siren } from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/pharmacy", label: "Pharmacy", icon: Pill },
    { href: "/doctors", label: "Doctors", icon: Stethoscope },
    { href: "/emergency", label: "SOS", icon: Siren, isEmergency: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[40] bg-white border-t border-border-soft pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          if (item.isEmergency) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center w-full h-full gap-1 text-emergency hover:bg-emergency-soft transition-colors"
                aria-label={item.label}
              >
                <div className="w-8 h-8 rounded-full bg-emergency-soft flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-emergency" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? "text-brand" : "text-text-muted hover:text-text-primary"
              }`}
            >
              <item.icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[11px] ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
