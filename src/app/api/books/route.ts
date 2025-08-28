import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Book } from '@/lib/supabase'
import { logger } from '@/lib/logger'

// ============================================================================
// API ДЛЯ ПОЛУЧЕНИЯ КНИГ
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const category_id = searchParams.get('category_id')
    const age_category = searchParams.get('age_category')
    const age_category_id = searchParams.get('age_category_id')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const available_only = searchParams.get('available_only') === 'true'
    
    logger.info('📚 API: Fetching books with params:', {
      category,
      category_id,
      age_category,
      age_category_id,
      search,
      limit,
      available_only
    }, 'API')

    // Базовый запрос - пробуем с JOIN, если не получается - без категорий
    let query = supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    // Фильтр по доступности
    if (available_only) {
      query = query.eq('available', true)
    }

    // Фильтр по ID жанровой категории (пропускаем до миграции)
    // TODO: Включить после миграции БД
    // if (category_id) {
    //   query = query.eq('category_id', category_id)
    // }
    
    // Фильтр по ID возрастной категории (пропускаем до миграции)
    // TODO: Включить после миграции БД
    // if (age_category_id) {
    //   query = query.eq('age_category_id', age_category_id)
    // }

    // Фильтр по старому полю категории (для совместимости)
    if (category && category !== 'all' && !category_id) {
      query = query.eq('category', category)
    }

    // Поиск по названию, автору или описанию
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase()
      query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }

    // Лимит результатов
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum)
      }
    }

    const { data: books, error } = await query

    if (error) {
      logger.error('Supabase error', error, 'API')
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    logger.info(`Found ${books?.length || 0} books`, undefined, 'API')

    return NextResponse.json({
      success: true,
      data: books || [],
      count: books?.length || 0
    })

  } catch (error) {
    logger.error('API error', error, 'API')
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// ПОЛУЧЕНИЕ КАТЕГОРИЙ
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'get_categories') {
      logger.info('Fetching categories', undefined, 'API')
      
      const { data: books, error } = await supabase
        .from('books')
        .select('category')

      if (error) {
        logger.error('Supabase error', error, 'API')
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      // Уникальные категории
      const categories = [...new Set(books?.map(book => book.category) || [])]
        .filter(Boolean)
        .sort()

      logger.info(`Found ${categories.length} categories`, categories, 'API')

      return NextResponse.json({
        success: true,
        data: categories,
        count: categories.length
      })
    }

    if (action === 'get_categories_stats') {
      logger.info('Fetching categories with stats', undefined, 'API')
      
      const { data: books, error } = await supabase
        .from('books')
        .select('category, available')

      if (error) {
        logger.error('Supabase error', error, 'API')
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      // Подсчет книг по категориям
      const categoryStats: Record<string, { total: number, available: number }> = {}
      
      books?.forEach(book => {
        if (book.category) {
          if (!categoryStats[book.category]) {
            categoryStats[book.category] = { total: 0, available: 0 }
          }
          categoryStats[book.category].total++
          if (book.available) {
            categoryStats[book.category].available++
          }
        }
      })

      const categories = Object.entries(categoryStats)
        .map(([name, stats]) => ({
          name,
          total: stats.total,
          available: stats.available
        }))
        .sort((a, b) => b.total - a.total) // Сортировка по количеству книг

      logger.info(`Found ${categories.length} categories with stats`, undefined, 'API')

      return NextResponse.json({
        success: true,
        data: categories,
        count: categories.length
      })
    }

    return NextResponse.json(
      { success: false, error: 'Неизвестное действие' },
      { status: 400 }
    )

  } catch (error) {
    logger.error('API error', error, 'API')
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    )
  }
}