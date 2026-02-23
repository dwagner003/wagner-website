import { useState, useEffect, useCallback } from 'react';

type Theme = 'default' | 'synthwave';

const THEME_STORAGE_KEY = 'wagner-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'default';
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return (stored === 'default' || stored === 'synthwave') ? stored : 'default';
    } catch {
      return 'default';
    }
  });

  useEffect(() => {
    if (theme === 'synthwave') {
      document.documentElement.setAttribute('data-theme', 'synthwave');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Silent fail - theme still works in-memory
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'default' ? 'synthwave' : 'default'));
  }, []);

  return { theme, toggleTheme };
}
