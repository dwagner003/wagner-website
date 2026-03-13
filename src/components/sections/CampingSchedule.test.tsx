import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampingSchedule } from './CampingSchedule';

const mockTrips = [
  {
    id: '1',
    location: 'Rocky Mountain National Park',
    latitude: null,
    longitude: null,
    rec_gov_url: 'https://www.recreation.gov/camping/test',
    start_date: '2026-07-01',
    end_date: '2026-07-03',
    status: 'planned' as const,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    location: 'Great Sand Dunes',
    latitude: null,
    longitude: null,
    rec_gov_url: null,
    start_date: '2026-08-15',
    end_date: '2026-08-17',
    status: 'confirmed' as const,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

vi.mock('../../hooks/useCampingTrips', () => ({
  useCampingTrips: vi.fn(() => ({
    data: mockTrips,
    isLoading: false,
    isError: false,
  })),
  useDeleteTrip: vi.fn(() => ({ mutate: vi.fn() })),
  useUpdateTrip: vi.fn(() => ({ mutate: vi.fn() })),
}));

describe('CampingSchedule', () => {
  it('should render trip cards with location and dates', () => {
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByText('Rocky Mountain National Park')).toBeInTheDocument();
    expect(screen.getByText('Great Sand Dunes')).toBeInTheDocument();
  });

  it('should show status badges', () => {
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByText('planned')).toBeInTheDocument();
    expect(screen.getByText('confirmed')).toBeInTheDocument();
  });

  it('should render rec.gov link when available', () => {
    render(<CampingSchedule isAdmin={false} />);
    const link = screen.getByRole('link', { name: /recreation\.gov/i });
    expect(link).toHaveAttribute('href', 'https://www.recreation.gov/camping/test');
  });

  it('should show section heading', () => {
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByText('camping_schedule')).toBeInTheDocument();
  });

  it('should show edit and delete buttons when admin', () => {
    render(<CampingSchedule isAdmin={true} />);
    expect(screen.getAllByText('Edit')).toHaveLength(2);
    expect(screen.getAllByText('Delete')).toHaveLength(2);
  });

  it('should not show edit and delete buttons when not admin', () => {
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});
