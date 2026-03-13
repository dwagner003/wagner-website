import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const mockGetSession = vi.fn();
const mockSignInWithOAuth = vi.fn();
const mockSignOut = vi.fn();
const mockUnsubscribe = vi.fn();
const mockOnAuthStateChange = vi.fn(() => ({
  data: { subscription: { unsubscribe: mockUnsubscribe } },
}));

vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      signInWithOAuth: mockSignInWithOAuth,
      signOut: mockSignOut,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockSignInWithOAuth.mockResolvedValue({});
    mockSignOut.mockResolvedValue({});
  });

  it('should start with no user', async () => {
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  it('should set isAdmin when user email matches', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { email: 'devinwagner003@gmail.com' } } },
    });
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.user).toEqual({ email: 'devinwagner003@gmail.com' });
  });

  it('should not be admin for other emails', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { email: 'other@gmail.com' } } },
    });
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAdmin).toBe(false);
  });

  it('should subscribe to auth state changes', async () => {
    const { useAuth } = await import('./useAuth');
    renderHook(() => useAuth());
    expect(mockOnAuthStateChange).toHaveBeenCalled();
  });

  it('should unsubscribe on unmount', async () => {
    const { useAuth } = await import('./useAuth');
    const { unmount } = renderHook(() => useAuth());
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should call signInWithOAuth with google provider on signIn', async () => {
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.signIn();
    });
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: expect.stringContaining('/camping') },
    });
  });

  it('should call supabase signOut and clear user on signOut', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { email: 'devinwagner003@gmail.com' } } },
    });
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.user).not.toBeNull());
    await act(async () => {
      await result.current.signOut();
    });
    expect(mockSignOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });

  it('should update user when auth state changes', async () => {
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callback = (mockOnAuthStateChange as any).mock.calls[0][0] as (
      event: string,
      session: unknown
    ) => void;
    act(() => {
      callback('SIGNED_IN', { user: { email: 'devinwagner003@gmail.com' } });
    });
    expect(result.current.user).toEqual({ email: 'devinwagner003@gmail.com' });
  });

  it('should set user to null when auth state changes with no session', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { email: 'devinwagner003@gmail.com' } } },
    });
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.user).not.toBeNull());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callback = (mockOnAuthStateChange as any).mock.calls[0][0] as (
      event: string,
      session: unknown
    ) => void;
    act(() => {
      callback('SIGNED_OUT', null);
    });
    expect(result.current.user).toBeNull();
  });
});
