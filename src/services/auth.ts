/* eslint-disable no-useless-catch */
import { CONFIG } from '@/constants/config';

export const authClient = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(CONFIG.apiUrl + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      throw error;
    }
  },
  logout: async () => {
    try {
      await fetch(CONFIG.apiUrl + '/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error: unknown) {
      console.error('Error fetch in logout:', error);
      // throw error;
    }
  },
  getUser: async () => {
    try {
      const response = await fetch(CONFIG.apiUrl + '/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // Authorization: `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch user');

      const data = await response.json();
      return data?.user;
    } catch (error: unknown) {
      // console.error('Error fetching user in auth:', error);
      throw error;
    }
  }
};
