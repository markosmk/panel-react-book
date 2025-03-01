import { useQuery } from '@tanstack/react-query';
import { getSchedules } from '../schedule.service';

export function useSchedules(tourId?: number, day?: Date, slateTime?: number) {
  return useQuery({
    queryKey: ['schedules', tourId, day],
    queryFn: async () => {
      if (!tourId || !day) throw new Error('Invalid params');
      const response = await getSchedules(tourId, day);
      if (response.status !== 200) {
        throw new Error('Invalid getting data');
      }
      return response.data;
    },
    staleTime: slateTime ?? 2 * 60 * 1000,
    refetchOnWindowFocus: 'always',
    retry: false,
    enabled: !!tourId && !!day
  });
}
