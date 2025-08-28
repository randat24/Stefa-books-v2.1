#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkBookCover() {
  try {
    // Найти книгу "Заєць Гібіскус"
    const { data, error } = await supabase
      .from('books')
      .select('id, title, cover_url')
      .ilike('title', '%Заєць Гібіскус%')
    
    if (error) {
      console.error('❌ Error:', error)
      return
    }
    
    if (data.length === 0) {
      console.log('❌ Book not found')
      return
    }
    
    console.log('📚 Found book(s):')
    data.forEach(book => {
      console.log(`ID: ${book.id}`)
      console.log(`Title: ${book.title}`)
      console.log(`Cover URL: ${book.cover_url}`)
      console.log('---')
    })
    
  } catch (error) {
    console.error('💥 Script error:', error)
  }
}

checkBookCover()