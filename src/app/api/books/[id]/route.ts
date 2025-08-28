import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// ============================================================================
// API ДЛЯ ПОЛУЧЕНИЯ ОДНОЙ КНИГИ ПО ID
// ============================================================================

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID книги не указан' },
        { status: 400 }
      )
    }

    console.log(`📖 API: Fetching book with ID: ${id}`)

    const { data: book, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      
      // Если книга не найдена
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Книга не найдена' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ API: Found book: ${book.title}`)

    return NextResponse.json({
      success: true,
      data: book
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