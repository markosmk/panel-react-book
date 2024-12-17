import { Config } from '@/types/app.types';

export const CONFIG: Config = {
  apiUrl: 'https://api.zorzalwines.com/public/index.php/api/v1',
  // apiUrl: 'https://zorzal.host/api/public/index.php/api/v1',
  // apiUrl: 'http://localhost:8080/api/v1',
  defaultTheme: 'system',
  storageKey: 'vite-ui-theme',
  // For Authentication
  authInjectCookie: true,
  cookieName: 'app_user', //app_token
  tokenKey: 'accessToken',
  authStorageMethod: 'localStorage',
  app: {
    platformVersion: '0.1.0',
    supportEmail: ''
  }
};
