// types exclusive from app

export type Theme = 'dark' | 'light' | 'system';

export type Config = {
  /** api url base */
  apiUrl: string;
  /** theme init value, options: 'light', 'dark', 'system' */
  defaultTheme: Theme;
  /** key for save theme in localStorage */
  storageKey: string;
  /** key for cookie authentication */
  cookieName: string;
  /** key for localStorage */
  tokenKey: string;
  /** only 'cookie' or 'localStorage' for save auth */
  authStorageMethod: 'cookie' | 'localStorage';
};

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}
