import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CampingAdminBar } from './CampingAdminBar';
import type { User } from '@supabase/supabase-js';

const mockMutate = vi.fn();

vi.mock('../../hooks/useCampingTrips', () => ({
  useCreateTrip: vi.fn(() => ({ mutate: mockMutate, isPending: false })),
}));

const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const adminUser = { email: 'devinwagner003@gmail.com' } as User;
const nonAdminUser = { email: 'other@gmail.com' } as User;

describe('CampingAdminBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('should call onSignIn when sign in button clicked', () => {
    render(
      <CampingAdminBar
        isAdmin={false}
        user={null}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('should show add trip and sign out buttons when admin', () => {
    render(
      <CampingAdminBar
        isAdmin={true}
        user={adminUser}
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
        user={nonAdminUser}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add trip/i })).not.toBeInTheDocument();
  });

  it('should call onSignOut when sign out button clicked (non-admin)', () => {
    render(
      <CampingAdminBar
        isAdmin={false}
        user={nonAdminUser}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should toggle add trip form when button clicked', () => {
    render(
      <CampingAdminBar
        isAdmin={true}
        user={adminUser}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add trip/i }));
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should hide form when cancel clicked', () => {
    render(
      <CampingAdminBar
        isAdmin={true}
        user={adminUser}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add trip/i }));
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByLabelText(/location/i)).not.toBeInTheDocument();
  });

  it('should submit form and call createTrip mutation', () => {
    render(
      <CampingAdminBar
        isAdmin={true}
        user={adminUser}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add trip/i }));
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'New Camp' },
    });
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2026-09-01' },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: '2026-09-03' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /add trip$/i }));
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        location: 'New Camp',
        start_date: '2026-09-01',
        end_date: '2026-09-03',
        status: 'planned',
      }),
      expect.any(Object)
    );
  });

  it('should allow changing status in form', () => {
    render(
      <CampingAdminBar
        isAdmin={true}
        user={adminUser}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add trip/i }));
    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: 'confirmed' },
    });
    expect((screen.getByLabelText(/status/i) as HTMLSelectElement).value).toBe('confirmed');
  });

  it('should allow setting optional rec_gov_url', () => {
    render(
      <CampingAdminBar
        isAdmin={true}
        user={adminUser}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add trip/i }));
    fireEvent.change(screen.getByLabelText(/recreation\.gov url/i), {
      target: { value: 'https://recreation.gov/test' },
    });
    expect((screen.getByLabelText(/recreation\.gov url/i) as HTMLInputElement).value).toBe(
      'https://recreation.gov/test'
    );
  });

  it('should allow setting latitude and longitude', () => {
    render(
      <CampingAdminBar
        isAdmin={true}
        user={adminUser}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add trip/i }));
    fireEvent.change(screen.getByLabelText(/latitude/i), {
      target: { value: '40.3428' },
    });
    fireEvent.change(screen.getByLabelText(/longitude/i), {
      target: { value: '-105.6836' },
    });
    expect((screen.getByLabelText(/latitude/i) as HTMLInputElement).value).toBe('40.3428');
    expect((screen.getByLabelText(/longitude/i) as HTMLInputElement).value).toBe('-105.6836');
  });
});
