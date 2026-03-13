import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('../services/trips', () => ({
  fetchTrips: vi.fn().mockResolvedValue([
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
  ]),
  createTrip: vi.fn(),
  updateTrip: vi.fn(),
  deleteTrip: vi.fn(),
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

  it('should export mutation hooks', async () => {
    const { useCreateTrip, useUpdateTrip, useDeleteTrip } = await import('./useCampingTrips');
    const { result: createResult } = renderHook(() => useCreateTrip(), {
      wrapper: createWrapper(),
    });
    const { result: updateResult } = renderHook(() => useUpdateTrip(), {
      wrapper: createWrapper(),
    });
    const { result: deleteResult } = renderHook(() => useDeleteTrip(), {
      wrapper: createWrapper(),
    });
    expect(createResult.current.mutate).toBeDefined();
    expect(updateResult.current.mutate).toBeDefined();
    expect(deleteResult.current.mutate).toBeDefined();
  });
});
