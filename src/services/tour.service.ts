import axios from '@/lib/axios';
import { Tour, TourDetail, TourRequest } from '@/types/tour.types';

export const getTours = async () => await axios.get<Tour[]>('/tours');

export const getTourById = async (id: string | number) =>
  await axios.get<TourDetail>('/tours/' + id);

export const updateFastTour = async (
  id: string | number,
  data: {
    price: string | number;
    capacity: string | number;
    duration: string | number;
    active: '1' | '0';
  }
) => await axios.put('/tours/' + id, data);

export const updateTour = async (id: string | number, data: TourRequest) =>
  await axios.put('/tours/' + id, data);
