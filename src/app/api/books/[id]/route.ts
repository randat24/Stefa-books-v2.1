import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

// ============================================================================
// API ДЛЯ ПОЛУЧЕНИЯ ОДНОЙ КНИГИ ПО ID
// ============================================================================

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID книги не указан' },
        { status: 400 }
      )
    }

    logger.info(`Fetching book with ID: ${id}`, undefined, 'API')

    const { data: book, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      logger.error('Supabase error', error, 'API')
      
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

    logger.info(`Found book: ${book.title}`, undefined, 'API')

    return NextResponse.json({
      success: true,
      data: book
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