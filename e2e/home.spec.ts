import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display hero section', async ({ page }) => {
    // Terminal window should be visible
    await expect(page.getByText('~/devin-wagner')).toBeVisible();

    // Terminal prompt should be present
    await expect(page.locator('text=$').first()).toBeVisible();
  });

  test('should show terminal typing animation', async ({ page }) => {
    // Wait for typing animation to start showing content
    await expect(page.locator('#hero').getByText('Devin Wagner')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Full Stack Software Engineer')).toBeVisible({ timeout: 10000 });
  });

  test('should display skills section with technologies', async ({ page }) => {
    // Scroll to skills section using the heading
    const skillsHeading = page.getByRole('heading', { name: /tech_stack/i });
    await skillsHeading.scrollIntoViewIfNeeded();

    await expect(skillsHeading).toBeVisible();
    // Use role heading to be more specific about skill names
    await expect(page.getByRole('heading', { name: 'React' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'TypeScript' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'C#' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '.NET' })).toBeVisible();
  });

  test('should display experience section', async ({ page }) => {
    const experienceHeading = page.getByRole('heading', { name: /experience/i });
    await experienceHeading.scrollIntoViewIfNeeded();

    await expect(experienceHeading).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Senior Software Engineer', exact: true })
    ).toBeVisible();
    await expect(page.getByText('AbsenceSoft').first()).toBeVisible();
  });

  test('should display all experience roles', async ({ page }) => {
    const experienceSection = page.locator('#experience');
    await experienceSection.scrollIntoViewIfNeeded();

    await expect(
      page.getByRole('heading', { name: 'Senior Software Engineer', exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Software Engineer', exact: true })
    ).toBeVisible();
    await expect(page.getByText('Integration Engineer')).toBeVisible();
    await expect(page.getByText('Associate Software Developer')).toBeVisible();
    await expect(page.getByText('Billtrust')).toBeVisible();
  });

  test('should not display bullet points for Senior Software Engineer', async ({ page }) => {
    const experienceSection = page.locator('#experience');
    await experienceSection.scrollIntoViewIfNeeded();

    // Senior SWE card is the first card in the experience section
    const cards = experienceSection.locator('[class*="bg-[var(--color-bg-card)]"]');
    const seniorCard = cards.first();

    // Should have the title but no list items
    await expect(seniorCard.getByText('Senior Software Engineer')).toBeVisible();
    await expect(seniorCard.locator('li')).toHaveCount(0);
  });

  test('should display bullet points for other experience roles', async ({ page }) => {
    const experienceSection = page.locator('#experience');
    await experienceSection.scrollIntoViewIfNeeded();

    const cards = experienceSection.locator('[class*="bg-[var(--color-bg-card)]"]');

    // Software Engineer card (2nd) should have highlights
    const sweCard = cards.nth(1);
    await expect(sweCard.getByText('Software Engineer')).toBeVisible();
    await expect(sweCard.locator('li').first()).toBeVisible();

    // Integration Engineer card (3rd) should have highlights
    const intCard = cards.nth(2);
    await expect(intCard.getByText('Integration Engineer')).toBeVisible();
    await expect(intCard.locator('li').first()).toBeVisible();

    // Associate Software Developer card (4th) should have highlights
    const asdCard = cards.nth(3);
    await expect(asdCard.getByText('Associate Software Developer')).toBeVisible();
    await expect(asdCard.locator('li').first()).toBeVisible();
  });

  test('should display github stats section with data or error fallback', async ({ page }) => {
    const githubSection = page.locator('#github');
    await githubSection.scrollIntoViewIfNeeded();

    await expect(page.getByText('github_stats')).toBeVisible();

    // Wait for the loading state to resolve (either data or error)
    await page.waitForTimeout(3000);

    // Should show either real stat numbers or an error fallback — never loading indicators
    const loadingDots = githubSection.getByText('...').first();
    const loadingRepos = githubSection.getByText('Loading repositories...');
    await expect(loadingDots).not.toBeVisible({ timeout: 10000 });
    await expect(loadingRepos).not.toBeVisible();

    // Should show either stat values or a link to the GitHub profile
    const hasStats = await githubSection
      .getByText('Repositories')
      .isVisible()
      .catch(() => false);
    const hasError = await githubSection
      .getByText('View profile on GitHub')
      .isVisible()
      .catch(() => false);
    expect(hasStats || hasError).toBe(true);
  });

  test('should have working social links in footer', async ({ page }) => {
    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    const githubLink = footer.getByLabel('GitHub');
    const linkedinLink = footer.getByLabel('LinkedIn');

    await expect(githubLink).toHaveAttribute('href', 'https://github.com/dwagner003');
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/dtwagner55/');

    // Links should open in new tab
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
  });

  test('should display footer with copyright', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    const year = new Date().getFullYear();
    await expect(page.getByText(`© ${year} Devin Wagner`)).toBeVisible();
    await expect(page.getByText('$ exit')).toBeVisible();
  });
});

test.describe('SEO & Accessibility', () => {
  test('should have an h1 heading for screen readers', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1');
    await expect(h1).toBeAttached();
    await expect(h1).toContainText('Devin Wagner');
  });

  test('should show a 404 page for unknown routes', async ({ page }) => {
    await page.goto('/some-nonexistent-page');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('No such file or directory')).toBeVisible();
    const homeLink = page.getByRole('link', { name: 'cd ~' });
    await expect(homeLink).toHaveAttribute('href', '/');
  });
});

test.describe('Navigation', () => {
  test('should have navbar visible', async ({ page }) => {
    await page.goto('/');

    // Navbar should be present - use first() since there may be mobile/desktop versions
    const nav = page.getByRole('navigation').first();
    await expect(nav).toBeVisible();
  });

  test('should have a skip-to-content link for keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Skip link should exist but be visually hidden
    const skipLink = page.getByRole('link', { name: 'Skip to content' }).first();
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // Main content should have the target id
    const main = page.locator('#main-content');
    await expect(main).toBeAttached();
  });

  test('should scroll smoothly between sections', async ({ page }) => {
    await page.goto('/');

    // Start at top
    await page.waitForTimeout(500);

    // Scroll down
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(500);

    // Should have scrolled
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});

test.describe('Konami Code Easter Egg', () => {
  test('should toggle theme when Konami Code is entered', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial background color
    const initialBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    // Enter Konami Code: Up Up Down Down Left Right Left Right B A
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('KeyB');
    await page.keyboard.press('KeyA');

    // Wait for transition
    await page.waitForTimeout(600);

    // Background should have changed (synthwave theme)
    const newBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    expect(newBg).not.toBe(initialBg);

    // Check data-theme attribute
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('synthwave');
  });

  test('should persist theme in localStorage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Enter Konami Code
    const konamiKeys = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'KeyB',
      'KeyA',
    ];
    for (const key of konamiKeys) {
      await page.keyboard.press(key);
    }

    await page.waitForTimeout(600);

    // Check localStorage
    const storedTheme = await page.evaluate(() => localStorage.getItem('wagner-theme'));
    expect(storedTheme).toBe('synthwave');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Theme should persist
    const themeAfterReload = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(themeAfterReload).toBe('synthwave');
  });
});
