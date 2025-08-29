"use client"

import { useState, useEffect } from "react"
import { Building2, BookOpen, Users, CreditCard, TrendingUp, CheckCircle, FileText, Calendar, BarChart3, RefreshCw, Cloud } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/button"
import { BooksTable } from "./components/BooksTable"
import { SyncPanel } from "./components/SyncPanel"
import { getBooks } from "./data"
import type { BookRow } from "@/lib/types/admin"

// ============================================================================
// АДМІН-ПАНЕЛЬ STEFA.BOOKS
// ============================================================================

export default function AdminPage() {
  const [books, setBooks] = useState<BookRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // ============================================================================
  // ЗАВАНТАЖЕННЯ ДАНИХ
  // ============================================================================

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      
      
      const booksData = await getBooks()
      
      setBooks(booksData)
      
    } catch (err) {
      setError('Помилка завантаження даних. Спробуйте перезавантажити сторінку.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true)
      await loadData()
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // ============================================================================
  // ОБРОБНИКИ ПОДІЙ
  // ============================================================================

  function handleBookCreated() {
    loadData()
  }

  // ============================================================================
  // СТАТИСТИКА
  // ============================================================================
  
  const stats = {
    totalBooks: books.length,
    availableBooks: books.filter(book => book.available).length,
    activeUsers: 25, // Временно
    totalRevenue: 8500, // Временно
    totalBooksCost: books.reduce((sum, book) => sum + (book.price_uah || 0), 0)
  }

  // ============================================================================
  // РЕНДЕР СТОРІНКИ
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto"></div>
          <p className="text-slate-600 text-lg font-medium">Завантаження адмін-панелі...</p>
          <p className="text-slate-500 text-sm">Будь ласка, зачекайте</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="size-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Помилка завантаження</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full"
              >
                {refreshing ? (
                  <>
                    <RefreshCw className="size-4 mr-2 animate-spin" />
                    Оновлення...
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4 mr-2" />
                    Спробувати знову
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Перезавантажити сторінку
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Заголовок */}
      <div className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/90 backdrop-blur-sm">
        <div className="w-full px-4 py-6 lg:px-6 xl:px-8 2xl:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Building2 className="size-7 text-slate-600"/>
              </div>
              <div>
                <div className="text-sm text-slate-500 font-medium">Адмін‑панель</div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
                  Stefa.books — Управління
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-2 px-3 py-1">
                <CheckCircle className="size-4" />
                <span className="hidden sm:inline">Система працює</span>
                <span className="sm:hidden">ОК</span>
              </Badge>
              <Button
                variant="outline"
                size="md"
                onClick={handleRefresh}
                disabled={refreshing}
                className="hidden sm:flex"
              >
                {refreshing ? (
                  <>
                    <RefreshCw className="size-4 mr-2 animate-spin" />
                    Оновлення
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4 mr-2" />
                    Оновити
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Основний контент */}
      <div className="w-full px-4 py-8 lg:px-6 xl:px-8 2xl:px-10">
        <div className="space-y-8">
          
          {/* KPI метрики */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6">
            <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Книги в наявності</CardTitle>
                <BookOpen className="h-5 w-5 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.availableBooks}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  з {stats.totalBooks} загалом
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Активні користувачі</CardTitle>
                <Users className="h-5 w-5 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.activeUsers}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  підписників
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Доходи (місяць)</CardTitle>
                <CreditCard className="h-5 w-5 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalRevenue.toLocaleString('uk-UA')} ₴
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Витрати: {stats.totalBooksCost.toLocaleString('uk-UA')} ₴
                </p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  Прибуток: {(stats.totalRevenue - stats.totalBooksCost).toLocaleString('uk-UA')} ₴
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">РОІ (окупність)</CardTitle>
                <TrendingUp className="h-5 w-5 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.totalBooksCost ? Math.round((stats.totalRevenue / stats.totalBooksCost) * 100) : 0}%
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  повернення інвестицій
                </p>
              </CardContent>
            </Card>

            {/* Додаткові метрики для широких екранів */}
            <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow hidden 2xl:block">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Середня ціна</CardTitle>
                <FileText className="h-5 w-5 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">
                  {stats.totalBooks ? Math.round(stats.totalBooksCost / stats.totalBooks) : 0} ₴
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  за книгу в колекції
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow hidden 2xl:block">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Використання</CardTitle>
                <BarChart3 className="h-5 w-5 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-600">
                  {stats.totalBooks ? Math.round(((stats.totalBooks - stats.availableBooks) / stats.totalBooks) * 100) : 0}%
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  книг зараз у читачів
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Головні таби */}
          <Tabs defaultValue="books" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 rounded-2xl bg-slate-100 p-1">
              <TabsTrigger value="books" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <BookOpen className="size-4" />
                <span className="hidden sm:inline">Книги</span>
              </TabsTrigger>
              <TabsTrigger value="sync" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Cloud className="size-4" />
                <span className="hidden sm:inline">Синхронізація</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Users className="size-4" />
                <span className="hidden sm:inline">Користувачі</span>
              </TabsTrigger>
              <TabsTrigger value="rentals" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Calendar className="size-4" />
                <span className="hidden sm:inline">Оренди</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <BarChart3 className="size-4" />
                <span className="hidden sm:inline">Звіти</span>
              </TabsTrigger>
            </TabsList>

            {/* Таб книг */}
            <TabsContent value="books" className="space-y-4">
              <BooksTable
                books={books}
                onRefresh={handleRefresh}
                onBookCreated={handleBookCreated}
              />
            </TabsContent>

            {/* Таб синхронізації */}
            <TabsContent value="sync" className="space-y-4">
              <SyncPanel />
            </TabsContent>

            {/* Таб користувачів */}
            <TabsContent value="users" className="space-y-4">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Управління користувачами</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-500">
                    <Users className="size-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-semibold text-slate-700 mb-2">Користувачі</p>
                    <p className="text-slate-500">Управління підписниками (в розробці)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Таб орендувань */}
            <TabsContent value="rentals" className="space-y-4">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Управління орендами</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-500">
                    <Calendar className="size-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-semibold text-slate-700 mb-2">Орендні записи</p>
                    <p className="text-slate-500">Відстеження видачі та повернень (в розробці)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Таб звітів */}
            <TabsContent value="reports" className="space-y-4">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Звіти та аналітика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-500">
                    <BarChart3 className="size-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-semibold text-slate-700 mb-2">Аналітика</p>
                    <p className="text-slate-500">Фінансові звіти та статистика (в розробці)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}