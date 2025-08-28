import type { Book } from '@/lib/supabase'
import { booksCache, categoriesCache, searchCache, APICache } from '@/lib/cache'
import { logger } from '@/lib/logger'

// ============================================================================
// КЛИЕНТСКАЯ БИБЛИОТЕКА ДЛЯ РАБОТЫ С КНИГАМИ
// ============================================================================

export interface BooksFilter {
  category?: string
  category_id?: string
  age_category?: string
  age_category_id?: string
  search?: string
  limit?: number
  available_only?: boolean
}

export interface BooksResponse {
  success: boolean
  data: Book[]
  count: number
  error?: string
}

export interface BookResponse {
  success: boolean
  data?: Book
  error?: string
}

export interface CategoriesResponse {
  success: boolean
  data: string[]
  count: number
  error?: string
}

export interface CategoryStats {
  name: string
  total: number
  available: number
}

export interface CategoriesStatsResponse {
  success: boolean
  data: CategoryStats[]
  count: number
  error?: string
}

// ============================================================================
// УТИЛИТЫ ДЛЯ URL
// ============================================================================

function getBaseUrl(): string {
  // Server-side: use process.env
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  }
  // Client-side: use window.location
  return window.location.origin
}

function buildApiUrl(endpoint: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${endpoint}`
}

// ============================================================================
// ПОЛУЧЕНИЕ СПИСКА КНИГ
// ============================================================================

export async function fetchBooks(filters: BooksFilter = {}): Promise<BooksResponse> {
  try {
    // Generate cache key from filters
    const cacheKey = APICache.createKey('books', filters)
    
    // Check cache first
    const cachedData = booksCache.get<BooksResponse>(cacheKey)
    if (cachedData) {
      logger.debug('Returning cached books data', { filters }, 'API')
      return cachedData
    }

    const params = new URLSearchParams()
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category)
    }
    
    if (filters.category_id) {
      params.append('category_id', filters.category_id)
    }
    
    if (filters.age_category) {
      params.append('age_category', filters.age_category)
    }
    
    if (filters.age_category_id) {
      params.append('age_category_id', filters.age_category_id)
    }
    
    if (filters.search) {
      params.append('search', filters.search)
    }
    
    if (filters.limit) {
      params.append('limit', filters.limit.toString())
    }
    
    if (filters.available_only) {
      params.append('available_only', 'true')
    }

    const endpoint = `/api/books?${params.toString()}`
    const url = buildApiUrl(endpoint)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Ошибка при получении книг')
    }

    // Cache successful response
    booksCache.set(cacheKey, result)
    logger.debug('Cached books data', { filters, count: result.count }, 'API')
    
    return result

  } catch (error) {
    return {
      success: false,
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }
  }
}

// ============================================================================
// ПОЛУЧЕНИЕ ОДНОЙ КНИГИ
// ============================================================================

export async function fetchBook(id: string): Promise<BookResponse> {
  try {
    if (!id) {
      throw new Error('ID книги не указан')
    }

    const endpoint = `/api/books/${id}`
    const url = buildApiUrl(endpoint)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Книга не найдена')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Ошибка при получении книги')
    }
    
    return result

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }
  }
}

// ============================================================================
// ПОЛУЧЕНИЕ КАТЕГОРИЙ
// ============================================================================

export async function fetchCategories(): Promise<CategoriesResponse> {
  try {
    const cacheKey = 'categories'
    
    // Check cache first
    const cachedData = categoriesCache.get<CategoriesResponse>(cacheKey)
    if (cachedData) {
      logger.debug('Returning cached categories data', undefined, 'API')
      return cachedData
    }

    const endpoint = '/api/books'
    const url = buildApiUrl(endpoint)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'get_categories' })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Ошибка при получении категорий')
    }
    
    // Cache successful response
    categoriesCache.set(cacheKey, result)
    logger.debug('Cached categories data', { count: result.count }, 'API')
    
    return result

  } catch (error) {
    return {
      success: false,
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }
  }
}

// ============================================================================
// ПОЛУЧЕНИЕ СТАТИСТИКИ ПО КАТЕГОРИЯМ
// ============================================================================

export async function fetchCategoriesStats(): Promise<CategoriesStatsResponse> {
  try {
    const endpoint = '/api/books'
    const url = buildApiUrl(endpoint)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'get_categories_stats' })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Ошибка при получении статистики категорий')
    }
    
    return result

  } catch (error) {
    return {
      success: false,
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }
  }
}

// ============================================================================
// УТИЛИТЫ
// ============================================================================

/**
 * Получить популярные книги (доступные, с высоким рейтингом)
 */
export async function fetchPopularBooks(limit = 8): Promise<BooksResponse> {
  return fetchBooks({
    available_only: true,
    limit
  })
}

/**
 * Получить новые книги (последние добавленные)
 */
export async function fetchNewBooks(limit = 12): Promise<BooksResponse> {
  return fetchBooks({
    limit
  })
}

/**
 * Поиск книг по запросу
 */
export async function searchBooks(query: string, limit = 20): Promise<BooksResponse> {
  if (!query.trim()) {
    return {
      success: true,
      data: [],
      count: 0
    }
  }

  return fetchBooks({
    search: query.trim(),
    limit
  })
}

/**
 * Получить книги по категории
 */
export async function fetchBooksByCategory(category: string, limit?: number): Promise<BooksResponse> {
  return fetchBooks({
    category,
    limit
  })
}