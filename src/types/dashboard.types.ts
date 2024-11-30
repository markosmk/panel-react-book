export type DashboardStats = {
  income: {
    total: string;
    change: string;
  };
  visitors: {
    total: string;
    change: string;
  };
  bookings: {
    total: number;
    change: string;
  };
  total_bookings_confirmed: number;
  total_bookings_pending: number;
  popularTour: {
    tourId: string;
    bookings_count: string;
    tour_name: string;
  };
  monthly_income: {
    Jan: number;
    Feb: number;
    Mar: number;
    Apr: number;
    May: number;
    Jun: number;
    Jul: number;
    Aug: number;
    Sep: number;
    Oct: number;
    Nov: number;
    Dec: number;
  };
};

export type DashboardBooking = {
  booking_id: string;
  quantity: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  booking_created_at: string;
  customer_name: string;
  tour_name: string;
};
