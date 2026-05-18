"use client";

import { Playfair_Display, Outfit } from "next/font/google";
import { useEffect, useRef } from "react";
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
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + "px";
        cursorRef.current.style.top = my + "px";
      }
    };
    const loop = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top = ry + "px";
      }
      requestAnimationFrame(loop);
    };
    document.addEventListener("mousemove", onMove);
    const id = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <html lang="ro" className={playfair.variable + " " + outfit.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ overflowX: "hidden", margin: 0, padding: 0 }}>
        {typeof window !== "undefined" && window.innerWidth > 768 && <>
          <div ref={cursorRef} style={{ position: "fixed", width: 8, height: 8, background: "#C9A84C", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transform: "translate(-50%,-50%)", transition: "transform 0.2s", top: 0, left: 0 }} />
          <div ref={ringRef} style={{ position: "fixed", width: 36, height: 36, border: "1.5px solid rgba(201,168,76,0.45)", borderRadius: "50%", pointerEvents: "none", zIndex: 9998, transform: "translate(-50%,-50%)", transition: "width 0.3s, height 0.3s", top: 0, left: 0 }} />
        </>}
        <ScrollReveal>{children}</ScrollReveal>
      </body>
    </html>
  );
}
