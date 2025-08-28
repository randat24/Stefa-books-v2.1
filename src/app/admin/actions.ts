import { z } from "zod"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import type { CreateBookForm } from "@/lib/types/admin"

// ============================================================================
// ВАЛІДАЦІЙНІ СХЕМИ
// ============================================================================

const BookInsertSchema = z.object({
  code: z.string().min(1, "Код книги обов'язковий"),
  title: z.string().min(1, "Назва книги обов'язкова"),
  author: z.string().min(1, "Автор обов'язковий"),
  category: z.string().min(1, "Категорія обов'язкова"),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  isbn: z.string().optional(),
  pages: z.number().int().min(1).optional(),
  age_range: z.string().optional(),
  language: z.string().optional(),
  publisher: z.string().optional(),
  publication_year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  cover_url: z.string().url().optional(),
  status: z.enum(['available', 'issued', 'reserved', 'lost']),
  qty_total: z.number().int().min(1),
  price_uah: z.number().min(0).optional(),
  location: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  rating_count: z.number().int().min(0).optional(),
  badges: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

// ============================================================================
// SERVER ACTIONS
// ============================================================================

export async function createBook(form: CreateBookForm) {
  try {
    // Валідуємо дані
    const input = BookInsertSchema.parse(form)
    
    console.log('Creating book:', input)
    
    // Создаем книгу в Supabase
    const { data, error } = await supabase
      .from('books')
      .insert({
        ...input,
        qty_available: input.qty_total,
        available: input.status === 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      throw new Error(error.message)
    }
    
    // Обновляем кеш страницы
    revalidatePath('/admin')
    
    console.log('Book created successfully:', data)
    
    return { success: true, data }
    
  } catch (error) {
    console.error('Create book error:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => e.message).join(', ')
      }
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Невідома помилка'
    }
  }
}

export async function updateBook(id: string, form: Partial<CreateBookForm>) {
  try {
    console.log('Updating book:', id, form)
    
    // TODO: Реальне оновлення через Supabase
    
    return { success: true, data: { id, ...form } }
    
  } catch (error) {
    console.error('Update book error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Невідома помилка'
    }
  }
}

export async function deleteBook(id: string) {
  try {
    console.log('Deleting book:', id)
    
    // TODO: Реальне видалення через Supabase
    
    return { success: true }
    
  } catch (error) {
    console.error('Delete book error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Невідома помилка'
    }
  }
}