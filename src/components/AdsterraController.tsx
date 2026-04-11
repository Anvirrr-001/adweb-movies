"use client";

import React, { useEffect } from "react";
import { useSettings } from "@/components/SiteSettingsProvider";

export default function AdsterraController() {
  const settings = useSettings();
  const adsterra = settings.adsterra;

  useEffect(() => {
    if (!adsterra.enabled) return;

    const injectGlobalScript = (htmlString: string) => {
      if (!htmlString) return;
      const tmpDiv = document.createElement("div");
      tmpDiv.innerHTML = htmlString;
      const scripts = tmpDiv.querySelectorAll("script");
      
      scripts.forEach(oldScript => {
        // Prevent duplicate injection
        if (oldScript.src && document.querySelector(`script[src="${oldScript.src}"]`)) return;

        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        if (oldScript.innerHTML) {
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        }
        document.body.appendChild(newScript);
      });
    };

    injectGlobalScript(adsterra.scripts?.popunder || "");
    injectGlobalScript(adsterra.scripts?.social_bar || "");
    
  }, [adsterra]);

  return null;
}
