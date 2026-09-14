import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";

// ── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "CREOIT — 360° Creative Marketing Company",
    template: "%s | CREOIT",
  },
  description:
    "CREOIT is a collective of creative thinkers, strategists, marketers and makers helping brands become impossible to ignore. Based in Bhopal, India.",
  keywords: [
    "CREOIT",
    "creative marketing",
    "brand strategy",
    "content production",
    "performance marketing",
    "Bhopal",
    "India",
    "360 marketing",
  ],
  authors: [{ name: "CREOIT", url: "https://creoit.in" }],
  creator: "CREOIT",
  publisher: "CREOIT",
  metadataBase: new URL("https://creoit.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://creoit.in",
    siteName: "CREOIT",
    title: "CREOIT — 360° Creative Marketing Company",
    description:
      "A collective of creative thinkers, strategists, marketers and makers helping brands become impossible to ignore.",
    images: [
      {
        url: "/images/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "CREOIT — 360° Creative Marketing Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CREOIT — 360° Creative Marketing Company",
    description:
      "A collective of creative thinkers, strategists, marketers and makers helping brands become impossible to ignore.",
    images: ["/images/og/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

// ── Root Layout ────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased overflow-x-hidden">
        <SmoothScrollProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
