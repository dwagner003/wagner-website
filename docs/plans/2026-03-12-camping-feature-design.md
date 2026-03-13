# Camping Schedule Feature — Design Document

## Overview

Add a camping schedule feature to the Wagner portfolio site that lists all camping trips for 2026. Includes a backend with a database for managing trips and auth so only the site owner can add/edit/delete entries.

## Architecture

**Approach:** Vercel Serverless Functions + Supabase (Postgres DB + Auth)

- Single repo — API routes deploy alongside the frontend on Vercel
- Supabase handles both the database and Google OAuth authentication
- Public read access, authenticated write access (single-user admin)

## Database Schema

Supabase Postgres table: `camping_trips`

| Column      | Type         | Notes                                 |
| ----------- | ------------ | ------------------------------------- |
| id          | UUID         | Primary key, auto-generated           |
| location    | TEXT         | e.g. "Rocky Mountain National Park"   |
| latitude    | DECIMAL(9,6) | Nullable, for future map feature      |
| longitude   | DECIMAL(9,6) | Nullable, for future map feature      |
| rec_gov_url | TEXT         | Nullable, recreation.gov listing link |
| start_date  | DATE         |                                       |
| end_date    | DATE         |                                       |
| status      | TEXT         | 'planned' / 'confirmed' / 'completed' |
| created_at  | TIMESTAMPTZ  | Auto-generated                        |
| updated_at  | TIMESTAMPTZ  | Auto-generated                        |

**RLS Policies:**

- SELECT: open to everyone (public page)
- INSERT/UPDATE/DELETE: restricted to owner's authenticated user ID

## API Routes

Vercel serverless functions:

| Method | Route          | Auth     | Description    |
| ------ | -------------- | -------- | -------------- |
| GET    | /api/trips     | Public   | List all trips |
| POST   | /api/trips     | Required | Create a trip  |
| PUT    | /api/trips/:id | Required | Update a trip  |
| DELETE | /api/trips/:id | Required | Delete a trip  |

- GET supports optional `?status=planned` filter
- Protected routes validate Supabase JWT from `Authorization: Bearer <token>` header
- Returns 401 if token is invalid or user is not the owner

## Authentication

**Provider:** Supabase Auth with Google OAuth (Gmail)

**Flow:**

1. Click "Sign In" on the camping page
2. Supabase redirects to Google OAuth
3. Google returns token, Supabase creates session
4. Frontend stores session, shows admin controls
5. API calls include session token in Authorization header

**Access control:**

- Only the owner's email gets write access (RLS policy)
- No signup or user registration — single-user admin
- Session persisted via Supabase JS client (localStorage)

## Frontend Components

New page at `/camping`:

```
src/
  pages/
    CampingPage.tsx              — main page layout
  components/
    sections/
      CampingSchedule.tsx        — trip list sorted by date
      CampingAdminBar.tsx        — sign in + add trip (auth only)
  hooks/
    useAuth.ts                   — Supabase auth state
    useCampingTrips.ts           — React Query CRUD hooks
  services/
    supabase.ts                  — Supabase client init
```

**Public view:** Trip cards with location, dates, status badge, rec.gov link. Styled with existing cyberpunk/synthwave theme.

**Admin view (authenticated):** Add Trip button/modal, edit/delete on each card, sign out.

**Navbar:** Add "Camping" link to existing navigation.

## Environment & Config

**New env vars:**

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only (Vercel env vars)

**New dependency:** `@supabase/supabase-js`

**Vercel config updates:**

- API rewrites for serverless functions
- CSP header updates for Supabase domain

## Supabase Setup Required

1. Create Supabase project
2. Enable Google OAuth provider
3. Create `camping_trips` table with RLS policies
4. Configure env vars locally and in Vercel
