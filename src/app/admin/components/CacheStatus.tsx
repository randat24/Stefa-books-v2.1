'use client'

import { useState, useEffect } from 'react'
import { useBooksCache } from '@/hooks/useBooksCache'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { 
  RefreshCw, 
  Database, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp
} from 'lucide-react'

export function CacheStatus() {
  const { cacheStats, isSyncing, forceSync, checkForUpdates } = useBooksCache()
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [hasUpdates, setHasUpdates] = useState(false)
  
  // Проверка обновлений каждые 5 минут
  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const updates = await checkForUpdates()
        setHasUpdates(updates)
        setLastCheck(new Date())
      } catch (error) {
        console.error('Failed to check updates:', error)
      }
    }
    
    checkUpdates()
    const interval = setInterval(checkUpdates, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [checkForUpdates])
  
  const handleForceSync = async () => {
    try {
      await forceSync()
      setHasUpdates(false)
    } catch (error) {
      console.error('Force sync failed:', error)
    }
  }
  
  const getStatusColor = () => {
    if (isSyncing) return 'bg-blue-500'
    if (hasUpdates) return 'bg-orange-500'
    return 'bg-green-500'
  }
  
  const getStatusText = () => {
    if (isSyncing) return 'Синхронизация...'
    if (hasUpdates) return 'Есть обновления'
    return 'Актуально'
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Статус кэша книг
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Статус */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Статус:</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
            <Badge variant={isSyncing ? 'secondary' : hasUpdates ? 'destructive' : 'default'}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {cacheStats.totalBooks}
            </div>
            <div className="text-sm text-gray-600">Всего книг</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {cacheStats.availableBooks}
            </div>
            <div className="text-sm text-gray-600">Доступно</div>
          </div>
        </div>
        
        {/* Информация о синхронизации */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Последняя синхронизация:
            </span>
            <span className="text-gray-600">
              {cacheStats.lastSync}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Версия кэша:
            </span>
            <span className="text-gray-600">
              {cacheStats.cacheVersion}
            </span>
          </div>
          
          {lastCheck && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Последняя проверка:
              </span>
              <span className="text-gray-600">
                {lastCheck.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        
        {/* Действия */}
        <div className="flex gap-2">
          <Button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Синхронизация...' : 'Принудительная синхронизация'}
          </Button>
          
          <Button
            onClick={() => checkForUpdates()}
            variant="outline"
            disabled={isSyncing}
          >
            Проверить обновления
          </Button>
        </div>
        
        {/* Уведомления */}
        {hasUpdates && !isSyncing && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Обнаружены изменения в базе данных. Рекомендуется синхронизация.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
