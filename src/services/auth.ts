import { API_URL } from '@/constants/data';
import { sleep } from '@/lib/utils';

export const authClient = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(API_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      console.error('Error fetch in login:', error);
      throw error;
    }
  },
  logout: async () => {
    await sleep(2000);
    await fetch(API_URL + '/logout', {
      method: 'POST',
      credentials: 'include'
    });
  },
  getUser: async () => {
    try {
      await sleep(2000);
      const response = await fetch(API_URL + '/me', {
        method: 'GET',
        // mode: 'no-cors',
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
      console.error('Error fetching user in auth:', error);
      throw error;
    }
  }
};
