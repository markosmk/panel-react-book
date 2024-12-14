import { CONFIG } from './config';

import { Icons, IconSVG } from '@/components/icons';

/** This is exclusive for navigation menu */
export type NavigationItem = {
  name: string;
  href: string;
  icon: IconSVG;
  disabled?: boolean;
};

export const supportOptions: NavigationItem[] = [
  {
    name: 'Soporte por Email',
    href: 'mailto:' + CONFIG.app.supportEmail,
    icon: Icons.mail
  },
  { name: 'Leer Documentacion', href: '#', icon: Icons.book }
];

export const adminNavigation: NavigationItem[] = [
  {
    name: 'Panel',
    href: '/',
    icon: Icons.dashboard
  },
  {
    name: 'Reservas',
    href: '/bookings',
    icon: Icons.bookings
  },
  {
    name: 'Tours',
    href: '/tours',
    icon: Icons.tours
  },
  {
    name: 'Clientes',
    href: '/customers',
    icon: Icons.customers
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Icons.settings
  }
];
