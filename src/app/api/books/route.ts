import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Book } from '@/lib/supabase'

// ============================================================================
// API ДЛЯ ПОЛУЧЕНИЯ КНИГ
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const available_only = searchParams.get('available_only') === 'true'
    
    console.log('📚 API: Fetching books with params:', {
      category,
      search,
      limit,
      available_only
    })

    // Базовый запрос
    let query = supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    // Фильтр по доступности
    if (available_only) {
      query = query.eq('available', true)
    }

    // Фильтр по категории
    if (category && category !== 'all') {
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
      console.error('❌ Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ API: Found ${books?.length || 0} books`)

    return NextResponse.json({
      success: true,
      data: books || [],
      count: books?.length || 0
    })

  } catch (error) {
    console.error('💥 API error:', error)
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
      console.log('📂 API: Fetching categories')
      
      const { data: books, error } = await supabase
        .from('books')
        .select('category')

      if (error) {
        console.error('❌ Supabase error:', error)
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

      return NextResponse.json({
        success: true,
        data: categories,
        count: categories.length
      })
    }

    if (action === 'get_categories_stats') {
      console.log('📊 API: Fetching categories with stats')
      
      const { data: books, error } = await supabase
        .from('books')
        .select('category, available')

      if (error) {
        console.error('❌ Supabase error:', error)
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

      console.log(`✅ API: Found ${categories.length} categories with stats`)

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
    console.error('💥 API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    )
  }
}