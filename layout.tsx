import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Aitimp.ro — Dacă nu ai tu timp, au alții pentru tine",
  description: "Platforma română de rezervări profesionale. Găsești rapid un profesionist verificat pentru orice serviciu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${playfair.variable} ${outfit.variable}`}>
      <body><ScrollReveal>{children}</ScrollReveal></body>
    </html>
  );
}
