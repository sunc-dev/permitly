import type { Metadata } from "next";
import { Public_Sans, Inter } from "next/font/google";
import "./globals.css";

const sans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Inter is used only for numeric figures (tighter, cleaner numerals).
const num = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-num",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Permitly",
  description: "City of Toronto permit portal — prototype",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${num.variable}`}>
      <body>{children}</body>
    </html>
  );
}
