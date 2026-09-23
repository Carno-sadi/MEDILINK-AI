"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useIntersectionOnce } from "@/lib/useIntersection";
import { createWhatsAppUrl } from "@/lib/whatsapp";

import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { useToast } from "@/components/ui/Toast";

export const PlansSection: React.FC = () => {
  const router = useRouter();
  const { ref, isVisible } = useIntersectionOnce();
  const [mounted, setMounted] = useState(false);

  const setPlan = useSubscriptionStore((s) => s.setPlan);
  const isPremium = useSubscriptionStore((s) => s.isPremium());
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const freeFeatures = [
    { text: "2 AI chats per day", included: true },
    { text: "60 AI requests per month", included: true },
    { text: "Basic medicine search", included: true },
    { text: "Doctor listings", included: true },
    { text: "Emergency SOS", included: true },
    { text: "WhatsApp ordering", included: true },
  ];

  const premiumFeatures = [
    { text: "Unlimited AI access (fair use)", included: true },
    { text: "Med-1 Pro detailed answers", included: true },
    { text: "Med-1 Flash quick answers", included: true },
    { text: "Full smart search & suggestions", included: true },
    { text: "20% pharmacy discount", included: true },
    { text: "20% doctor fee discount", included: true },
    { text: "Ultra-high priority booking", included: true },
    { text: "Full chat history & PDF export", included: true },
  ];

  const handleGetPremium = () => {
    setPlan("premium");
    showToast("Premium plan activated!", "success");
  };

  return (
    <section className="py-16 md:py-24 bg-white" ref={ref}>
       <div
         className={`max-w-[1200px] mx-auto px-4 md:px-8 transition-opacity duration-700 ${
           isVisible ? "opacity-100 animate-bounceUp" : "opacity-0"
         }`}
         style={isVisible ? { animationDelay: "0.1s" } : undefined}
       >
         <div className="text-center mb-12 md:mb-16">
           <h2 className="text-[32px] md:text-[40px] font-heading font-bold text-text-primary mb-4">
             Choose Your Plan
          </h2>
          <p className="text-[18px] text-text-muted max-w-2xl mx-auto">
            Get more AI guidance, discounts, and priority bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
          {/* Free Plan */}
          <div className="rounded-[16px] border border-border-soft p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-[20px] font-bold text-text-primary mb-2">
                Free
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[40px] font-heading font-extrabold text-text-primary">
                  ৳0
                </span>
                <span className="text-[15px] text-text-muted">/month</span>
              </div>
              <p className="text-[14px] text-text-muted">
                Perfect for getting started.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {freeFeatures.map((f) => (
                <li key={f.text} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <span className="text-[14px] text-text-primary">
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              variant="ghost"
              size="l"
              className="w-full"
              onClick={() => router.push("/register")}
            >
              Start Free
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="rounded-[16px] border-2 border-brand p-8 flex flex-col relative shadow-lg">
            <div className="absolute -top-3 right-6">
              <Badge variant="warn">Best Value</Badge>
            </div>

            <div className="mb-6">
              <h3 className="text-[20px] font-bold text-text-primary mb-2">
                MediLink Premium
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[40px] font-heading font-extrabold text-brand">
                  ৳500
                </span>
                <span className="text-[15px] text-text-muted">/month</span>
              </div>
              <p className="text-[14px] text-text-muted">
                Complete personalized healthcare.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {premiumFeatures.map((f) => (
                <li key={f.text} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <span className="text-[14px] text-text-primary">
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              size="l"
              className="w-full"
              onClick={handleGetPremium}
              variant={mounted && isPremium ? "secondary" : "primary"}
            >
              {mounted && isPremium ? "Premium Active ✓" : "Get Premium"}
            </Button>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-[14px] text-text-muted mt-8 max-w-xl mx-auto">
          Emergency SOS and basic services are always free for everyone — no
          registration required.
        </p>
      </div>
    </section>
  );
};
