"use client";

import React, { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, format = 'auto', style }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log("AdSense waiting for initialization...");
    }
  }, [slot]); // Re-run if slot changes

  return (
    <div 
      className="ad-container" 
      style={{ 
        margin: '2.5rem 0', 
        textAlign: 'center', 
        width: '100%', 
        overflow: 'hidden',
        position: 'relative',
        ...style 
      }}
    >
      <span className="ad-label" style={{ 
        display: 'block', 
        fontSize: '0.65rem', 
        color: '#666', 
        marginBottom: '0.6rem', 
        textTransform: 'uppercase', 
        letterSpacing: '1.5px',
        fontWeight: 600
      }}>
        Sponsored Content
      </span>
      <div className="ad-wrapper" style={{ 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px dashed rgba(255,255,255,0.1)', 
        minHeight: '100px', 
        borderRadius: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '10px'
      }}>
        {/* AdSense Unit */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        ></ins>
        
        {/* Placeholder info shown only when no ad is served */}
        <div className="ad-placeholder-info" style={{ 
          position: 'absolute', 
          color: '#333', 
          fontSize: '0.7rem',
          pointerEvents: 'none',
          zIndex: -1
        }}>
          Ad Slot: {slot}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
