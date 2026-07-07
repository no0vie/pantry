import { test, expect } from '@playwright/test';

// This simple test verifies that the application starts correctly and contains
// key UI elements: a header title, menu items and the "Новый рецепт" button.
// If any element is missing, Playwright's expectation will fail with an
// informative error message indicating which selector was not found.

test('App launches and basic UI elements are present', async ({ page }) => {
  await page.goto('/');

  // Header title (contains the 🍳 emoji)
  const header = page.getByText('🍳 Pantry');
  await expect(header).toBeVisible({ timeout: 5000 });

  // Menu items – "Мои рецепты" and "Список покупок"
  await expect(page.getByRole('menuitem', { name: /Мои рецепты/ }))
    .toBeVisible({ timeout: 3000 });
  await expect(page.getByRole('menuitem', { name: /Список покупок/ }))
    .toBeVisible({ timeout: 3000 });

  // Button to create a new recipe
  await expect(page.getByRole('button', { name: 'Новый рецепт' }))
    .toBeVisible({ timeout: 3000 });
});
