"use client";

import { useState } from "react";
import Preloader from "@/components/ui/Preloader";

/**
 * Thin client wrapper so the server RootLayout can
 * include the Preloader without becoming a client component.
 */
export default function PreloaderWrapper() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return <Preloader onComplete={() => setVisible(false)} />;
}
