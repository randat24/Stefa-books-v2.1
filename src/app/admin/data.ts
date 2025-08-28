"use server"

import { supabase } from "@/lib/supabase"
import type { AdminDashboardData, BookRow, UserRow, RentalRow, PaymentRow } from "@/lib/types/admin"

// ============================================================================
// ЗАГРУЗКА ДАННЫХ АДМИН-ПАНЕЛИ
// ============================================================================

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    // Загружаем все данные параллельно
    const [
      booksResult,
      usersResult, 
      rentalsResult,
      paymentsResult,
      statsResult
    ] = await Promise.all([
      getBooks(),
      getUsers(),
      getRentals(),
      getPayments(),
      getDashboardStats()
    ])

    return {
      stats: statsResult,
      books: booksResult,
      users: usersResult,
      rentals: rentalsResult,
      payments: paymentsResult
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    
    // Возвращаем пустые данные в случае ошибки
    return {
      stats: {
        totalBooks: 0,
        availableBooks: 0,
        activeUsers: 0,
        totalRevenue: 0
      },
      books: [],
      users: [],
      rentals: [],
      payments: []
    }
  }
}

// ============================================================================
// КНИГИ
// ============================================================================

export async function getBooks(): Promise<BookRow[]> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching books:', error)
      return []
    }

    return data.map(book => ({
      id: book.id,
      code: book.code,
      title: book.title,
      author: book.author,
      category: book.category,
      subcategory: book.subcategory,
      description: book.description,
      short_description: book.short_description,
      isbn: book.isbn,
      pages: book.pages,
      age_range: book.age_range,
      language: book.language,
      publisher: book.publisher,
      publication_year: book.publication_year,
      cover_url: book.cover_url,
      status: book.status,
      available: book.available,
      qty_total: book.qty_total,
      qty_available: book.qty_available,
      price_uah: book.price_uah,
      location: book.location,
      rating: book.rating,
      rating_count: book.rating_count,
      badges: book.badges,
      tags: book.tags,
      created_at: book.created_at,
      updated_at: book.updated_at
    }))
  } catch (error) {
    console.error('Error in getBooks:', error)
    return []
  }
}

// ============================================================================
// ПОЛЬЗОВАТЕЛИ
// ============================================================================

export async function getUsers(): Promise<UserRow[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return []
    }

    return data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      subscription_type: user.subscription_type,
      subscription_start: user.subscription_start,
      subscription_end: user.subscription_end,
      status: user.status,
      address: user.address,
      notes: user.notes,
      created_at: user.created_at,
      updated_at: user.updated_at
    }))
  } catch (error) {
    console.error('Error in getUsers:', error)
    return []
  }
}

// ============================================================================
// АРЕНДЫ
// ============================================================================

export async function getRentals(): Promise<RentalRow[]> {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        users:user_id (name, email),
        books:book_id (title, code)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching rentals:', error)
      return []
    }

    return data.map(rental => ({
      id: rental.id,
      user_id: rental.user_id,
      book_id: rental.book_id,
      rental_date: rental.rental_date,
      due_date: rental.due_date,
      return_date: rental.return_date,
      status: rental.status,
      notes: rental.notes,
      created_at: rental.created_at,
      updated_at: rental.updated_at,
      // Joined fields
      user_name: rental.users?.name,
      user_email: rental.users?.email,
      book_title: rental.books?.title,
      book_code: rental.books?.code
    }))
  } catch (error) {
    console.error('Error in getRentals:', error)
    return []
  }
}

// ============================================================================
// ПЛАТЕЖИ
// ============================================================================

export async function getPayments(): Promise<PaymentRow[]> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        users:user_id (name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payments:', error)
      return []
    }

    return data.map(payment => ({
      id: payment.id,
      user_id: payment.user_id,
      amount_uah: payment.amount_uah,
      currency: payment.currency,
      payment_method: payment.payment_method,
      status: payment.status,
      transaction_id: payment.transaction_id,
      payment_date: payment.payment_date,
      description: payment.description,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      // Joined fields
      user_name: payment.users?.name,
      user_email: payment.users?.email
    }))
  } catch (error) {
    console.error('Error in getPayments:', error)
    return []
  }
}

// ============================================================================
// СТАТИСТИКА ДАШБОРДА
// ============================================================================

export async function getDashboardStats() {
  try {
    // Параллельно загружаем статистику
    const [
      booksStats,
      usersStats,
      paymentsStats
    ] = await Promise.all([
      // Статистика книг
      supabase
        .from('books')
        .select('id, available')
        .then(({ data, error }) => {
          if (error) throw error
          const total = data?.length || 0
          const available = data?.filter(book => book.available).length || 0
          return { total, available }
        }),

      // Статистика пользователей
      supabase
        .from('users')
        .select('id, status')
        .then(({ data, error }) => {
          if (error) throw error
          const active = data?.filter(user => user.status === 'active').length || 0
          return { active }
        }),

      // Статистика платежей (доходы за текущий месяц)
      supabase
        .from('payments')
        .select('amount_uah, payment_date, status')
        .gte('payment_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .eq('status', 'completed')
        .then(({ data, error }) => {
          if (error) throw error
          const total = data?.reduce((sum, payment) => sum + (payment.amount_uah || 0), 0) || 0
          return { total }
        })
    ])

    return {
      totalBooks: booksStats.total,
      availableBooks: booksStats.available,
      activeUsers: usersStats.active,
      totalRevenue: paymentsStats.total
    }
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
    return {
      totalBooks: 0,
      availableBooks: 0,
      activeUsers: 0,
      totalRevenue: 0
    }
  }
}

// ============================================================================
// ПОИСК КНИГ
// ============================================================================

export async function searchBooks(query: string, limit = 50) {
  try {
    if (!query.trim()) {
      return getBooks()
    }

    const { data, error } = await supabase.rpc('search_books', {
      query_text: query,
      limit_count: limit
    })

    if (error) {
      console.error('Error searching books:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in searchBooks:', error)
    return []
  }
}