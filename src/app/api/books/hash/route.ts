import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    
    // Получаем все книги для создания хеша
    const { data: books, error } = await supabase
      .from('books')
      .select('id, title, author, description, category, age_range, available, updated_at')
      .order('updated_at', { ascending: false })
    
    if (error) {
      logger.error('Error fetching books for hash:', error)
      return NextResponse.json(
        { error: 'Failed to fetch books' },
        { status: 500 }
      )
    }
    
    // Создаем хеш на основе данных
    const sortedBooks = books.sort((a, b) => a.id.localeCompare(b.id))
    const dataString = JSON.stringify(sortedBooks)
    const hash = btoa(dataString).slice(0, 16)
    
    logger.info(`Generated hash for ${books.length} books: ${hash}`)
    
    return NextResponse.json({ 
      hash,
      count: books.length,
      lastUpdate: books[0]?.updated_at || null
    })
    
  } catch (error) {
    logger.error('Unexpected error in hash endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
