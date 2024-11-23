import { Config } from '@/types/app.types';

export const CONFIG: Config = {
  apiUrl: import.meta.env.VITE_API_URL,
  defaultTheme: 'system',
  storageKey: 'vite-ui-theme',
  cookieName: 'authToken',
  tokenKey: 'accessToken',
  authStorageMethod: 'cookie'
};
