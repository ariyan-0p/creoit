"use client";

import { useEffect, useState } from "react";

/** Live Bhopal (IST) clock. Renders empty until mounted to avoid hydration drift. */
export function Clock({ seconds = false }: { seconds?: boolean }) {
  const [t, setT] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      ...(seconds ? { second: "2-digit" } : {}),
      hour12: false,
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, seconds ? 1000 : 10000);
    return () => clearInterval(id);
  }, [seconds]);

  return (
    <span className="tabular-nums">
      {t || "--:--"} IST
    </span>
  );
}
