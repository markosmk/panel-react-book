// types exclusive from app

import { AxiosError } from 'axios';

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
  app: {
    /** App name */
    name: string;
    platformVersion: string;
    supportEmail: string;
    supportPhone: string;
  };
};

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  role: string;
}

interface ApiError {
  status: number;
  error: number;
  messages: Record<string, string> | string; // Puede ser un objeto de errores de campo o un mensaje de error general
}

export type CustomAxiosError = AxiosError<ApiError>;

export type SettingsApp = {
  phoneWhatsapp: string;
  email: string;
  aditionalNote: string;
  terms?: string;
  privacyPolicy?: string;
  isActiveBooking: '1' | '0';
  messageDisabled?: string;
};

export interface Additional {
  id: string;
  name: string;
  description: string;
  price: string;
  availability: string;
  active: string;
  created_at: string;
  updated_at: string;
  translations: TranslationAditional[];
}

export interface TranslationAditional {
  id?: string;
  additional_id?: string;
  language: string;
  name: string;
  description: string;
}

export interface AdditionalRequest
  extends Omit<Additional, 'id' | 'created_at' | 'updated_at'> {
  id?: string | null;
}
