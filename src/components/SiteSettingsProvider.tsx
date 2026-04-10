"use client";

import React, { createContext, useContext } from 'react';
import { SiteSettings } from '@/lib/types';

const SettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({ children, settings }: { children: React.ReactNode, settings: SiteSettings }) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
