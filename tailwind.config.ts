import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        "bg-main": "var(--bg-main)",
        "bg-soft": "var(--bg-soft)",
        "bg-mint": "var(--bg-mint)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        "text-inverse": "var(--text-inverse)",
        brand: {
          DEFAULT: "var(--brand)",
          dark: "var(--brand-dark)",
          light: "var(--brand-light)",
          soft: "var(--brand-soft)",
        },
        hero: {
          from: "var(--hero-from)",
          to: "var(--hero-to)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },
        emergency: {
          DEFAULT: "var(--emergency)",
          soft: "var(--emergency-soft)",
          dark: "#B42318",
        },
        success: {
          DEFAULT: "var(--success)",
          soft: "var(--success-soft)",
          dark: "#0F7A38",
        },
        border: {
          DEFAULT: "var(--border)",
          soft: "var(--border-soft)",
        },
        whatsapp: {
          DEFAULT: "var(--whatsapp)",
          dark: "#1DA851",
        },
      },
      fontFamily: {
        heading: ["var(--font-head)", "Montserrat", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "sans-serif"],
        bengali: ["var(--font-bengali)", "Hind Siliguri", "sans-serif"],
      },
      spacing: {
        "4.5": "1.125rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        "sm": "8px",
        "md": "12px",
        "lg": "16px",
        "xl": "20px",
        "2xl": "24px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(26, 43, 76, 0.08), 0 1px 2px rgba(26, 43, 76, 0.04)",
        md: "0 4px 6px -1px rgba(26, 43, 76, 0.1), 0 2px 4px -2px rgba(26, 43, 76, 0.06)",
        lg: "0 10px 15px -3px rgba(26, 43, 76, 0.1), 0 4px 6px -4px rgba(26, 43, 76, 0.05)",
      },
      zIndex: {
        "40": "40", // mobile bottom nav
        "50": "50", // navbar
        "60": "60", // drawers
        "70": "70", // modals
        "80": "80", // toasts
      },
      keyframes: {
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sosPulse: {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(217, 45, 32, 0.5)" },
          "50%": { transform: "scale(1.04)", boxShadow: "0 0 0 16px rgba(217, 45, 32, 0)" },
        },
        skeletonShimmer: {
          "0%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0 50%" },
        },
        modalRise: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        drawerSlide: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        sheetSlide: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        toastRise: {
          "0%": { opacity: "0", transform: "translate(-50%, 12px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        riseIn: "riseIn 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        sosPulse: "sosPulse 2.4s infinite",
        skeleton: "skeletonShimmer 1.4s ease infinite",
        modalRise: "modalRise 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        drawerSlide: "drawerSlide 240ms cubic-bezier(0.22, 1, 0.36, 1)",
        sheetSlide: "sheetSlide 240ms cubic-bezier(0.22, 1, 0.36, 1)",
        toastRise: "toastRise 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        fadeIn: "fadeIn 200ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
