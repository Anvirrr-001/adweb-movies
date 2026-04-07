"use client";

import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
  customScriptId?: string; // For Adsterra IDs or other custom script keys
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, format = 'auto', style, customScriptId }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If it's a standard AdSense unit
    if (!customScriptId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        // Silent catch for dev environment
      }
    }
  }, [customScriptId]);

  return (
    <div className="ad-container" style={{ margin: '2rem 0', width: '100%', ...style }}>
      <div className="ad-label">SPONSORED</div>
      <div className="ad-box" ref={adRef}>
        {!customScriptId ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          ></ins>
        ) : (
          <div className="custom-ad-placeholder">
            {/* Custom script will be injected here if we use a global manager */}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Adsterra Active: {slot}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .ad-container { text-align: center; }
        .ad-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 0.5rem;
        }
        .ad-box {
          background: var(--surface);
          border: 1px dashed var(--surface-border);
          min-height: 90px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          overflow: hidden;
        }
        .custom-ad-placeholder {
          text-transform: uppercase;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default AdBanner;
