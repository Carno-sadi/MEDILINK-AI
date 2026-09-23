import React from "react";
import { FileClock, Plus, Menu } from "lucide-react";
import { SegmentedControl } from "./SegmentedControl";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";

interface ChatHeaderProps {
  modelValue: "med1-flash" | "med1-pro";
  onModelChange: (val: "med1-flash" | "med1-pro") => void;
  onNewChat: () => void;
  onOpenHistory: () => void;
  onOpenMobileMenu?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  modelValue, 
  onModelChange, 
  onNewChat, 
  onOpenHistory,
  onOpenMobileMenu
}) => {
  const isPremium = useSubscriptionStore(s => s.isPremium());

  return (
    <div className="h-16 border-b border-border-soft bg-white px-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
      
      {/* Left: Mobile Menu + Doctor Info */}
      <div className="flex items-center gap-3">
        <button 
          className="lg:hidden w-10 h-10 flex items-center justify-center text-text-primary -ml-2 rounded-md hover:bg-bg-soft"
          onClick={onOpenMobileMenu}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold">
              Dr
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div className="text-[14px] font-bold text-text-primary leading-tight">Dr MediLink</div>
            <div className="text-[12px] text-text-muted font-medium">AI Assistant</div>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <SegmentedControl
            value={modelValue}
            onChange={(val) => onModelChange(val as "med1-flash" | "med1-pro")}
            options={[
              { label: "Flash", value: "med1-flash" },
              { label: "Pro", value: "med1-pro", disabled: !isPremium }
            ]}
          />
        </div>
        
        <button 
          onClick={onOpenHistory}
          className="w-9 h-9 flex items-center justify-center rounded-full text-text-muted hover:bg-bg-soft hover:text-text-primary transition-colors"
          aria-label="Chat history"
        >
          <FileClock className="w-5 h-5" />
        </button>

        <button 
          onClick={onNewChat}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-brand text-white hover:bg-brand-dark transition-colors shadow-sm"
          aria-label="New chat"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
