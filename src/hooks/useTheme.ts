'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

function getServerSnapshot(): 'light' {
  return 'light';
}

function getSnapshot(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  return savedTheme || 'light';
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use a microtask to avoid synchronous setState in effect
    queueMicrotask(() => setMounted(true));
    // Apply theme to document on mount
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    // Trigger re-render by dispatching a storage event
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: newTheme }));
  }, [theme]);

  return { theme, toggleTheme, mounted };
}