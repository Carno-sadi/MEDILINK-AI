"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center gap-2 pointer-events-none max-w-[90vw] w-max"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <SingleToast key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside of ToastProvider
    return {
      showToast: (message: string, type: ToastType = "info") => {
        console.log(`[Toast ${type}]: ${message}`);
      },
    };
  }
  return context;
};

interface SingleToastProps {
  toast: ToastItem;
  onDismiss: () => void;
}

const SingleToast: React.FC<SingleToastProps> = ({ toast, onDismiss }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(3200);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss();
    }, remainingTimeRef.current);
  }, [onDismiss]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const bgStyles: Record<ToastType, string> = {
    success: "bg-success text-white",
    error: "bg-emergency text-white",
    info: "bg-text-primary text-white",
  };

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />,
    error: <AlertCircle className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />,
    info: <Info className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />,
  };

  return (
    <div
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      onTouchStart={pauseTimer}
      onTouchEnd={startTimer}
      className={`pointer-events-auto min-w-[280px] max-w-full px-[18px] py-3.5 rounded-md shadow-lg flex items-center gap-2.5 text-sm font-medium animate-toastRise ${bgStyles[toast.type]}`}
      role="alert"
    >
      {icons[toast.type]}
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="p-1 rounded hover:bg-white/20 transition-colors shrink-0"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
  );
};
