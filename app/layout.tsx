import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import PreloaderWrapper from "@/providers/PreloaderWrapper";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chivo+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased overflow-x-hidden">
        <PreloaderWrapper />
        <SmoothScrollProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
