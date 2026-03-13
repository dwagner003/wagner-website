import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const mockFetchTrips = vi.fn().mockResolvedValue([
  {
    id: '1',
    location: 'Test Camp',
    latitude: null,
    longitude: null,
    rec_gov_url: null,
    start_date: '2026-07-01',
    end_date: '2026-07-03',
    status: 'planned',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]);
const mockCreateTrip = vi.fn().mockResolvedValue({ id: '2', location: 'New Camp' });
const mockUpdateTrip = vi.fn().mockResolvedValue({ id: '1', location: 'Updated' });
const mockDeleteTrip = vi.fn().mockResolvedValue(undefined);

vi.mock('../services/trips', () => ({
  fetchTrips: (...args: unknown[]) => mockFetchTrips(...args),
  createTrip: (...args: unknown[]) => mockCreateTrip(...args),
  updateTrip: (...args: unknown[]) => mockUpdateTrip(...args),
  deleteTrip: (...args: unknown[]) => mockDeleteTrip(...args),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useCampingTrips', () => {
  it('should fetch trips', async () => {
    const { useCampingTrips } = await import('./useCampingTrips');
    const { result } = renderHook(() => useCampingTrips(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.data).toHaveLength(1));
    expect(result.current.data?.[0].location).toBe('Test Camp');
  });

  it('should create a trip via useCreateTrip', async () => {
    const { useCreateTrip } = await import('./useCampingTrips');
    const { result } = renderHook(() => useCreateTrip(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      result.current.mutate({
        location: 'New Camp',
        latitude: null,
        longitude: null,
        rec_gov_url: null,
        start_date: '2026-09-01',
        end_date: '2026-09-03',
        status: 'planned',
      });
    });
    await waitFor(() => expect(mockCreateTrip).toHaveBeenCalled());
  });

  it('should update a trip via useUpdateTrip', async () => {
    const { useUpdateTrip } = await import('./useCampingTrips');
    const { result } = renderHook(() => useUpdateTrip(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      result.current.mutate({ id: '1', updates: { location: 'Updated' } });
    });
    await waitFor(() => expect(mockUpdateTrip).toHaveBeenCalledWith('1', { location: 'Updated' }));
  });

  it('should delete a trip via useDeleteTrip', async () => {
    const { useDeleteTrip } = await import('./useCampingTrips');
    const { result } = renderHook(() => useDeleteTrip(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      result.current.mutate('1');
    });
    await waitFor(() => expect(mockDeleteTrip).toHaveBeenCalledWith('1'));
  });
});
