import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Chivo_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { Shell } from "@/components/shell/Shell";

const clash = localFont({
  src: "../public/fonts/clash-display-variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const chivo = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-chivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CREOIT — We Create What People Remember",
    template: "%s | CREOIT",
  },
  description:
    "CREOIT is a 360° creative marketing company in Bhopal, India. Branding, content, performance, digital, experiences and growth strategy — one team, built to be remembered.",
  keywords: [
    "CREOIT",
    "creative marketing agency",
    "brand strategy",
    "content production",
    "performance marketing",
    "Bhopal",
    "India",
  ],
  metadataBase: new URL("https://creoit.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://creoit.in",
    siteName: "CREOIT",
    title: "CREOIT — We Create What People Remember",
    description:
      "A collective of creative thinkers, strategists, marketers and makers helping brands become impossible to ignore.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CREOIT — We Create What People Remember",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${clash.variable} ${fraunces.variable} ${chivo.variable}`}>
      <body>
        <SmoothScrollProvider>
          <Shell>{children}</Shell>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
