/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { CONFIG } from '@/constants/config';
import setGlobalColorTheme from '@/lib/theme-colors';
import { Theme } from '@/types/app.types';
import { ThemeColors } from '@/types/theme-types';
import * as React from 'react';
import { createContext } from 'react';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  themeColor: 'Beige',
  setThemeColor: () => null
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};
const getSavedThemeColor = () => {
  try {
    return (localStorage.getItem('themeZorzal') as ThemeColors) || 'Beige';
  } catch (error) {
    'Beige' as ThemeColors;
  }
};

// Use Provider
export function ThemeProvider({
  children,
  defaultTheme = CONFIG.defaultTheme,
  storageKey = CONFIG.storageKey,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [themeColor, setThemeColor] = React.useState<ThemeColors>(
    getSavedThemeColor() as ThemeColors
  );
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);

    if (themeColor) {
      localStorage.setItem('themeZorzal', themeColor);
      setGlobalColorTheme(theme, themeColor);
    }

    if (!isMounted) {
      setIsMounted(true);
    }
  }, [theme, themeColor]);

  // to prevent hydration error, or flash of unstyled content
  if (!isMounted) return null;

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    themeColor,
    setThemeColor
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
}
