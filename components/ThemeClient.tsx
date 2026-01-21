'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'mot_theme';

export default function ThemeClient() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // This product's default visual language is dark (closer to the provided UI drafts).
      const shouldDark = saved ? saved === 'dark' : true;
      document.documentElement.classList.toggle('dark', shouldDark);
    } catch {
      // ignore
    }
  }, []);

  return null;
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const next = !isDark;
  document.documentElement.classList.toggle('dark', next);
  try {
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  } catch {
    // ignore
  }
}
