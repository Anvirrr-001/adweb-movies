"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "@/components/SiteSettingsProvider";
import Script from "next/script";

export default function AdsterraController() {
  const settings = useSettings();
  const adsterra = settings.adsterra;
  const [scripts, setScripts] = useState<{ src?: string; code?: string; id: string }[]>([]);

  useEffect(() => {
    if (!adsterra.enabled) return;

    const extractScripts = (htmlString: string, type: string) => {
      if (!htmlString) return;
      const tmpDiv = document.createElement("div");
      tmpDiv.innerHTML = htmlString;
      const extracted = Array.from(tmpDiv.querySelectorAll("script")).map((s, i) => ({
        src: s.src || undefined,
        code: s.innerHTML || undefined,
        id: `adsterra-${type}-${i}`
      }));
      return extracted;
    };

    const popunderScripts = extractScripts(adsterra.scripts?.popunder || "", "popunder") || [];
    const socialBarScripts = extractScripts(adsterra.scripts?.social_bar || "", "socialbar") || [];

    setScripts([...popunderScripts, ...socialBarScripts]);
  }, [adsterra]);

  if (!adsterra.enabled) return null;

  return (
    <>
      {scripts.map((s) => (
         s.src ? (
           <Script key={s.id} id={s.id} src={s.src} strategy="afterInteractive" />
         ) : s.code ? (
           <Script key={s.id} id={s.id} strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: s.code }} />
         ) : null
      ))}
    </>
  );
}
