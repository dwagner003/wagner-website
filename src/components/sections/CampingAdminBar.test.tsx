import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampingAdminBar } from './CampingAdminBar';
import type { User } from '@supabase/supabase-js';

vi.mock('../../hooks/useCampingTrips', () => ({
  useCreateTrip: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

const mockSignIn = vi.fn();
const mockSignOut = vi.fn();

describe('CampingAdminBar', () => {
  it('should show sign in button when not authenticated', () => {
    render(
      <CampingAdminBar
        isAdmin={false}
        user={null}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show add trip and sign out buttons when admin', () => {
    render(
      <CampingAdminBar
        isAdmin={true}
        user={{ email: 'devinwagner003@gmail.com' } as User}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    expect(screen.getByRole('button', { name: /add trip/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('should render nothing when loading', () => {
    const { container } = render(
      <CampingAdminBar
        isAdmin={false}
        user={null}
        loading={true}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    expect(container.innerHTML).toBe('');
  });

  it('should show sign out for non-admin authenticated user', () => {
    render(
      <CampingAdminBar
        isAdmin={false}
        user={{ email: 'other@gmail.com' } as User}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add trip/i })).not.toBeInTheDocument();
  });
});
