import type { Metadata, Viewport } from "next";
import { Montserrat, Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-head",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediLink — Your Health, One Link Away",
  description:
    "AI-powered healthcare platform for Bangladesh connecting patients with medicine, doctors, and emergency services.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} ${hindSiliguri.variable}`}>
      <body className="font-sans bg-bg-main text-text-primary antialiased min-h-screen selection:bg-brand-light selection:text-brand-dark">
        {children}
      </body>
    </html>
  );
}
