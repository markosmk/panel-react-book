import { Role } from '@/types/user.types';
import { CONFIG } from './config';

import { Icons, IconSVG } from '@/components/icons';

/** This is exclusive for navigation menu */
export type NavigationItem = {
  name: string;
  href: string;
  icon?: IconSVG;
  disabled?: boolean;
  role?: Role[];
  submenu?: NavigationItem[];
};

export const supportOptions: NavigationItem[] = [
  {
    name: 'Soporte por Email',
    href: 'mailto:' + CONFIG.app.supportEmail,
    icon: Icons.mail
  },
  {
    name: 'Soporte por Whatsapp',
    href: 'https://wa.me/' + CONFIG.app.supportPhone,
    icon: Icons.whatsapp
  },
  { name: 'Documentación', href: '/docs', icon: Icons.book }
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
    icon: Icons.bookings,
    submenu: [
      {
        name: 'Reservas Activas',
        href: '/bookings'
      },
      {
        name: 'Historial de Reservas',
        href: '/bookings/history'
      },
      {
        name: 'Crear Reserva',
        href: '/bookings/create'
      }
    ]
  },
  {
    name: 'Tours',
    href: '/tours',
    icon: Icons.tours
  },
  {
    name: 'Adicionales',
    href: '/additionals',
    icon: Icons.additionals
  },
  {
    name: 'Clientes',
    href: '/customers',
    icon: Icons.customers
  },
  {
    name: 'Usuarios',
    href: '/users',
    icon: Icons.users,
    role: [Role.SUPERADMIN]
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Icons.settings
  }
];
