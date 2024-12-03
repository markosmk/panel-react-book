import axios from '@/lib/axios';
import { DashboardBooking, DashboardStats } from '@/types/dashboard.types';

export const dashboardStats = async () =>
  await axios.get<DashboardStats>('/dashboard/stats');

export const dashboardRecentBookings = async () =>
  await axios.get<DashboardBooking[]>('/dashboard/recent-bookings');
