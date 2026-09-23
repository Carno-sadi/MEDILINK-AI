"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useProfileStore } from "@/stores/useProfileStore";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextLink } from "@/components/ui/TextLink";

interface ChatSidebarProps {
  usageCount: number;
  maxUsage: number;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ usageCount, maxUsage }) => {
  const [mounted, setMounted] = useState(false);
  const profile = useProfileStore((s) => s.profile);
  const isPremium = useSubscriptionStore((s) => s.isPremium());
  const setPlan = useSubscriptionStore((s) => s.setPlan);
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpgrade = () => {
    setPlan("premium");
    showToast("Premium plan activated!", "success");
  };

  const activePremium = mounted && isPremium;

  return (
    <aside className="hidden lg:flex flex-col w-[320px] shrink-0 border-r border-border-soft bg-white h-[calc(100vh-72px)] sticky top-[72px] p-6 overflow-y-auto">
      {/* Profile Card */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-wider">Your Profile</h3>
          <TextLink href="/register" className="text-[13px] font-medium">Edit profile</TextLink>
        </div>
        
        <Card variant="flat" className="bg-bg-soft border-none flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shrink-0 font-bold">
            {mounted && profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </div>
          <div className="overflow-hidden">
            <div className="text-[15px] font-bold text-text-primary truncate">
              {mounted && profile?.name ? profile.name : "Guest"}
            </div>
            <div className="text-[13px] text-text-muted truncate">
              {mounted && profile?.area ? profile.area : "Area not set"}
            </div>
          </div>
        </Card>
      </div>

      {/* Usage Card */}
      <div className="mb-8">
        <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-wider mb-4">Today&apos;s Usage</h3>
        
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[13px] font-bold text-text-primary">
            {activePremium ? "Unlimited" : `${usageCount} / ${maxUsage}`}
          </div>
          <div className="text-[12px] font-bold text-accent bg-accent-soft px-2 py-0.5 rounded-full">
            {activePremium ? "Premium Plan" : "Free Plan"}
          </div>
        </div>

        {!activePremium && (
          <div className="h-2 w-full bg-bg-soft rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-brand transition-all duration-300" 
              style={{ width: `${Math.min(100, (usageCount / maxUsage) * 100)}%` }} 
            />
          </div>
        )}

        {!activePremium && (
          <Button size="s" variant="secondary" fullWidth onClick={handleUpgrade}>
            Upgrade to Premium (Free)
          </Button>
        )}
      </div>

      {/* Emergency */}
      <div className="mt-auto">
        <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-wider mb-4 text-emergency">Emergency</h3>
        <Card variant="flat" className="bg-emergency-soft border-none">
          <Button variant="emergency" fullWidth className="mb-3" onClick={() => window.open('tel:999')}>
            Call 999
          </Button>
          <div className="text-center">
            <TextLink href="/emergency" className="text-[13px] text-emergency font-bold">
              Nearby hospitals
            </TextLink>
          </div>
        </Card>
      </div>
    </aside>
  );
};
