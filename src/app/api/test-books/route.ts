import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔄 Testing books API...')
    
    // Простой запрос без фильтров
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .limit(10)
    
    console.log('📊 Books query result:', { books: books?.length, error })
    
    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        debug: 'Supabase query failed'
      })
    }
    
    console.log('✅ Books loaded successfully:', books?.length)
    
    return NextResponse.json({
      success: true,
      data: books || [],
      count: books?.length || 0,
      debug: 'Simple query successful'
    })
    
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: 'Catch block triggered'
    })
  }
}