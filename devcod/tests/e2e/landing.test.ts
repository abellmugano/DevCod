import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if main heading exists
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation links
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount({ min: 1 });
  });
});

test.describe('Dashboard', () => {
  test('should load dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Dashboard should be accessible
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display dashboard title', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for dashboard heading or title
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });
});
