import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    loading: false,
    isAdmin: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
}));

vi.mock('../hooks/useCampingTrips', () => ({
  useCampingTrips: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
  })),
  useDeleteTrip: vi.fn(() => ({ mutate: vi.fn() })),
  useUpdateTrip: vi.fn(() => ({ mutate: vi.fn() })),
  useCreateTrip: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

describe('CampingPage', () => {
  it('should render the camping schedule heading', async () => {
    const CampingPage = (await import('./CampingPage')).default;
    render(<CampingPage />);
    expect(screen.getByText('camping_schedule')).toBeInTheDocument();
  });

  it('should show sign in button for unauthenticated users', async () => {
    const CampingPage = (await import('./CampingPage')).default;
    render(<CampingPage />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show empty state when no trips', async () => {
    const CampingPage = (await import('./CampingPage')).default;
    render(<CampingPage />);
    expect(screen.getByText(/no trips scheduled/i)).toBeInTheDocument();
  });
});
