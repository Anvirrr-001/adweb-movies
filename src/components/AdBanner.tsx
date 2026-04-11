"use client";

import React, { useEffect, useRef } from 'react';
import { useSettings } from "@/components/SiteSettingsProvider";

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, format = 'auto', style }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const settings = useSettings();
  const isEnabled = settings.adsterra.enabled;

  useEffect(() => {
    if (isEnabled && adRef.current) {
      // Find the specific script for this slot from settings
      let nativeScript = "";
      
      if (slot === 'home-mid' || slot === 'archive-bottom' || slot.includes('native')) {
        nativeScript = settings.adsterra.scripts.native_banner || "";
      } else if (slot === 'detail-sidebar-top' || slot === 'detail-sidebar-bottom' || slot.includes('sidebar')) {
        nativeScript = settings.adsterra.scripts.banner_300x250 || "";
      }

      if (nativeScript) {
        adRef.current.innerHTML = nativeScript;
        
        // Find and execute scripts
        const scripts = adRef.current.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          if (oldScript.innerHTML) {
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          }
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
      }
    }
  }, [slot, isEnabled, settings.adsterra.scripts]);

  if (!isEnabled) return null;

  return (
    <div className="ad-container" style={{ margin: '2.5rem 0', width: '100%', ...style }}>
      <div className="ad-label">SPONSORED CONTENT</div>
      <div className="ad-box glass" ref={adRef}>
         <div className="custom-ad-placeholder">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800 }}>Registry Stream Active</span>
         </div>
      </div>

      <style jsx>{`
        .ad-container { text-align: center; }
        .ad-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 0.75rem;
        }
        .ad-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--surface-border);
          min-height: 120px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow: hidden;
          transition: 0.3s;
        }
        .ad-box:hover {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
        }
      `}</style>
    </div>
  );
};

export default AdBanner;
