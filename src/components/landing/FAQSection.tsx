"use client";

import React, { useState, useRef, useEffect } from "react";

interface FAQItemData {
  q: string;
  a: string;
  steps: string[];
}

const FAQ_ITEMS: FAQItemData[] = [
  {
    q: "How does Medilink AI work?",
    a: "Getting started is simple. Create your free Medilink AI account to unlock the full platform experience — including your personal health dashboard, AI-powered consultations with Dr. Medilink, doctor discovery, and pharmacy ordering. Registration takes under two minutes and gives you instant access to all features.",
    steps: ["Step 1 — Create Account", "Step 2 — Complete Profile", "Step 3 — Start Using"],
  },
  {
    q: "How does the Dr. Medilink AI Health Advisor work?",
    a: "Dr. Medilink is Medilink AI's intelligent health assistant, powered by advanced neural networks. After registering, simply open the Dr. Medilink chat interface and describe your symptoms or health concern. Dr. Medilink will analyze your input in real time, provide medically-informed guidance, suggest relevant specialists, and recommend next steps — available 24 hours a day, 7 days a week.",
    steps: ["Register", "Open Chat", "Ask Anything"],
  },
  {
    q: "How do I book an appointment with a doctor?",
    a: "Booking a specialist has never been easier. Navigate to the Doctors section from your dashboard, browse our network of fully verified medical specialists, and select the doctor that matches your needs. From their profile page, tap the Book via WhatsApp button — you will be connected directly to the doctor's scheduling assistant on WhatsApp to confirm your preferred time and date instantly.",
    steps: ["Go to Doctors", "Select Specialist", "Book via WhatsApp"],
  },
  {
    q: "How do I order medicines through the pharmacy?",
    a: "Ordering your prescribed medicines is straightforward. Visit the Pharmacy section, search for your required medicines, and add them to your cart. When you are ready, proceed to Checkout — choose your delivery address, confirm your order, and your medicines will be dispatched promptly. Prescription upload is also supported for controlled medications.",
    steps: ["Go to Pharmacy", "Add to Cart", "Checkout"],
  },
];

export const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const toggleItem = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="py-[80px] lg:py-[120px] bg-bg-main">
      <div className="max-w-[760px] mx-auto px-6 lg:px-0">
        {/* Section Header */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block font-sans font-medium text-[11px] tracking-[0.12em] uppercase text-brand bg-brand/10 rounded-full px-3.5 py-1 mb-4">
            Got Questions?
          </span>
          <h2 className="font-heading font-extrabold text-[clamp(32px,4.5vw,52px)] text-text-primary leading-[1.15] mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-[16px] text-text-muted">
            Everything you need to know about using Medilink AI.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isActive = activeIndex === idx;
            const hasOtherActive = activeIndex !== null && !isActive;

            return (
              <div
                key={idx}
                style={{
                  transitionDelay: `${idx * 0.08}s`,
                }}
                className={`border rounded-2xl transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isRevealed ? "translate-y-0" : "translate-y-6 opacity-0"
                } ${
                  isActive
                    ? "bg-brand/[0.04] border-brand/30 shadow-[0_8px_24px_rgba(23,120,111,0.08)] p-6 opacity-100"
                    : hasOtherActive
                    ? "bg-white border-border-soft p-5 opacity-40 hover:opacity-75"
                    : "bg-white border-border-soft p-5 opacity-100 hover:border-brand/30 hover:shadow-xs"
                }`}
              >
                {/* Header (Question + Toggle Icon) */}
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full flex justify-between items-center text-left cursor-pointer focus:outline-none group"
                  aria-expanded={isActive}
                >
                  <h3
                    className={`font-heading font-bold text-[clamp(16px,2vw,19px)] transition-colors duration-300 pr-4 ${
                      isActive
                        ? "text-brand"
                        : "text-text-primary group-hover:text-brand"
                    }`}
                  >
                    {item.q}
                  </h3>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "bg-brand text-white rotate-45 shadow-sm"
                        : "bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M7 1v12M1 7h12" />
                    </svg>
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className="grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    gridTemplateRows: isActive ? "1fr" : "0fr",
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="font-sans font-normal text-[15px] text-text-muted leading-[1.8] pt-4">
                      {item.a}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                      {item.steps.map((step, sIdx) => (
                        <span
                          key={sIdx}
                          className="font-sans font-medium text-[12px] text-brand bg-brand/10 border border-brand/15 rounded-full px-3 py-1 inline-block"
                        >
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
