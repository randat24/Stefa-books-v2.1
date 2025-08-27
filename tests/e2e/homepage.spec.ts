import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Stefa\.books/i })).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Test navigation links
    await expect(page.getByRole('link', { name: 'Головна' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Каталог' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Підписка' })).toBeVisible();
  });

  test('should navigate to books page', async ({ page }) => {
    await page.getByRole('link', { name: 'Каталог' }).click();
    
    await expect(page).toHaveURL('/books');
    await expect(page.getByText('Каталог книг')).toBeVisible();
  });

  test('should navigate to subscription page', async ({ page }) => {
    await page.getByRole('link', { name: 'Підписка' }).click();
    
    await expect(page).toHaveURL('/subscribe');
    await expect(page.getByText('Заявка на підписку')).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.getByText('Прокат дитячих книг')).toBeVisible();
    await expect(page.getByText('у Миколаєві')).toBeVisible();
  });

  test('should display subscription plans', async ({ page }) => {
    await expect(page.getByText('Mini')).toBeVisible();
    await expect(page.getByText('Maxi')).toBeVisible();
    await expect(page.getByText('Premium')).toBeVisible();
  });

  test('should have functional header search', async ({ page }) => {
    // Click search button
    await page.getByRole('button', { name: 'Пошук книг' }).click();
    
    // Search modal should open
    await expect(page.getByPlaceholder('Пошук книг за назвою, автором, категорією...')).toBeVisible();
    
    // Type search query
    await page.getByPlaceholder('Пошук книг за назвою, автором, категорією...').fill('Алиса');
    
    // Results should appear
    await expect(page.getByText('Книжки')).toBeVisible();
    
    // Close search modal
    await page.keyboard.press('Escape');
    await expect(page.getByPlaceholder('Пошук книг за назвою, автором, категорією...')).not.toBeVisible();
  });

  test('should display contact information', async ({ page }) => {
    await expect(page.getByText('вул. Маріупольська 13/2, Миколаїв')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /Stefa\.books/i })).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: /Stefa\.books/i })).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: /Stefa\.books/i })).toBeVisible();
  });
});

test.describe('Homepage - Interactive Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle plan selection', async ({ page }) => {
    // Click on Mini plan
    await page.getByText('Mini').first().click();
    
    // Should navigate to subscription page with plan parameter
    await expect(page).toHaveURL('/subscribe?plan=mini');
  });

  test('should display FAQ section', async ({ page }) => {
    await expect(page.getByText('Часті запитання')).toBeVisible();
    
    // Test FAQ accordion functionality
    const faqItem = page.getByText('Як працює прокат?').first();
    if (await faqItem.isVisible()) {
      await faqItem.click();
      await expect(page.getByText('Ви обираєте план підписки')).toBeVisible();
    }
  });

  test('should handle footer links', async ({ page }) => {
    // Scroll to footer
    await page.getByText('Політика конфіденційності').scrollIntoViewIfNeeded();
    
    // Test privacy policy link
    await page.getByRole('link', { name: 'Політика конфіденційності' }).click();
    await expect(page).toHaveURL('/privacy');
    
    // Go back and test terms link
    await page.goBack();
    await page.getByRole('link', { name: 'Умови використання' }).click();
    await expect(page).toHaveURL('/terms');
  });
});

test.describe('Homepage - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check for layout shifts
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 2000);
      });
    });
    
    // CLS should be less than 0.1
    expect(cls).toBeLessThan(0.1);
  });
});

test.describe('Homepage - Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    await expect(page.locator('h1')).toBeVisible();
    
    // Should have proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation landmarks
    await expect(page.locator('nav')).toBeVisible();
    
    // Links should have accessible text
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // First focusable element should be focused
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    
    // Should be able to navigate through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = page.locator(':focus');
      await expect(currentFocus).toBeVisible();
    }
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Search button should have proper aria-label
    const searchButton = page.getByRole('button', { name: 'Пошук книг' });
    await expect(searchButton).toBeVisible();
    
    // Images should have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});