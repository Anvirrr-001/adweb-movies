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
      let adCode = "";
      const isNative = slot === 'home-mid' || slot === 'archive-bottom' || slot.includes('native');
      const isStatic = slot === 'detail-sidebar-top' || slot === 'detail-sidebar-bottom' || slot.includes('sidebar');

      if (isNative) {
        adCode = settings.adsterra.scripts.native_banner || "";
      } else if (isStatic) {
        adCode = settings.adsterra.scripts.banner_300x250 || "";
      }

      if (adCode) {
        // Clear previous content
        adRef.current.innerHTML = "";
        
        if (isNative) {
          // For native banners, inject directly to avoid iframe issues
          const range = document.createRange();
          const documentFragment = range.createContextualFragment(adCode);
          adRef.current.appendChild(documentFragment);
          
          // Re-trigger script if it didn't run
          const scripts = adRef.current.querySelectorAll('script');
          scripts.forEach(oldScript => {
             const newScript = document.createElement('script');
             Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
             newScript.innerHTML = oldScript.innerHTML;
             oldScript.parentNode?.replaceChild(newScript, oldScript);
          });
        } else {
          // For static banners, use iframe to handle potential document.write
          const iframe = document.createElement('iframe');
          iframe.style.width = '300px';
          iframe.style.height = '250px';
          iframe.style.border = 'none';
          iframe.style.overflow = 'hidden';
          iframe.scrolling = 'no';
          
          adRef.current.appendChild(iframe);

          const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
                </style>
              </head>
              <body>${adCode}</body>
              </html>
            `);
            iframeDoc.close();
          }
        }
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
