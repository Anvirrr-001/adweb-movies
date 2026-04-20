"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "@/components/SiteSettingsProvider";
import Script from "next/script";

export default function AdsterraController() {
  const settings = useSettings();
  const adsterra = settings.adsterra;
  const [scripts, setScripts] = useState<{ src?: string; code?: string; id: string }[]>([]);

  useEffect(() => {
    if (!adsterra.enabled || !adsterra.scripts) return;

    const extractScripts = (htmlString: string, type: string) => {
      if (!htmlString) return [];
      const tmpDiv = document.createElement("div");
      tmpDiv.innerHTML = htmlString;
      return Array.from(tmpDiv.querySelectorAll("script")).map((s, i) => ({
        src: s.src || undefined,
        code: s.innerHTML || undefined,
        id: `adsterra-${type}-${i}`
      }));
    };

    // Extract all global scripts from settings
    const allExtracted: { src?: string; code?: string; id: string }[] = [];
    
    // Specifically target popunder and social bar as global background scripts
    // But also include any others that are meant to be global
    Object.entries(adsterra.scripts).forEach(([key, value]) => {
       // Only inject scripts that are NOT banners (banners are handled by AdBanner)
       if (key === 'popunder' || key === 'social_bar' || key.includes('global')) {
         const extracted = extractScripts(value as string, key);
         allExtracted.push(...extracted);
       }
    });

    setScripts(allExtracted);
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
