import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Simplimed — AI Medical Report Analysis",
    template: "%s | Simplimed",
  },
  description:
    "Simplimed is an AI-powered medical report analysis and personal health intelligence platform.",
  keywords: ["medical", "AI", "health", "report analysis", "simplimed"],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      {/*
        body — full viewport width, light subtle background.
        Backgrounds on sections bleed edge-to-edge at any screen size.
      */}
      <body className="min-h-screen w-full bg-bg-subtle font-sans antialiased">
        {/*
          Root canvas wrapper:
          - w-full          → fills viewport on all screen sizes
          - max-w-[1920px]  → hard lock at 1920px on ultra-widescreen monitors
          - mx-auto         → centers the canvas on screens > 1920px
          - min-h-screen    → canvas always spans full vertical height
          - flex flex-col   → vertical stacking for header / main / footer
          Padding is intentionally omitted here — each section and page
          manages its own horizontal spacing so backgrounds bleed correctly.
        */}
        <div className="mx-auto flex w-full max-w-[1920px] min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
