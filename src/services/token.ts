import { CONFIG } from '@/constants/config';
import Cookies from 'js-cookie';

type Payload = {
  iat: number;
  exp: number;
  // sub: string;
  id: string;
  role: string;
  data: {
    name?: string;
    username?: string;
    email: string;
  };
};

function valideFormatJWT(token: string) {
  const jwtRegex = /^[A-Za-z0-9-_]+(\.[A-Za-z0-9-_]+){2}$/;
  return jwtRegex.test(token);
}

export const tokenClient = {
  getToken: () => {
    if (CONFIG.authInjectCookie || CONFIG.authStorageMethod === 'cookie') {
      const token = Cookies.get(CONFIG.cookieName);
      return token;
    }

    const localToken = localStorage.getItem(CONFIG.tokenKey);

    if (localToken && !valideFormatJWT(localToken)) {
      localStorage.removeItem(CONFIG.tokenKey);
      return null;
    }

    return localToken;
  },
  /** only save the token if not has been injected */
  setToken: (token: string) => {
    if (CONFIG.authInjectCookie) return null;

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
    if (CONFIG.authInjectCookie || CONFIG.authStorageMethod === 'cookie') {
      Cookies.remove(CONFIG.cookieName);
    } else {
      localStorage.removeItem(CONFIG.tokenKey);
    }
  },

  decodeToken: (token: string): Payload | null => {
    if (!token || !valideFormatJWT(token)) {
      return null;
    }

    try {
      // extract payload
      const base64Url = token.split('.')[1];
      // convert to base64
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      // decode payload
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};
