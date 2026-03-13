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
    await page.route('**/rest/v1/camping_trips**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockTrips),
      });
    });
    // Mock Supabase auth session check
    await page.route('**/auth/v1/session**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { session: null } }),
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
    await page.route('**/auth/v1/session**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { session: null } }),
      });
    });
    await page.goto('/camping');
    await expect(page.getByText(/no trips scheduled/i)).toBeVisible();
  });
});

test.describe('Camping Page - Navigation', () => {
  test('should have camping link in navbar', async ({ page }) => {
    await page.goto('/');
    const campingLink = page.getByRole('link', { name: 'Camping' }).first();
    await expect(campingLink).toBeVisible();
    await expect(campingLink).toHaveAttribute('href', '/camping');
  });
});
