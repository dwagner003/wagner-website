import { describe, it, expect, vi } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ auth: {}, from: vi.fn() })),
}));

describe('supabase client', () => {
  it('should export a supabase client', async () => {
    const { supabase } = await import('./supabase');
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('should call createClient', async () => {
    const { createClient } = await import('@supabase/supabase-js');
    await import('./supabase');
    expect(createClient).toHaveBeenCalled();
  });
});
