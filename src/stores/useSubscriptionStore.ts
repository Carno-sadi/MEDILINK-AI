import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PlanType } from "@/types";

interface SubscriptionState {
  plan: PlanType;
  activatedAt?: string;
  setPlan: (plan: PlanType) => void;
  toggleDemoPlan: () => void;
  isPremium: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plan: "free",
      activatedAt: undefined,
      setPlan: (plan: PlanType) =>
        set({
          plan,
          activatedAt: plan === "premium" ? new Date().toISOString() : undefined,
        }),
      toggleDemoPlan: () => {
        const current = get().plan;
        const next = current === "free" ? "premium" : "free";
        set({
          plan: next,
          activatedAt: next === "premium" ? new Date().toISOString() : undefined,
        });
      },
      isPremium: () => get().plan === "premium",
    }),
    {
      name: "medilink_subscription",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
