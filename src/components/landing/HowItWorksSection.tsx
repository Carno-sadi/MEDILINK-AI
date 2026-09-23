"use client";

import React from "react";
import { MessageSquare, CalendarCheck, HeartPulse } from "lucide-react";
import { useIntersectionOnce } from "@/lib/useIntersection";

export const HowItWorksSection: React.FC = () => {
  const { ref, isVisible } = useIntersectionOnce();

  const steps = [
    {
      num: "01",
      title: "Chat with AI",
      desc: "Describe your symptoms to Dr MediLink for instant, reliable guidance.",
      icon: MessageSquare,
    },
    {
      num: "02",
      title: "Get Recommendations",
      desc: "Receive medicine suggestions or a list of relevant specialists.",
      icon: HeartPulse,
    },
    {
      num: "03",
      title: "Take Action",
      desc: "Order medicines directly via WhatsApp or book a doctor appointment.",
      icon: CalendarCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white" ref={ref}>
       <div className={`max-w-[1200px] mx-auto px-4 md:px-8 transition-opacity duration-700 ${
         isVisible ? "opacity-100 animate-slideUp" : "opacity-0"
       }`} style={isVisible ? { animationDelay: "0.1s" } : undefined}>
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-heading font-bold text-text-primary mb-4">
            How it works
          </h2>
          <p className="text-[18px] text-text-muted max-w-2xl mx-auto">
            From symptom to solution in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Desktop Connector Line */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-border-soft -z-10" />

          {steps.map((step, idx) => (
            <div key={step.num} className={`flex flex-col items-center text-center relative ${isVisible ? "animate-slideUp" : "opacity-0"}`} style={isVisible ? { animationDelay: `${0.2 + idx * 0.2}s` } : undefined}>
              <div className="w-[88px] h-[88px] rounded-full bg-white border-[4px] border-bg-soft flex items-center justify-center mb-6 shadow-sm">
                <div className="w-[64px] h-[64px] rounded-full bg-brand-light flex items-center justify-center text-brand">
                  <step.icon className="w-8 h-8" />
                </div>
              </div>
              
              <div className="text-[14px] font-bold text-brand mb-2">Step {step.num}</div>
              <h3 className="text-[22px] font-bold text-text-primary mb-3">{step.title}</h3>
              <p className="text-[15px] text-text-muted leading-relaxed max-w-[280px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
