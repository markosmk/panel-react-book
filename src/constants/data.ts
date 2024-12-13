import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Panel',
    href: '/',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Reservas',
    href: '/booking',
    icon: 'user',
    label: 'Reservas'
  },
  {
    title: 'Clientes',
    href: '/customers',
    icon: 'user',
    label: 'Clientes'
  },
  {
    title: 'Tours',
    href: '/tours',
    icon: 'user',
    label: 'Tours'
  }
];

export const dashboardCard = [
  {
    date: 'Today',
    total: 2000,
    role: 'Students',
    color: 'bg-[#EC4D61] bg-opacity-40'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Teachers',
    color: 'bg-[#FFEB95] bg-opacity-100'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Parents',
    color: 'bg-[#84BD47] bg-opacity-30'
  },
  {
    date: 'Today',
    total: 2000,
    role: 'Schools',
    color: 'bg-[#D289FF] bg-opacity-30'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};
