import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Book } from '@/lib/supabase'
import { logger } from '@/lib/logger'

// ============================================================================
// API ДЛЯ ПОЛУЧЕНИЯ КНИГ
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 API: GET /api/books called')
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const category_id = searchParams.get('category_id')
    const age_category = searchParams.get('age_category')
    const age_category_id = searchParams.get('age_category_id')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const available_only = searchParams.get('available_only') === 'true'
    
    console.log('📚 API: Fetching books with params:', {
      category,
      category_id,
      age_category,
      age_category_id,
      search,
      limit,
      available_only
    })

    // Базовый запрос - пробуем с JOIN, если не получается - без категорий
    let query = supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('🔗 API: Created base query')

    // Фильтр по доступности
    if (available_only) {
      query = query.eq('available', true)
      console.log('✅ API: Added available filter')
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
      console.log('🏷️ API: Added category filter:', category)
    }

    // Поиск по названию, автору или описанию
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase()
      query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      console.log('🔍 API: Added search filter:', searchTerm)
    }

    // Лимит результатов
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum)
        console.log('📊 API: Added limit:', limitNum)
      }
    }

    console.log('⚡ API: Executing query...')
    const { data: books, error } = await query

    if (error) {
      console.error('❌ API: Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ API: Found ${books?.length || 0} books`)

    const response = {
      success: true,
      data: books || [],
      count: books?.length || 0
    }

    console.log('📤 API: Sending response:', { success: response.success, count: response.count })

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ API: Unexpected error:', error)
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
    console.log('🚀 API: POST /api/books called')
    
    const { action } = await request.json()
    console.log('📋 API: Action requested:', action)
    
    if (action === 'get_categories') {
      console.log('📂 API: Fetching categories')
      
      const { data: books, error } = await supabase
        .from('books')
        .select('category')

      if (error) {
        console.error('❌ API: Supabase error in get_categories:', error)
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      // Уникальные категории
      const categories = [...new Set(books?.map(book => book.category) || [])]
        .filter(Boolean)
        .sort()

      console.log(`✅ API: Found ${categories.length} categories:`, categories)

      const response = {
        success: true,
        data: categories,
        count: categories.length
      }

      console.log('📤 API: Sending categories response:', { success: response.success, count: response.count })
      return NextResponse.json(response)
    }

    if (action === 'get_categories_stats') {
      console.log('📊 API: Fetching categories with stats')
      
      const { data: books, error } = await supabase
        .from('books')
        .select('category, available')

      if (error) {
        console.error('❌ API: Supabase error in get_categories_stats:', error)
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

      console.log(`✅ API: Found ${categories.length} categories with stats:`, categories.map(c => ({ name: c.name, total: c.total })))

      const response = {
        success: true,
        data: categories,
        count: categories.length
      }

      console.log('📤 API: Sending categories stats response:', { success: response.success, count: response.count })
      return NextResponse.json(response)
    }

    if (action === 'clear_all') {
      console.log('🧹 API: Clearing all books from database...')
      
      try {
        // Очищаем таблицы в правильном порядке
        const { error: bookAuthorsError } = await supabase
          .from('book_authors')
          .delete()
          .neq('book_id', '00000000-0000-0000-0000-000000000000')
        
        if (bookAuthorsError) {
          console.error('❌ API: Error clearing book_authors:', bookAuthorsError)
        }

        const { error: searchQueriesError } = await supabase
          .from('search_queries')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000')
        
        if (searchQueriesError) {
          console.error('❌ API: Error clearing search_queries:', searchQueriesError)
        }

        const { error: booksError } = await supabase
          .from('books')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000')
        
        if (booksError) {
          console.error('❌ API: Error clearing books:', booksError)
        }

        const { error: authorsError } = await supabase
          .from('authors')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000')
        
        if (authorsError) {
          console.error('❌ API: Error clearing authors:', authorsError)
        }

        const { error: categoriesError } = await supabase
          .from('categories')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000')
        
        if (categoriesError) {
          console.error('❌ API: Error clearing categories:', categoriesError)
        }

        console.log('✅ API: Database cleared successfully')
        
        return NextResponse.json({
          success: true,
          message: 'База данных успешно очищена',
          cleared_at: new Date().toISOString()
        })
        
      } catch (error) {
        console.error('❌ API: Error clearing database:', error)
        return NextResponse.json(
          { success: false, error: error instanceof Error ? error.message : 'Ошибка очистки БД' },
          { status: 500 }
        )
      }
    }

    console.log('❌ API: Unknown action requested:', action)
    return NextResponse.json(
      { success: false, error: 'Неизвестное действие' },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ API: Unexpected error in POST:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    )
  }
}