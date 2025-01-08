export interface ScheduleSummary {
  scheduleId: string;
  startTime: string;
  endTime: null;
  tourName: string;
  tourDescription: string;
  tourCapacity: string;
  tourPrice: string;
  tourDuration: string;
  reservationsCount: number;
  totalReserved: number;
  reservations: Reservation[];
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: string;
  status: string;
  totalPrice: string;
  notes: string;
}
