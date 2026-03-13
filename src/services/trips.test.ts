import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTrips, createTrip, updateTrip, deleteTrip } from './trips';
import type { CampingTripInsert } from './trips';

const mockData = [
  {
    id: '1',
    location: 'Test Camp',
    latitude: null,
    longitude: null,
    rec_gov_url: null,
    start_date: '2026-07-01',
    end_date: '2026-07-03',
    status: 'planned' as const,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

let shouldError = false;

const mockSingle = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();

vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: (...args: unknown[]) => {
          mockOrder(...args);
          return shouldError
            ? { data: null, error: { message: 'fetch error' } }
            : { data: mockData, error: null };
        },
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: () => {
            mockSingle();
            return shouldError
              ? { data: null, error: { message: 'insert error' } }
              : { data: mockData[0], error: null };
          },
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: () => {
              mockSingle();
              return shouldError
                ? { data: null, error: { message: 'update error' } }
                : { data: mockData[0], error: null };
            },
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: (...args: unknown[]) => {
          mockEq(...args);
          return shouldError ? { error: { message: 'delete error' } } : { error: null };
        },
      })),
    })),
  },
}));

describe('trips service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    shouldError = false;
  });

  it('fetchTrips returns trips sorted by start_date', async () => {
    const result = await fetchTrips();
    expect(result).toEqual(mockData);
    expect(mockOrder).toHaveBeenCalledWith('start_date', { ascending: true });
  });

  it('fetchTrips throws on error', async () => {
    shouldError = true;
    await expect(fetchTrips()).rejects.toEqual({ message: 'fetch error' });
  });

  it('createTrip inserts and returns a trip', async () => {
    const newTrip: CampingTripInsert = {
      location: 'Test Camp',
      latitude: null,
      longitude: null,
      rec_gov_url: null,
      start_date: '2026-07-01',
      end_date: '2026-07-03',
      status: 'planned',
    };
    const result = await createTrip(newTrip);
    expect(result).toEqual(mockData[0]);
    expect(mockSingle).toHaveBeenCalled();
  });

  it('createTrip throws on error', async () => {
    shouldError = true;
    const newTrip: CampingTripInsert = {
      location: 'Test',
      latitude: null,
      longitude: null,
      rec_gov_url: null,
      start_date: '2026-07-01',
      end_date: '2026-07-03',
      status: 'planned',
    };
    await expect(createTrip(newTrip)).rejects.toEqual({ message: 'insert error' });
  });

  it('updateTrip updates and returns a trip', async () => {
    const result = await updateTrip('1', { location: 'Updated' });
    expect(result).toEqual(mockData[0]);
    expect(mockSingle).toHaveBeenCalled();
  });

  it('updateTrip throws on error', async () => {
    shouldError = true;
    await expect(updateTrip('1', { location: 'Updated' })).rejects.toEqual({
      message: 'update error',
    });
  });

  it('deleteTrip deletes a trip', async () => {
    await deleteTrip('1');
    expect(mockEq).toHaveBeenCalledWith('id', '1');
  });

  it('deleteTrip throws on error', async () => {
    shouldError = true;
    await expect(deleteTrip('1')).rejects.toEqual({ message: 'delete error' });
  });
});
