"use client";

import { Playfair_Display, Outfit } from "next/font/google";
import CursorEffect from "@/components/CursorEffect";
import ScrollReveal from "@/components/ScrollReveal";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={playfair.variable + " " + outfit.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ overflowX: "hidden", margin: 0, padding: 0 }}>
        <CursorEffect />
        <ScrollReveal>{children}</ScrollReveal>
      </body>
    </html>
  );
}