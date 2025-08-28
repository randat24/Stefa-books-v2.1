#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function removeDuplicates() {
  try {
    console.log('🧹 Finding and removing duplicate books...')
    
    // Найти все дубликаты (книги с одинаковыми кодами)
    const { data: allBooks, error } = await supabase
      .from('books')
      .select('id, title, code, cover_url, created_at')
      .order('created_at', { ascending: true }) // Сначала старые
    
    if (error) {
      console.error('❌ Error fetching books:', error)
      return
    }
    
    console.log(`📚 Total books found: ${allBooks.length}`)
    
    // Группируем книги по коду
    const booksByCode = {}
    for (const book of allBooks) {
      if (!booksByCode[book.code]) {
        booksByCode[book.code] = []
      }
      booksByCode[book.code].push(book)
    }
    
    // Найти дубликаты
    const duplicates = []
    for (const [code, books] of Object.entries(booksByCode)) {
      if (books.length > 1) {
        console.log(`\n🔄 Found ${books.length} copies of book code ${code}:`)
        books.forEach((book, index) => {
          console.log(`  ${index + 1}. ID: ${book.id}`)
          console.log(`     Title: ${book.title}`)
          console.log(`     Cover: ${book.cover_url}`)
          console.log(`     Created: ${book.created_at}`)
        })
        
        // Оставляем только первую (самую старую) запись, остальные удаляем
        const toKeep = books[0]
        const toDelete = books.slice(1)
        
        console.log(`\n   ✅ Keeping: ${toKeep.id} (${toKeep.title})`)
        toDelete.forEach(book => {
          console.log(`   🗑️  Will delete: ${book.id} (${book.title})`)
          duplicates.push(book)
        })
      }
    }
    
    if (duplicates.length === 0) {
      console.log('\n✨ No duplicates found!')
      return
    }
    
    console.log(`\n🗑️  Deleting ${duplicates.length} duplicate records...`)
    
    for (const duplicate of duplicates) {
      console.log(`   Deleting: ${duplicate.title} (${duplicate.id})`)
      
      const { error: deleteError } = await supabase
        .from('books')
        .delete()
        .eq('id', duplicate.id)
      
      if (deleteError) {
        console.error(`   ❌ Error deleting ${duplicate.id}:`, deleteError)
      } else {
        console.log(`   ✅ Deleted successfully`)
      }
    }
    
    console.log('\n🎉 Duplicate removal completed!')
    
  } catch (error) {
    console.error('💥 Script error:', error)
  }
}

removeDuplicates()