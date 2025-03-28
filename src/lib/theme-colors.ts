import { ThemeColors } from '@/types/theme-types';

const themes = {
  Green: {
    light: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      card: '0 0% 100%',
      cardForeground: '240 10% 3.9%',
      popover: '0 0% 100%',
      popoverForeground: '240 10% 3.9%',
      primary: '142.1 60% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '240 4.8% 95.9%',
      secondaryForeground: '240 5.9% 10%',
      muted: '240 4.8% 95.9%',
      mutedForeground: '240 3.8% 46.1%',
      accent: '240 4.8% 95.9%',
      accentForeground: '240 5.9% 10%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      border: '240 5.9% 90%',
      input: '240 5.9% 90%',
      ring: '142.1 60% 40%',
      radius: '0.5rem'
    },
    dark: {
      background: '20 14.3% 4.1%',
      foreground: '0 0% 95%',
      card: '24 9.8% 10%',
      cardForeground: '0 0% 95%',
      popover: '0 0% 9%',
      popoverForeground: '0 0% 95%',
      primary: '142.1 60% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '240 3.7% 15.9%',
      secondaryForeground: '0 0% 98%',
      muted: '0 0% 15%',
      mutedForeground: '240 5% 64.9%',
      accent: '12 6.5% 15.1%',
      accentForeground: '0 0% 98%',
      destructive: '0 62.8% 55.6%',
      destructiveForeground: '0 85.7% 97.3%',
      border: '240 3.7% 15.9%',
      input: '240 3.7% 15.9%',
      ring: '142.1 60% 40%'
    }
  },
  Beige: {
    light: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      card: '0 0% 100%',
      cardForeground: '240 10% 3.9%',
      popover: '0 0% 100%',
      popoverForeground: '240 10% 3.9%',
      primary: '142.1 60% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '240 4.8% 95.9%',
      secondaryForeground: '240 5.9% 10%',
      muted: '240 4.8% 95.9%',
      mutedForeground: '240 3.8% 46.1%',
      accent: '240 4.8% 95.9%',
      accentForeground: '240 5.9% 10%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      border: '240 5.9% 90%',
      input: '240 5.9% 90%',
      ring: '142.1 60% 40%',
      radius: '0.5rem'
    },
    dark: {
      background: '20 14.3% 4.1%',
      foreground: '0 0% 95%',
      card: '220 5.26% 11.18%',
      // card: '24 9.8% 10%',
      cardForeground: '0 0% 95%',
      popover: '0 0% 9%',
      popoverForeground: '0 0% 95%',
      primary: '30 32% 48%',
      primaryForeground: '144.9 80.4% 10%',
      secondary: '240 3.7% 15.9%',
      secondaryForeground: '0 0% 98%',
      muted: '0 0% 15%',
      mutedForeground: '240 5% 64.9%',
      accent: '12 6.5% 15.1%',
      accentForeground: '0 0% 98%',
      destructive: '0 62.8% 55.6%',
      destructiveForeground: '0 85.7% 97.3%',
      border: '240 3.7% 15.9%',
      input: '240 3.7% 15.9%',
      ring: '30 32% 48%'
    }
  }
};

export default function setGlobalColorTheme(
  themeMode: 'light' | 'dark',
  color: ThemeColors
) {
  const theme = themes[color][themeMode] as {
    [key: string]: string;
  };
  for (const key in theme) {
    document.documentElement.style.setProperty(`--${key}`, theme[key]);
  }
}
