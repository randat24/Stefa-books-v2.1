#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Конфигурация Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gdrladrtjngzloiyihyk.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcmxhZHJ0am5nemxvaXlpaHlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDM5ODU4NCwiZXhwIjoyMDY5OTc0NTg0fQ.keGyqWQvrmx0q7labPCiz-7QID5VgdhvEE4Ak1UJ8h4'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixImageUrls() {
  try {
    console.log('🔧 Fixing book cover image URLs...')
    
    // Получаем все книги с неправильными URL
    const { data: books, error: fetchError } = await supabase
      .from('books')
      .select('id, title, cover_url')
      .like('cover_url', '%localhost:3001%')
    
    if (fetchError) {
      console.error('❌ Error fetching books:', fetchError)
      return
    }
    
    console.log(`📚 Found ${books.length} books with incorrect image URLs`)
    
    let fixedCount = 0
    
    for (const book of books) {
      const originalUrl = book.cover_url
      
      // Конвертируем URL с localhost:3001 на /images/books/
      let newUrl = originalUrl
      
      if (originalUrl.includes('localhost:3001/images/books/')) {
        newUrl = originalUrl.replace('http://localhost:3001/images/books/', '/images/books/')
      } else if (originalUrl.includes('localhost:3000/images/books/')) {
        newUrl = originalUrl.replace('http://localhost:3000/images/books/', '/images/books/')
      }
      
      if (newUrl !== originalUrl) {
        console.log(`🔄 Updating "${book.title}":`)
        console.log(`   Before: ${originalUrl}`)
        console.log(`   After:  ${newUrl}`)
        
        const { error: updateError } = await supabase
          .from('books')
          .update({ cover_url: newUrl })
          .eq('id', book.id)
        
        if (updateError) {
          console.error(`❌ Error updating book ${book.id}:`, updateError)
        } else {
          fixedCount++
          console.log(`   ✅ Updated successfully`)
        }
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} book cover URLs!`)
    
  } catch (error) {
    console.error('💥 Script error:', error)
  }
}

// Запускаем скрипт
fixImageUrls()