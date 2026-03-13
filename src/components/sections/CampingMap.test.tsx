import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CampingMap from './CampingMap';
import type { ReactNode } from 'react';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <div
      data-testid="map-container"
      role={props.role as string}
      aria-label={props['aria-label'] as string}
    >
      {children}
    </div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
  useMap: () => ({ fitBounds: vi.fn() }),
}));

vi.mock('leaflet', () => {
  const icon = vi.fn(() => ({}));
  const latLngBounds = vi.fn(() => ({ isValid: () => true }));
  return { default: { icon, latLngBounds }, icon, latLngBounds };
});

const tripsWithCoords = [
  {
    id: '1',
    location: 'Rocky Mountain',
    latitude: 40.34,
    longitude: -105.68,
    start_date: '2026-07-01',
    end_date: '2026-07-03',
    status: 'confirmed' as const,
    rec_gov_url: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    location: 'Great Sand Dunes',
    latitude: 37.73,
    longitude: -105.51,
    start_date: '2026-08-15',
    end_date: '2026-08-17',
    status: 'planned' as const,
    rec_gov_url: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    location: 'Rocky Mountain',
    latitude: 40.34,
    longitude: -105.68,
    start_date: '2026-09-10',
    end_date: '2026-09-12',
    status: 'planned' as const,
    rec_gov_url: null,
    created_at: '',
    updated_at: '',
  },
];

describe('CampingMap', () => {
  it('should render map container with a11y attributes', () => {
    render(<CampingMap trips={tripsWithCoords} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    const wrapper = screen.getByRole('img', { name: 'Map showing camping trip locations' });
    expect(wrapper).toBeInTheDocument();
  });

  it('should render one marker per unique location', () => {
    render(<CampingMap trips={tripsWithCoords} />);
    // 3 trips but 2 unique locations (Rocky Mountain appears twice)
    expect(screen.getAllByTestId('marker')).toHaveLength(2);
  });

  it('should show location in popup', () => {
    render(<CampingMap trips={tripsWithCoords} />);
    expect(screen.getByText('Rocky Mountain')).toBeInTheDocument();
    expect(screen.getByText('Great Sand Dunes')).toBeInTheDocument();
  });

  it('should show all date ranges for grouped trips in popup', () => {
    render(<CampingMap trips={tripsWithCoords} />);
    // Rocky Mountain has two trips
    expect(screen.getByText(/Jul 1 - Jul 3, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Sep 10 - Sep 12, 2026/)).toBeInTheDocument();
  });

  it('should show status in popup', () => {
    render(<CampingMap trips={tripsWithCoords} />);
    expect(screen.getAllByText('confirmed')).toHaveLength(1);
    expect(screen.getAllByText('planned')).toHaveLength(2);
  });

  it('should render nothing when trips array is empty', () => {
    const { container } = render(<CampingMap trips={[]} />);
    expect(container.innerHTML).toBe('');
  });
});
