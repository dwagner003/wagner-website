import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should display hero section on mobile', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('~/devin-wagner')).toBeVisible();
    await expect(page.getByText('scroll to explore')).toBeVisible();
  });

  test('should display skills in a readable format on mobile', async ({ page }) => {
    await page.goto('/');

    const skillsHeading = page.getByRole('heading', { name: /tech_stack/i });
    await skillsHeading.scrollIntoViewIfNeeded();

    // Skills should be visible and not cut off (use role heading to be specific)
    await expect(page.getByRole('heading', { name: 'React' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'TypeScript' })).toBeVisible();
  });

  test('should display experience timeline on mobile', async ({ page }) => {
    await page.goto('/');

    const experienceHeading = page.getByRole('heading', { name: /experience/i });
    await experienceHeading.scrollIntoViewIfNeeded();

    await expect(page.getByText('Senior Software Engineer')).toBeVisible();
    await expect(page.getByText('AbsenceSoft').first()).toBeVisible();
  });

  test('should have accessible touch targets for links', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    const githubLink = footer.getByLabel('GitHub');
    const linkedinLink = footer.getByLabel('LinkedIn');

    // Links should be visible and tappable
    await expect(githubLink).toBeVisible();
    await expect(linkedinLink).toBeVisible();

    // Check they have reasonable touch target size (at least 40x40)
    const githubBox = await githubLink.boundingBox();
    expect(githubBox?.width).toBeGreaterThanOrEqual(40);
    expect(githubBox?.height).toBeGreaterThanOrEqual(40);
  });
});

test.describe('Tablet Responsiveness', () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // iPad

  test('should display all sections properly on tablet', async ({ page }) => {
    await page.goto('/');

    // Hero
    await expect(page.getByText('~/devin-wagner')).toBeVisible();

    // Skills
    const skillsHeading = page.getByRole('heading', { name: /tech_stack/i });
    await skillsHeading.scrollIntoViewIfNeeded();
    await expect(skillsHeading).toBeVisible();

    // Experience
    const experienceHeading = page.getByRole('heading', { name: /experience/i });
    await experienceHeading.scrollIntoViewIfNeeded();
    await expect(experienceHeading).toBeVisible();

    // Footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(page.getByText('$ exit')).toBeVisible();
  });
});
