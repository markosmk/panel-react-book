import { CONFIG } from '@/constants/config';
import Cookies from 'js-cookie';

export const tokenClient = {
  getToken: () => {
    if (CONFIG.authStorageMethod === 'cookie') {
      return Cookies.get(CONFIG.cookieName);
    }
    return localStorage.getItem(CONFIG.tokenKey);
  },
  setToken: (token: string) => {
    if (CONFIG.authStorageMethod === 'cookie') {
      Cookies.set(CONFIG.cookieName, token, {
        secure: true,
        sameSite: 'Strict',
        expires: 7
      });
    } else {
      localStorage.setItem(CONFIG.tokenKey, token);
    }
  },
  removeToken: () => {
    if (CONFIG.authStorageMethod === 'cookie') {
      Cookies.remove(CONFIG.cookieName);
    } else {
      localStorage.removeItem(CONFIG.tokenKey);
    }
  }
};
