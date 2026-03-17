import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CampingSchedule } from './CampingSchedule';

const mockTrips = [
  {
    id: '1',
    location: 'Rocky Mountain National Park',
    latitude: 40.3428,
    longitude: -105.6836,
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

const mockUseCampingTrips = vi.fn();
const mockDeleteMutate = vi.fn();
const mockUpdateMutate = vi.fn();

vi.mock('./CampingMap', () => ({
  default: ({ trips }: { trips: unknown[] }) => (
    <div data-testid="camping-map">Map with {trips.length} markers</div>
  ),
}));

vi.mock('../../hooks/useCampingTrips', () => ({
  useCampingTrips: (...args: unknown[]) => mockUseCampingTrips(...args),
  useDeleteTrip: vi.fn(() => ({ mutate: mockDeleteMutate })),
  useUpdateTrip: vi.fn(() => ({ mutate: mockUpdateMutate })),
}));

describe('CampingSchedule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCampingTrips.mockReturnValue({
      data: mockTrips,
      isLoading: false,
      isError: false,
    });
  });

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

  it('should show loading skeletons', () => {
    mockUseCampingTrips.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByRole('generic', { busy: true } as never)).toBeInTheDocument();
  });

  it('should show error message', () => {
    mockUseCampingTrips.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByText('Unable to load camping trips.')).toBeInTheDocument();
  });

  it('should show empty state', () => {
    mockUseCampingTrips.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByText('No trips scheduled yet.')).toBeInTheDocument();
  });

  it('should call delete mutation when delete button clicked', () => {
    render(<CampingSchedule isAdmin={true} />);
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(mockDeleteMutate).toHaveBeenCalledWith('1');
  });

  it('should show edit form when edit button clicked', () => {
    render(<CampingSchedule isAdmin={true} />);
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    expect(screen.getByDisplayValue('Rocky Mountain National Park')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should cancel editing', () => {
    render(<CampingSchedule isAdmin={true} />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('should call update mutation on save', () => {
    render(<CampingSchedule isAdmin={true} />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    fireEvent.click(screen.getByText('Save'));
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
      expect.any(Object)
    );
  });

  it('should format date range within same year', () => {
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByText(/Jul 1 - Jul 3, 2026/)).toBeInTheDocument();
  });

  it('should format date range across years', () => {
    mockUseCampingTrips.mockReturnValue({
      data: [
        {
          ...mockTrips[0],
          start_date: '2026-12-30',
          end_date: '2027-01-02',
        },
      ],
      isLoading: false,
      isError: false,
    });
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByText(/Dec 30, 2026 - Jan 2, 2027/)).toBeInTheDocument();
  });

  it('should update edit form fields', () => {
    render(<CampingSchedule isAdmin={true} />);
    fireEvent.click(screen.getAllByText('Edit')[0]);

    const locationInput = screen.getByDisplayValue('Rocky Mountain National Park');
    fireEvent.change(locationInput, { target: { value: 'Updated Park' } });
    expect(screen.getByDisplayValue('Updated Park')).toBeInTheDocument();

    const startInput = screen.getByDisplayValue('2026-07-01');
    fireEvent.change(startInput, { target: { value: '2026-08-01' } });
    expect(screen.getByDisplayValue('2026-08-01')).toBeInTheDocument();

    const endInput = screen.getByDisplayValue('2026-07-03');
    fireEvent.change(endInput, { target: { value: '2026-08-03' } });
    expect(screen.getByDisplayValue('2026-08-03')).toBeInTheDocument();

    const statusSelect = screen.getByDisplayValue('planned');
    fireEvent.change(statusSelect, { target: { value: 'confirmed' } });
    expect(screen.getByDisplayValue('confirmed')).toBeInTheDocument();
  });

  it('should render map when trips with coordinates exist', async () => {
    render(<CampingSchedule isAdmin={false} />);
    const map = await waitFor(() => screen.getByTestId('camping-map'));
    expect(map).toBeInTheDocument();
    expect(map).toHaveTextContent('Map with 1 markers');
  });

  it('should not render map when no trips have coordinates', async () => {
    mockUseCampingTrips.mockReturnValue({
      data: [{ ...mockTrips[1] }],
      isLoading: false,
      isError: false,
    });
    render(<CampingSchedule isAdmin={false} />);
    await waitFor(() => {
      expect(screen.queryByTestId('camping-map')).not.toBeInTheDocument();
    });
  });

  it('should not render map during loading', () => {
    mockUseCampingTrips.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.queryByTestId('camping-map')).not.toBeInTheDocument();
  });

  it('should not render map during error', () => {
    mockUseCampingTrips.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.queryByTestId('camping-map')).not.toBeInTheDocument();
  });

  it('should render edit form with null-safe defaults for all fields', () => {
    // Use a trip with null optional fields to exercise ?? fallbacks
    mockUseCampingTrips.mockReturnValue({
      data: [
        {
          ...mockTrips[1], // Great Sand Dunes has null lat/lng and null rec_gov_url
        },
      ],
      isLoading: false,
      isError: false,
    });
    render(<CampingSchedule isAdmin={true} />);
    fireEvent.click(screen.getByText('Edit'));
    // The edit form should render with empty strings for null fields
    expect(screen.getByDisplayValue('Great Sand Dunes')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-08-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-08-17')).toBeInTheDocument();
  });

  it('should apply visible styles when intersection observer triggers', async () => {
    // Override IntersectionObserver to trigger callback immediately
    const originalIO = window.IntersectionObserver;
    class MockVisibleIO {
      constructor(callback: IntersectionObserverCallback) {
        setTimeout(
          () =>
            callback(
              [{ isIntersecting: true } as IntersectionObserverEntry],
              this as unknown as IntersectionObserver
            ),
          0
        );
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    }
    window.IntersectionObserver = MockVisibleIO as unknown as typeof IntersectionObserver;

    render(<CampingSchedule isAdmin={false} />);

    await waitFor(() => {
      const card = screen.getByText('Rocky Mountain National Park').closest('[class*="opacity"]');
      expect(card?.className).toContain('opacity-100');
    });

    window.IntersectionObserver = originalIO;
  });
});
