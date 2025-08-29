'use client'

import { useEffect, useState } from 'react'
import { useBooksCache } from '@/hooks/useBooksCache'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/button'
import { Database, RefreshCw, BookOpen } from 'lucide-react'

export function CacheTest() {
  const [isHydrated, setIsHydrated] = useState(false)
  const { 
    books, 
    cacheStats, 
    isSyncing, 
    forceSync, 
    getFilteredBooks 
  } = useBooksCache()

  // Проверяем гидратацию
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Тестируем фильтрацию
  const availableBooks = getFilteredBooks({ availableOnly: true })
  const firstFewBooks = getFilteredBooks({ limit: 3 })

  // Показываем загрузку до гидратации
  if (!isHydrated) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Тест кэша книг
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Тест кэша книг
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {cacheStats.totalBooks}
            </div>
            <div className="text-sm text-gray-600">Всего книг</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {cacheStats.availableBooks}
            </div>
            <div className="text-sm text-gray-600">Доступно</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {availableBooks.length}
            </div>
            <div className="text-sm text-gray-600">Доступно (фильтр)</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {firstFewBooks.length}
            </div>
            <div className="text-sm text-gray-600">Первые 3</div>
          </div>
        </div>

        {/* Статус */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Статус кэша:</span>
          <div className="flex items-center gap-2">
            <Badge variant={isSyncing ? 'secondary' : 'default'}>
              {isSyncing ? 'Синхронизация...' : 'Готово'}
            </Badge>
            <span className="text-xs text-gray-500">
              Версия: {cacheStats.cacheVersion}
            </span>
          </div>
        </div>

        {/* Действия */}
        <div className="flex gap-2">
          <Button
            onClick={forceSync}
            disabled={isSyncing}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Синхронизация...' : 'Обновить кэш'}
          </Button>
        </div>

        {/* Примеры книг */}
        {firstFewBooks.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Примеры книг из кэша:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {firstFewBooks.map((book) => (
                <div key={book.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="font-medium">{book.title}</div>
                  <div className="text-gray-600">{book.author}</div>
                  <Badge variant={book.available ? 'default' : 'secondary'} className="mt-1">
                    {book.available ? 'Доступна' : 'Недоступна'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Время последней синхронизации */}
        <div className="text-xs text-gray-500 text-center">
          Последняя синхронизация: {cacheStats.lastSync}
        </div>
      </CardContent>
    </Card>
  )
}
