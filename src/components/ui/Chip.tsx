import React from "react";
import { X } from "lucide-react";

export interface ChipProps {
  label: string;
  active?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  removable = false,
  onRemove,
  onClick,
  disabled = false,
  className = "",
  icon,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center h-9 px-3.5 rounded-full border-[1.5px] text-[13px] font-semibold transition-all duration-160 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed ${
        active
          ? "bg-brand border-brand text-white shadow-sm hover:bg-brand-dark hover:border-brand-dark"
          : "bg-white border-border text-text-muted hover:border-brand-soft hover:text-text-primary"
      } ${removable ? "pr-2 gap-1.5" : "gap-1.5"} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {removable && (
        <span
          role="button"
          tabIndex={0}
          aria-label={`Remove ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              e.preventDefault();
              if (onRemove) onRemove();
            }
          }}
          className={`p-0.5 rounded-full hover:bg-black/10 focus:outline-none transition-colors ${
            active ? "text-white/80 hover:text-white" : "text-text-muted hover:text-text-primary"
          }`}
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
        </span>
      )}
    </button>
  );
};
