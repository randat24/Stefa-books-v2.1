import { z } from "zod"
import { supabase } from "@/lib/supabase"
import type { CreateBookForm, BookRow } from "@/lib/types/admin"
import { logger } from "@/lib/logger"

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
    
    logger.info('Creating book', input, 'Admin')
    
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
    
    if (error) {
      logger.error('Supabase error', error, 'Admin')
      throw new Error(error.message)
    }
    
    if (!data || data.length === 0) {
      throw new Error('Не вдалося створити книгу - дані не повернулися з бази')
    }
    
    const createdBook = data[0]
    
    logger.info('Book created successfully', createdBook, 'Admin')
    
    return { success: true, data: createdBook }
    
  } catch (error) {
    logger.error('Create book error', error, 'Admin')
    
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
    logger.info('Starting book update', { id, form }, 'Admin')
    
    // Проверяем что ID действительно передан
    if (!id || !id.trim()) {
      return { success: false, error: "ID книги не передан або пустий" }
    }
    
    // Валідуємо обов'язкові поля якщо вони присутні
    if (form.code && !form.code.trim()) {
      return { success: false, error: "Код книги не може бути пустим" }
    }
    if (form.title && !form.title.trim()) {
      return { success: false, error: "Назва книги не може бути пустою" }
    }
    
    // Підготовлюємо дані для оновлення
    const updateData: any = {}
    
    if (form.code) updateData.code = form.code.trim()
    if (form.title) updateData.title = form.title.trim()
    if (form.author) updateData.author = form.author.trim()
    if (form.category) updateData.category = form.category.trim()
    if (form.subcategory !== undefined) updateData.subcategory = form.subcategory?.trim() || null
    if (form.description !== undefined) updateData.description = form.description?.trim() || null
    if (form.short_description !== undefined) updateData.short_description = form.short_description?.trim() || null
    if (form.location !== undefined) updateData.location = form.location?.trim() || null
    if (form.cover_url !== undefined) updateData.cover_url = form.cover_url || null
    if (form.status) updateData.status = form.status
    if (form.qty_total !== undefined) updateData.qty_total = Math.max(1, form.qty_total)
    if (form.price_uah !== undefined) updateData.price_uah = form.price_uah || null
    
    // Якщо змінюється кількість, оновлюємо доступність
    if (form.qty_total !== undefined) {
      // Підраховуємо активні аренди
      const { data: rentals, error: rentalsError } = await supabase
        .from('rentals')
        .select('id')
        .eq('book_id', id)
        .in('status', ['active', 'overdue'])
      
      if (rentalsError) {
      } else {
        const activeRentals = rentals?.length || 0
        const totalQty = updateData.qty_total ?? 1
        updateData.qty_available = Math.max(0, totalQty - activeRentals)
        updateData.available = updateData.qty_available > 0
      }
    }
    
    // Оновлюємо дату зміни
    updateData.updated_at = new Date().toISOString()
    
    logger.info('Attempting to update book', { id, updateData }, 'Admin')
    
    // Спочатку перевіримо, чи існує книга з таким ID
    const { data: existingBook, error: checkError } = await supabase
      .from('books')
      .select('id')
      .eq('id', id)
      .single()
    
    if (checkError || !existingBook) {
      const errorMessage = `Книгу з ID ${id} не знайдено в базі даних`
      logger.error(errorMessage, checkError)
      return { success: false, error: errorMessage }
    }
    
    logger.info('✅ Book exists, proceeding with update')
    
    // Оновлюємо книгу в Supabase
    const { data, error } = await supabase
      .from('books')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      logger.error('Supabase error', error, 'Admin')
      throw new Error(error.message)
    }
    
    logger.info('Book updated successfully', data, 'Admin')
    
    return { success: true, data }
    
  } catch (error) {
    logger.error('Update book error', error, 'Admin')
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Невідома помилка'
    }
  }
}

export async function deleteBook(id: string) {
  try {
    logger.info('Deleting book', { id }, 'Admin')
    
    // Проверяем есть ли активные аренды для этой книги
    const { data: rentals, error: rentalsError } = await supabase
      .from('rentals')
      .select('id')
      .eq('book_id', id)
      .in('status', ['active', 'overdue'])
    
    if (rentalsError) {
      throw new Error(`Помилка перевірки орендувань: ${rentalsError.message}`)
    }
    
    if (rentals && rentals.length > 0) {
      return { 
        success: false, 
        error: 'Неможливо видалити книгу, яка має активні орендування. Спочатку поверніть всі примірники.'
      }
    }
    
    // Удаляем книгу
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw new Error(error.message)
    }
    
    logger.info('Book deleted successfully', { id }, 'Admin')
    
    return { success: true }
    
  } catch (error) {
    logger.error('Delete book error', error, 'Admin')
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Невідома помилка'
    }
  }
}