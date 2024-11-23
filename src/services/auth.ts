import { API_URL } from '@/constants/data';

export const authClient = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(API_URL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
  },
  logout: async () => {
    // await fetch(API_URL + '/logout', { method: 'POST' });
  },
  getUser: async (token: string) => {
    const response = await fetch(API_URL + '/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user');
      // if (response.status === 401) {
      //   console.warn('Unauthorized: Token is invalid or expired');
      //   throw new Error('Unauthorized');
      // }
      // throw new Error(`Failed to fetch user: ${response.status}`);
    }
    const userData = await response.json();
    console.log('response', userData);
    return userData;
  }
};
