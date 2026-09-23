"use client";

import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { TrustStripSection } from "@/components/landing/TrustStripSection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { PlansSection } from "@/components/landing/PlansSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg-main overflow-x-hidden">
      <HeroSection />
      <ServicesSection />
      <TrustStripSection />
      <ReviewsSection />
      <FAQSection />
      <PlansSection />
      <FinalCTASection />
    </main>
  );
}
