import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTrips, createTrip, updateTrip, deleteTrip } from '../services/trips';
import type { CampingTripInsert, CampingTripUpdate } from '../services/trips';

export function useCampingTrips() {
  return useQuery({
    queryKey: ['camping-trips'],
    queryFn: fetchTrips,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trip: CampingTripInsert) => createTrip(trip),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['camping-trips'] }),
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CampingTripUpdate }) =>
      updateTrip(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['camping-trips'] }),
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['camping-trips'] }),
  });
}
