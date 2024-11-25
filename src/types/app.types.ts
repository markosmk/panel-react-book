// types exclusive from app

export type Theme = 'dark' | 'light' | 'system';

export type Config = {
  /** Api url base */
  apiUrl: string;
  /** theme init value, options: 'light', 'dark', 'system' */
  defaultTheme: Theme;
  /** key for save theme in localStorage */
  storageKey: string;
  /** if backend login inject cookie with token, set to true,
   * and important to set cookieName (same as configured in backend)
   */
  authInjectCookie: boolean;
  /** name for cookie authentication, (if authInjectCookie is true, cookieName is required, must be the same configured in backend) */
  cookieName: string;
  /** key name for localStorage, if use authInjectCookie, this is not necesary */
  tokenKey: string;
  /** only 'cookie' or 'localStorage' for save auth, if use authInjectCookie, this is not necesary */
  authStorageMethod: 'cookie' | 'localStorage';
};

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}
