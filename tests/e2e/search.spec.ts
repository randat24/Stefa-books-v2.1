import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/books');
    await page.waitForLoadState('networkidle');
  });

  test('should display search interface', async ({ page }) => {
    // Check search input
    await expect(page.getByPlaceholder('Пошук книг за назвою, автором, категорією...')).toBeVisible();
    
    // Check filter button
    await expect(page.getByTitle('Показати каталог фільтрів')).toBeVisible();
    
    // Check category filters
    await expect(page.getByText('Дитяча література')).toBeVisible();
  });

  test('should perform basic search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Пошук книг за назвою, автором, категорією...');
    
    // Type search query
    await searchInput.fill('Алиса');
    
    // Wait for search results
    await page.waitForTimeout(500);
    
    // Should show search results
    await expect(page.getByText(/результатів пошуку/)).toBeVisible();
    
    // Should display book cards
    await expect(page.locator('[data-testid="book-card"]').first()).toBeVisible();
  });

  test('should clear search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Пошук книг за назвою, автором, категорією...');
    
    // Perform search
    await searchInput.fill('Алиса');
    await page.waitForTimeout(500);
    
    // Clear search using X button
    await page.getByRole('button', { name: 'Clear search' }).click();
    
    // Input should be empty
    await expect(searchInput).toHaveValue('');
    
    // Should show all books again
    await expect(page.getByText(/з \d+ книг/)).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    // Click on a category filter
    await page.getByText('Дитяча література').first().click();
    
    // Should show filtered results
    await expect(page.getByText(/з \d+ книг/)).toBeVisible();
    
    // Category should be highlighted as active
    await expect(page.getByText('Дитяча література').first()).toHaveClass(/border-accent/);
  });

  test('should filter by author', async ({ page }) => {
    // Find and click first author filter
    const authorFilter = page.locator('button').filter({ hasText: /^[А-Яа-яіїєІЇЄ\s\-\.]+$/ }).first();
    await authorFilter.click();
    
    // Should show filtered results
    await expect(page.getByText(/з \d+ книг/)).toBeVisible();
    
    // Author should be highlighted as active
    await expect(authorFilter).toHaveClass(/border-blue-500/);
  });

  test('should combine search and filters', async ({ page }) => {
    // Apply category filter first
    await page.getByText('Дитяча література').first().click();
    await page.waitForTimeout(300);
    
    // Then search within filtered results
    const searchInput = page.getByPlaceholder('Пошук книг за назвою, автором, категорією...');
    await searchInput.fill('пригод');
    await page.waitForTimeout(500);
    
    // Should show combined results
    await expect(page.getByText(/результатів пошуку/)).toBeVisible();
  });

  test('should show "no results" message', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Пошук книг за назвою, автором, категорією...');
    
    // Search for non-existent book
    await searchInput.fill('неіснуючакнига123');
    await page.waitForTimeout(500);
    
    // Should show no results message
    await expect(page.getByText('Нічого не знайдено')).toBeVisible();
    await expect(page.getByText('Спробуйте змінити запит або скористайтеся фільтрами')).toBeVisible();
  });

  test('should clear all filters', async ({ page }) => {
    // Apply multiple filters
    await page.getByText('Дитяча література').first().click();
    await page.waitForTimeout(300);
    
    const authorFilter = page.locator('button').filter({ hasText: /^[А-Яа-яіїєІЇЄ\s\-\.]+$/ }).first();
    await authorFilter.click();
    await page.waitForTimeout(300);
    
    // Clear all filters
    await page.getByText('Очистити').click();
    
    // Should show all books
    await expect(page.getByText(/з \d+ книг/)).toBeVisible();
    
    // Filters should not be active
    await expect(page.getByText('Дитяча література').first()).not.toHaveClass(/border-accent/);
  });

  test('should handle URL search parameters', async ({ page }) => {
    // Navigate with search parameter
    await page.goto('/books?search=Алиса');
    await page.waitForLoadState('networkidle');
    
    // Search input should be filled
    await expect(page.getByPlaceholder('Пошук книг за назвою, автором, категорією...')).toHaveValue('Алиса');
    
    // Should show search results
    await expect(page.getByText(/результатів пошуку/)).toBeVisible();
  });

  test('should handle category URL parameters', async ({ page }) => {
    // Navigate with category parameter
    await page.goto('/books?category=Дитяча%20література');
    await page.waitForLoadState('networkidle');
    
    // Category filter should be active
    await expect(page.getByText('Дитяча література').first()).toHaveClass(/border-accent/);
    
    // Should show filtered results
    await expect(page.getByText(/з \d+ книг/)).toBeVisible();
  });
});

test.describe('Search - Filter Popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/books');
    await page.waitForLoadState('networkidle');
  });

  test('should open filter popup', async ({ page }) => {
    // Click filter button
    await page.getByTitle('Показати каталог фільтрів').click();
    
    // Filter popup should open
    await expect(page.getByText('Каталог')).toBeVisible();
    await expect(page.getByText('Художня література')).toBeVisible();
    
    // Should show category structure
    await expect(page.getByText('Сучасна проза')).toBeVisible();
    await expect(page.getByText('Класична література')).toBeVisible();
  });

  test('should close filter popup', async ({ page }) => {
    // Open popup
    await page.getByTitle('Показати каталог фільтрів').click();
    await expect(page.getByText('Каталог')).toBeVisible();
    
    // Close with X button
    await page.locator('button').filter({ hasText: /×/ }).click();
    
    // Popup should be closed
    await expect(page.getByText('Каталог')).not.toBeVisible();
  });

  test('should close popup with Escape key', async ({ page }) => {
    // Open popup
    await page.getByTitle('Показати каталог фільтрів').click();
    await expect(page.getByText('Каталог')).toBeVisible();
    
    // Close with Escape
    await page.keyboard.press('Escape');
    
    // Popup should be closed
    await expect(page.getByText('Каталог')).not.toBeVisible();
  });

  test('should navigate to category from popup', async ({ page }) => {
    // Open popup
    await page.getByTitle('Показати каталог фільтрів').click();
    
    // Click on a category
    await page.getByText('Сучасна проза').click();
    
    // Should navigate to books page with category filter
    await expect(page).toHaveURL(/\/books\?category=/);
    
    // Popup should be closed
    await expect(page.getByText('Каталог')).not.toBeVisible();
  });

  test('should show all categories button', async ({ page }) => {
    // Open popup
    await page.getByTitle('Показати каталог фільтрів').click();
    
    // Click "Показати все"
    await page.getByText('Показати все').click();
    
    // Should navigate to books page
    await expect(page).toHaveURL('/books');
    
    // Popup should be closed
    await expect(page.getByText('Каталог')).not.toBeVisible();
  });
});

test.describe('Search - Header Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open header search modal', async ({ page }) => {
    // Click search button in header
    await page.getByRole('button', { name: 'Пошук книг' }).click();
    
    // Search modal should open
    await expect(page.getByPlaceholder('Пошук книг за назвою, автором, категорією...')).toBeVisible();
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
  });

  test('should perform search in header modal', async ({ page }) => {
    // Open search modal
    await page.getByRole('button', { name: 'Пошук книг' }).click();
    
    // Type search query
    await page.getByPlaceholder('Пошук книг за назвою, автором, категорією...').fill('Алиса');
    
    // Should show search results
    await expect(page.getByText('Книжки')).toBeVisible();
    await expect(page.getByText('Категорії')).toBeVisible();
    await expect(page.getByText('Автори')).toBeVisible();
  });

  test('should navigate to full results', async ({ page }) => {
    // Open search modal
    await page.getByRole('button', { name: 'Пошук книг' }).click();
    
    // Type search query
    await page.getByPlaceholder('Пошук книг за назвою, автором, категорією...').fill('Алиса');
    
    // Click "Усі результати"
    await page.getByText('Усі результати').click();
    
    // Should navigate to books page with search
    await expect(page).toHaveURL(/\/books\?search=Алиса/);
    
    // Modal should be closed
    await expect(page.locator('.fixed.inset-0.z-50')).not.toBeVisible();
  });

  test('should navigate to book detail from header search', async ({ page }) => {
    // Open search modal
    await page.getByRole('button', { name: 'Пошук книг' }).click();
    
    // Type search query
    await page.getByPlaceholder('Пошук книг за назвою, автором, категорією...').fill('Алиса');
    
    // Click on first book result
    const bookResult = page.locator('[data-testid="search-book-result"]').first();
    if (await bookResult.isVisible()) {
      await bookResult.click();
      
      // Should navigate to book detail page
      await expect(page).toHaveURL(/\/books\/[^/]+/);
      
      // Modal should be closed
      await expect(page.locator('.fixed.inset-0.z-50')).not.toBeVisible();
    }
  });

  test('should close header search modal', async ({ page }) => {
    // Open search modal
    await page.getByRole('button', { name: 'Пошук книг' }).click();
    
    // Close with X button
    await page.locator('button').filter({ hasText: /×/ }).first().click();
    
    // Modal should be closed
    await expect(page.locator('.fixed.inset-0.z-50')).not.toBeVisible();
  });
});

test.describe('Search - Performance', () => {
  test('should handle rapid typing', async ({ page }) => {
    await page.goto('/books');
    
    const searchInput = page.getByPlaceholder('Пошук книг за назвою, автором, категорією...');
    
    // Type rapidly
    await searchInput.type('швидкий пошук', { delay: 50 });
    
    // Should handle without errors
    await page.waitForTimeout(500);
    await expect(searchInput).toHaveValue('швидкий пошук');
  });

  test('should debounce search requests', async ({ page }) => {
    await page.goto('/books');
    
    const searchInput = page.getByPlaceholder('Пошук книг за назвою, автором, категорією...');
    
    // Type and immediately change
    await searchInput.fill('А');
    await searchInput.fill('Ал');
    await searchInput.fill('Али');
    await searchInput.fill('Алис');
    await searchInput.fill('Алиса');
    
    // Wait for debounce
    await page.waitForTimeout(500);
    
    // Should show final search results
    await expect(page.getByText(/результатів пошуку/)).toBeVisible();
  });
});