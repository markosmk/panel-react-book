import { Config } from '@/types/app.types';

export const CONFIG: Config = {
  apiUrl: import.meta.env.VITE_API_URL,
  defaultTheme: 'system',
  storageKey: 'vite-ui-theme',
  // For Authentication
  authInjectCookie: true,
  cookieName: 'app_user', //app_token
  tokenKey: 'accessToken',
  authStorageMethod: 'localStorage'
};
