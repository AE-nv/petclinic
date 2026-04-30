import { test, expect } from '@playwright/test';

test.describe('Owners page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/petclinic/owners');
  });

  test('displays all owners on initial load', async ({ page }) => {
    // Verify the page heading
    await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();

    // Verify the owners table is present with expected columns
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Address' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'City' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Telephone' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Pets' })).toBeVisible();

    // Verify a known owner is listed
    await expect(page.getByRole('link', { name: 'George Franklin' })).toBeVisible();
  });

  test('filters owners by last name', async ({ page }) => {
    // Enter a last name to search for
    await page.getByRole('textbox').fill('Davis');
    await page.getByRole('button', { name: 'Find Owner' }).click();

    // Only Davis owners should appear
    await expect(page.getByRole('link', { name: 'Betty Davis' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Harold Davis' })).toBeVisible();

    // Non-Davis owners should not be visible
    await expect(page.getByRole('link', { name: 'George Franklin' })).not.toBeVisible();
  });

  test('shows all owners when search is cleared', async ({ page }) => {
    // Search for a specific last name
    await page.getByRole('textbox').fill('Davis');
    await page.getByRole('button', { name: 'Find Owner' }).click();
    await expect(page.getByRole('link', { name: 'Betty Davis' })).toBeVisible();

    // Clear the search and find all owners again
    await page.getByRole('textbox').fill('');
    await page.getByRole('button', { name: 'Find Owner' }).click();

    // All owners should be visible again
    await expect(page.getByRole('link', { name: 'George Franklin' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Betty Davis' })).toBeVisible();
  });

  test('owner name links navigate to owner detail page', async ({ page }) => {
    // Click on an owner's name link
    await page.getByRole('link', { name: 'George Franklin' }).click();

    // Should navigate to the owner detail page
    await expect(page).toHaveURL(/\/petclinic\/owners\/1/);
  });
});
