"use client"

import { useState, useEffect } from "react"
import { Building2, BookOpen, Users, CreditCard, TrendingUp, CheckCircle, FileText, Calendar, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/Badge"
import { BooksTable } from "./components/BooksTable"
import type { AdminDashboardData, BookRow } from "@/lib/types/admin"

// ============================================================================
// АДМІН-ПАНЕЛЬ STEFA.BOOKS
// ============================================================================

export default function AdminPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ============================================================================
  // ЗАВАНТАЖЕННЯ ДАНИХ
  // ============================================================================

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      
      // Загружаем реальные данные из Supabase
      const { getAdminDashboardData } = await import('./data')
      const dashboardData = await getAdminDashboardData()
      
      setData(dashboardData)
    } catch (err) {
      console.error('Failed to load admin data:', err)
      setError('Помилка завантаження даних. Перевірте підключення до Supabase.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // ============================================================================
  // ОБРОБНИКИ ПОДІЙ
  // ============================================================================

  function handleRefresh() {
    loadData()
  }

  function handleBookCreated() {
    loadData()
  }

  // ============================================================================
  // РЕНДЕР СТОРІНКИ
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
          <p className="text-slate-600">Завантаження адмін-панелі...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Заголовок */}
      <div className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Building2 className="size-6 text-slate-600"/>
              </div>
              <div>
                <div className="text-sm text-slate-500">Адмін‑панель</div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Stefa.books — Управління
                </h1>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <CheckCircle className="size-3" />
              Система працює
            </Badge>
          </div>
        </div>
      </div>

      {/* Основний контент */}
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="space-y-6">
          
          {/* KPI метрики */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Книги в наявності</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {data?.stats.availableBooks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  з {data?.stats.totalBooks || 0} загалом
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активні користувачі</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {data?.stats.activeUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  підписників
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Доходи (місяць)</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {(data?.stats.totalRevenue || 0).toLocaleString('uk-UA')} ₴
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% від минулого місяця
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ефективність</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">91%</div>
                <p className="text-xs text-muted-foreground">
                  книги в обороті
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Головні таби */}
          <Tabs defaultValue="books" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 rounded-2xl">
              <TabsTrigger value="books" className="rounded-xl flex items-center gap-2">
                <BookOpen className="size-4" />
                Книги
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl flex items-center gap-2">
                <Users className="size-4" />
                Користувачі
              </TabsTrigger>
              <TabsTrigger value="rentals" className="rounded-xl flex items-center gap-2">
                <Calendar className="size-4" />
                Оренди
              </TabsTrigger>
              <TabsTrigger value="reports" className="rounded-xl flex items-center gap-2">
                <BarChart3 className="size-4" />
                Звіти
              </TabsTrigger>
            </TabsList>

            {/* Таб книг */}
            <TabsContent value="books" className="space-y-4">
              <BooksTable
                books={data?.books || []}
                onRefresh={handleRefresh}
                onBookCreated={handleBookCreated}
              />
            </TabsContent>

            {/* Таб користувачів */}
            <TabsContent value="users" className="space-y-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Управління користувачами</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-500">
                    <Users className="size-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">Користувачі</p>
                    <p className="text-sm">Управління підписниками (в розробці)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Таб орендувань */}
            <TabsContent value="rentals" className="space-y-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Управління орендами</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-500">
                    <CreditCard className="size-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">Орендні записи</p>
                    <p className="text-sm">Відстеження видачі та повернень (в розробці)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Таб звітів */}
            <TabsContent value="reports" className="space-y-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Звіти та аналітика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-500">
                    <TrendingUp className="size-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">Аналітика</p>
                    <p className="text-sm">Фінансові звіти та статистика (в розробці)</p>
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