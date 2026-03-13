# Camping Schedule Feature — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/camping` page that displays camping trips from a Supabase Postgres DB, with Google OAuth admin auth for CRUD operations.

**Architecture:** Vercel Serverless Functions call Supabase for data. Frontend uses React Query for fetching, Supabase Auth (Google OAuth) for admin login. RLS policies enforce public read / owner-only write.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Supabase (Postgres + Auth), Vercel Serverless Functions, TanStack React Query, Playwright, Vitest

---

### Task 1: Install Supabase dependency and add env vars

**Files:**

- Modify: `package.json`
- Modify: `.env`
- Modify: `.env.production`

**Step 1: Install @supabase/supabase-js**

Run: `npm install @supabase/supabase-js`

**Step 2: Add Supabase env vars to `.env`**

Add to `.env`:

```
VITE_SUPABASE_URL=<placeholder>
VITE_SUPABASE_ANON_KEY=<placeholder>
```

Add to `.env.production`:

```
VITE_SUPABASE_URL=<placeholder>
VITE_SUPABASE_ANON_KEY=<placeholder>
```

Note: `SUPABASE_SERVICE_ROLE_KEY` goes in Vercel env vars only (never in .env files committed to git).

**Step 3: Commit**

```bash
git add package.json package-lock.json .env .env.production
git commit -m "chore: add @supabase/supabase-js and env var placeholders"
```

---

### Task 2: Create Supabase client service

**Files:**

- Create: `src/services/supabase.ts`
- Create: `src/services/supabase.test.ts`

**Step 1: Write the failing test**

```typescript
// src/services/supabase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ auth: {}, from: vi.fn() })),
}));

describe('supabase client', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
  });

  it('should export a supabase client', async () => {
    const { supabase } = await import('./supabase');
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/services/supabase.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/services/supabase.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/services/supabase.ts src/services/supabase.test.ts
git commit -m "feat: add Supabase client service"
```

---

### Task 3: Create CampingTrip type and trips service

**Files:**

- Create: `src/services/trips.ts`
- Create: `src/services/trips.test.ts`

**Step 1: Write the failing test**

```typescript
// src/services/trips.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();

vi.mock('./supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => {
      mockFrom(...args);
      return {
        select: (...sArgs: unknown[]) => {
          mockSelect(...sArgs);
          return {
            order: (...oArgs: unknown[]) => {
              mockOrder(...oArgs);
              return { eq: mockEq, data: [], error: null };
            },
          };
        },
        insert: (...iArgs: unknown[]) => {
          mockInsert(...iArgs);
          return { select: () => ({ single: () => ({ data: iArgs[0]?.[0], error: null }) }) };
        },
        update: (...uArgs: unknown[]) => {
          mockUpdate(...uArgs);
          return {
            eq: () => ({ select: () => ({ single: () => ({ data: uArgs[0], error: null }) }) }),
          };
        },
        delete: (...dArgs: unknown[]) => {
          mockDelete(...dArgs);
          return { eq: () => ({ error: null }) };
        },
      };
    },
  },
}));

describe('trips service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchTrips calls supabase from camping_trips', async () => {
    const { fetchTrips } = await import('./trips');
    await fetchTrips();
    expect(mockFrom).toHaveBeenCalledWith('camping_trips');
    expect(mockOrder).toHaveBeenCalledWith('start_date', { ascending: true });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/services/trips.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
// src/services/trips.ts
import { supabase } from './supabase';

export interface CampingTrip {
  id: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  rec_gov_url: string | null;
  start_date: string;
  end_date: string;
  status: 'planned' | 'confirmed' | 'completed';
  created_at: string;
  updated_at: string;
}

export type CampingTripInsert = Omit<CampingTrip, 'id' | 'created_at' | 'updated_at'>;
export type CampingTripUpdate = Partial<CampingTripInsert>;

export async function fetchTrips(): Promise<CampingTrip[]> {
  const { data, error } = await supabase
    .from('camping_trips')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createTrip(trip: CampingTripInsert): Promise<CampingTrip> {
  const { data, error } = await supabase.from('camping_trips').insert([trip]).select().single();

  if (error) throw error;
  return data;
}

export async function updateTrip(id: string, updates: CampingTripUpdate): Promise<CampingTrip> {
  const { data, error } = await supabase
    .from('camping_trips')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase.from('camping_trips').delete().eq('id', id);

  if (error) throw error;
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/services/trips.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/services/trips.ts src/services/trips.test.ts
git commit -m "feat: add camping trips service with CRUD operations"
```

---

### Task 4: Create useAuth hook

**Files:**

- Create: `src/hooks/useAuth.ts`
- Create: `src/hooks/useAuth.test.ts`

**Step 1: Write the failing test**

```typescript
// src/hooks/useAuth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockGetSession = vi.fn();
const mockSignInWithOAuth = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChange = vi.fn(() => ({
  data: { subscription: { unsubscribe: vi.fn() } },
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
  });

  it('should start with no user and loading true', async () => {
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  it('should expose signIn and signOut functions', async () => {
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useAuth.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'devinwagner003@gmail.com';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/camping' },
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  return { user, loading, isAdmin, signIn, signOut };
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useAuth.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useAuth.ts src/hooks/useAuth.test.ts
git commit -m "feat: add useAuth hook with Google OAuth and admin check"
```

---

### Task 5: Create useCampingTrips React Query hook

**Files:**

- Create: `src/hooks/useCampingTrips.ts`
- Create: `src/hooks/useCampingTrips.test.ts`

**Step 1: Write the failing test**

```typescript
// src/hooks/useCampingTrips.test.ts
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
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useCampingTrips.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
// src/hooks/useCampingTrips.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTrips, createTrip, updateTrip, deleteTrip } from '../services/trips';
import type { CampingTripInsert, CampingTripUpdate } from '../services/trips';

export function useCampingTrips() {
  return useQuery({
    queryKey: ['camping-trips'],
    queryFn: fetchTrips,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trip: CampingTripInsert) => createTrip(trip),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['camping-trips'] }),
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CampingTripUpdate }) =>
      updateTrip(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['camping-trips'] }),
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['camping-trips'] }),
  });
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useCampingTrips.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useCampingTrips.ts src/hooks/useCampingTrips.test.ts
git commit -m "feat: add React Query hooks for camping trips CRUD"
```

---

### Task 6: Create CampingSchedule section component

**Files:**

- Create: `src/components/sections/CampingSchedule.tsx`
- Create: `src/components/sections/CampingSchedule.test.tsx`

**Step 1: Write the failing test**

```typescript
// src/components/sections/CampingSchedule.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../hooks/useCampingTrips', () => ({
  useCampingTrips: vi.fn(() => ({
    data: [
      {
        id: '1',
        location: 'Rocky Mountain National Park',
        latitude: null,
        longitude: null,
        rec_gov_url: 'https://www.recreation.gov/camping/test',
        start_date: '2026-07-01',
        end_date: '2026-07-03',
        status: 'planned',
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
        status: 'confirmed',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ],
    isLoading: false,
    isError: false,
  })),
}));

describe('CampingSchedule', () => {
  it('should render trip cards with location and dates', async () => {
    const { CampingSchedule } = await import('./CampingSchedule');
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByText('Rocky Mountain National Park')).toBeInTheDocument();
    expect(screen.getByText('Great Sand Dunes')).toBeInTheDocument();
  });

  it('should show status badges', async () => {
    const { CampingSchedule } = await import('./CampingSchedule');
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByText('planned')).toBeInTheDocument();
    expect(screen.getByText('confirmed')).toBeInTheDocument();
  });

  it('should render rec.gov link when available', async () => {
    const { CampingSchedule } = await import('./CampingSchedule');
    render(<CampingSchedule isAdmin={false} />);
    const link = screen.getByRole('link', { name: /recreation\.gov/i });
    expect(link).toHaveAttribute('href', 'https://www.recreation.gov/camping/test');
  });

  it('should show empty state when no trips', async () => {
    const { useCampingTrips } = await import('../../hooks/useCampingTrips');
    vi.mocked(useCampingTrips).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useCampingTrips>);
    const { CampingSchedule } = await import('./CampingSchedule');
    render(<CampingSchedule isAdmin={false} />);
    expect(screen.getByText(/no trips scheduled/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/sections/CampingSchedule.test.tsx`
Expected: FAIL — module not found

**Step 3: Write implementation**

Build the component following existing patterns from `GitHubSection.tsx`:

- Use `SectionHeading` for the heading
- Use `useIntersectionObserver` for scroll animations
- Card styling: `bg-[var(--color-bg-card)] backdrop-blur-sm border border-[var(--color-neon-cyan)]/20 rounded-lg`
- Status badge colors: planned=cyan, confirmed=green, completed=purple
- Show loading skeletons, error state, empty state
- Accept `isAdmin` prop — when true, show edit/delete buttons on each card
- Format dates for display (e.g., "Jul 1 - Jul 3, 2026")

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/sections/CampingSchedule.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/sections/CampingSchedule.tsx src/components/sections/CampingSchedule.test.tsx
git commit -m "feat: add CampingSchedule component with trip cards"
```

---

### Task 7: Create CampingAdminBar component (auth + add trip form)

**Files:**

- Create: `src/components/sections/CampingAdminBar.tsx`
- Create: `src/components/sections/CampingAdminBar.test.tsx`

**Step 1: Write the failing test**

```typescript
// src/components/sections/CampingAdminBar.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSignIn = vi.fn();
const mockSignOut = vi.fn();

describe('CampingAdminBar', () => {
  it('should show sign in button when not authenticated', async () => {
    const { CampingAdminBar } = await import('./CampingAdminBar');
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

  it('should show add trip button and sign out when admin', async () => {
    const { CampingAdminBar } = await import('./CampingAdminBar');
    render(
      <CampingAdminBar
        isAdmin={true}
        user={{ email: 'devinwagner003@gmail.com' }}
        loading={false}
        onSignIn={mockSignIn}
        onSignOut={mockSignOut}
      />
    );
    expect(screen.getByRole('button', { name: /add trip/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/sections/CampingAdminBar.test.tsx`
Expected: FAIL — module not found

**Step 3: Write implementation**

Build the admin bar:

- When not authenticated: show a subtle "Sign In" button (styled as secondary/ghost button)
- When authenticated as admin: show "Add Trip" button and "Sign Out" button
- "Add Trip" opens a modal/form with fields: location, start_date, end_date, status, rec_gov_url (optional), latitude (optional), longitude (optional)
- Form uses `useCreateTrip` mutation to submit
- Follow existing styling patterns (font-mono, neon colors, etc.)

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/sections/CampingAdminBar.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/sections/CampingAdminBar.tsx src/components/sections/CampingAdminBar.test.tsx
git commit -m "feat: add CampingAdminBar with auth controls and trip form"
```

---

### Task 8: Create CampingPage and add route

**Files:**

- Create: `src/pages/CampingPage.tsx`
- Create: `src/pages/CampingPage.test.tsx`
- Modify: `src/routes/AppRoutes.tsx`
- Modify: `src/routes/AppRoutes.test.tsx`

**Step 1: Write the failing test for CampingPage**

```typescript
// src/pages/CampingPage.test.tsx
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
}));

describe('CampingPage', () => {
  it('should render the camping schedule heading', async () => {
    const CampingPage = (await import('./CampingPage')).default;
    render(<CampingPage />);
    expect(screen.getByText(/camping_schedule/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/CampingPage.test.tsx`
Expected: FAIL — module not found

**Step 3: Write CampingPage implementation**

```typescript
// src/pages/CampingPage.tsx
import { SectionHeading } from '../components/ui';
import { CampingSchedule } from '../components/sections/CampingSchedule';
import { CampingAdminBar } from '../components/sections/CampingAdminBar';
import { Footer } from '../components/sections/Footer';
import { useAuth } from '../hooks/useAuth';

export default function CampingPage() {
  const { user, loading, isAdmin, signIn, signOut } = useAuth();

  return (
    <>
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading>camping_schedule</SectionHeading>
          <CampingAdminBar
            isAdmin={isAdmin}
            user={user}
            loading={loading}
            onSignIn={signIn}
            onSignOut={signOut}
          />
          <CampingSchedule isAdmin={isAdmin} />
        </div>
      </section>
      <Footer />
    </>
  );
}
```

**Step 4: Add route to AppRoutes.tsx**

Add to `src/routes/AppRoutes.tsx`:

```typescript
import CampingPage from '../pages/CampingPage';
// Add inside Routes:
<Route path="/camping" element={<CampingPage />} />
```

**Step 5: Update AppRoutes test**

Add test case to `src/routes/AppRoutes.test.tsx` to verify `/camping` renders CampingPage.

**Step 6: Run tests to verify they pass**

Run: `npx vitest run src/pages/CampingPage.test.tsx src/routes/AppRoutes.test.tsx`
Expected: PASS

**Step 7: Commit**

```bash
git add src/pages/CampingPage.tsx src/pages/CampingPage.test.tsx src/routes/AppRoutes.tsx src/routes/AppRoutes.test.tsx
git commit -m "feat: add CampingPage and /camping route"
```

---

### Task 9: Add Camping link to Navbar

**Files:**

- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Navbar.test.tsx`

**Step 1: Write the failing test**

Add test to `src/components/layout/Navbar.test.tsx`:

```typescript
it('should have a Camping navigation link', () => {
  // Render Navbar (wrapped in MemoryRouter)
  // Expect link with text "Camping" and href="/camping"
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/Navbar.test.tsx`
Expected: FAIL — no Camping link found

**Step 3: Modify Navbar.tsx**

Add a `Link` to `/camping` in both desktop and mobile nav sections. This should be a React Router `Link` (not a scroll button) since it navigates to a different page. Add it after the existing scroll-to-section buttons.

Desktop nav — add before the GitHub icon:

```tsx
<Link
  to="/camping"
  className="font-mono text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] transition-colors"
>
  Camping
</Link>
```

Mobile nav — add at end of nav links section.

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/layout/Navbar.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Navbar.test.tsx
git commit -m "feat: add Camping link to navbar"
```

---

### Task 10: Update Vercel config and CSP headers

**Files:**

- Modify: `vercel.json`

**Step 1: Update vercel.json**

Update the rewrites — Vercel needs to serve `/api/*` routes as serverless functions, not rewrite them to `index.html`. Add an API rewrite before the SPA catch-all:

```json
"rewrites": [
  { "source": "/api/(.*)", "destination": "/api/$1" },
  { "source": "/(.*)", "destination": "/index.html" }
]
```

Update CSP `connect-src` to allow Supabase:

```
connect-src 'self' https://api.github.com https://*.supabase.co
```

**Step 2: Commit**

```bash
git add vercel.json
git commit -m "chore: update Vercel config for API routes and Supabase CSP"
```

---

### Task 11: Create Vercel serverless API routes

**Files:**

- Create: `api/trips/index.ts` (GET, POST)
- Create: `api/trips/[id].ts` (PUT, DELETE)

**Step 1: Create GET/POST handler**

```typescript
// api/trips/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { status } = req.query;
    let query = supabase.from('camping_trips').select('*').order('start_date', { ascending: true });
    if (typeof status === 'string') {
      query = query.eq('status', status);
    }
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    // Validate auth token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
      .from('camping_trips')
      .insert([req.body])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
```

**Step 2: Create PUT/DELETE handler**

```typescript
// api/trips/[id].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid ID' });

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'PUT') {
    const { data, error } = await supabase
      .from('camping_trips')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('camping_trips').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
```

**Step 3: Install @vercel/node types**

Run: `npm install -D @vercel/node`

**Step 4: Commit**

```bash
git add api/ package.json package-lock.json
git commit -m "feat: add Vercel serverless API routes for camping trips"
```

---

### Task 12: Add Playwright E2E tests for camping page

**Files:**

- Create: `e2e/camping.spec.ts`

**Step 1: Write E2E tests with mocked Supabase**

```typescript
// e2e/camping.spec.ts
import { test, expect } from '@playwright/test';

const mockTrips = [
  {
    id: '1',
    location: 'Rocky Mountain National Park',
    latitude: 40.3428,
    longitude: -105.6836,
    rec_gov_url: 'https://www.recreation.gov/camping/campgrounds/123',
    start_date: '2026-07-01',
    end_date: '2026-07-03',
    status: 'confirmed',
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
    status: 'planned',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

test.describe('Camping Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Supabase API calls
    await page.route('**/rest/v1/camping_trips**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockTrips),
      });
    });
    await page.goto('/camping');
  });

  test('should display camping schedule heading', async ({ page }) => {
    await expect(page.getByText('camping_schedule')).toBeVisible();
  });

  test('should display trip cards', async ({ page }) => {
    await expect(page.getByText('Rocky Mountain National Park')).toBeVisible();
    await expect(page.getByText('Great Sand Dunes')).toBeVisible();
  });

  test('should show status badges on trips', async ({ page }) => {
    await expect(page.getByText('confirmed')).toBeVisible();
    await expect(page.getByText('planned')).toBeVisible();
  });

  test('should show sign in button for unauthenticated users', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should not show admin controls for unauthenticated users', async ({ page }) => {
    await expect(page.getByRole('button', { name: /add trip/i })).not.toBeVisible();
  });

  test('should link to recreation.gov when available', async ({ page }) => {
    const recLink = page.getByRole('link', { name: /recreation\.gov/i }).first();
    await expect(recLink).toHaveAttribute('href', /recreation\.gov/);
  });
});

test.describe('Camping Page - Empty State', () => {
  test('should show empty state when no trips', async ({ page }) => {
    await page.route('**/rest/v1/camping_trips**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
    await page.goto('/camping');
    await expect(page.getByText(/no trips scheduled/i)).toBeVisible();
  });
});
```

**Step 2: Run E2E tests**

Run: `npx playwright test e2e/camping.spec.ts --project=chromium`
Expected: PASS

**Step 3: Commit**

```bash
git add e2e/camping.spec.ts
git commit -m "test: add Playwright E2E tests for camping page"
```

---

### Task 13: Export new components from barrel files and update CLAUDE.md

**Files:**

- Modify: `src/components/sections/index.ts` (if exists, add exports)
- Modify: `CLAUDE.md` — add camping feature docs to Architecture section

**Step 1: Update exports**

Ensure `CampingSchedule` and `CampingAdminBar` are exported from `src/components/sections/index.ts`.

**Step 2: Update CLAUDE.md**

Add to the Architecture section:

- `pages/CampingPage.tsx` — Camping schedule page with admin auth
- `services/supabase.ts` — Supabase client
- `services/trips.ts` — Camping trips CRUD
- `hooks/useAuth.ts` — Supabase Google OAuth
- `hooks/useCampingTrips.ts` — React Query hooks for trips
- `api/trips/` — Vercel serverless functions

**Step 3: Commit**

```bash
git add src/components/sections/index.ts CLAUDE.md
git commit -m "docs: update exports and CLAUDE.md for camping feature"
```

---

### Task 14: Supabase project setup (manual/guided)

This task is manual — requires browser interaction with Supabase dashboard.

**Step 1: Create Supabase project**

- Go to https://supabase.com/dashboard
- Create new project (name: "wagner-website" or similar)
- Note the project URL and anon key

**Step 2: Create camping_trips table**

Run in Supabase SQL editor:

```sql
CREATE TABLE camping_trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  rec_gov_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planned', 'confirmed', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE camping_trips ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read" ON camping_trips FOR SELECT USING (true);

-- Owner-only write access (replace with your Supabase user ID after first login)
-- Temporarily allow all authenticated users, then restrict to your ID
CREATE POLICY "Admin insert" ON camping_trips FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update" ON camping_trips FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete" ON camping_trips FOR DELETE TO authenticated USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_camping_trips_updated_at
  BEFORE UPDATE ON camping_trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Step 3: Enable Google OAuth**

- In Supabase dashboard: Authentication > Providers > Google
- Enable and configure with Google Cloud OAuth credentials
- Set redirect URL to `https://devinwagner.tech/camping`

**Step 4: Update env vars**

- Update `.env` and `.env.production` with real Supabase URL and anon key
- Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables

**Step 5: Commit env var updates (not the service role key)**

```bash
git add .env .env.production
git commit -m "chore: add Supabase project credentials"
```
