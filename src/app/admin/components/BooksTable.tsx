"use client"

import { useState } from "react"
import Image from "next/image"
import { 
  Eye, Edit, Trash2, ImageIcon, ExternalLink, CheckCircle, BookOpenCheck, Clock, XCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { 
  Card, CardContent 
} from "@/components/ui/card"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AddBookDialog } from "./AddBookDialog"
import type { BookRow } from "@/lib/types/admin"

// ============================================================================
// ТАБЛИЦЯ КНИГ З ОБКЛАДИНКАМИ
// ============================================================================

interface BooksTableProps {
  books: BookRow[]
  onRefresh: () => void
  onBookCreated: () => void
}

export function BooksTable({ books, onRefresh, onBookCreated }: BooksTableProps) {
  const [selectedBook, setSelectedBook] = useState<BookRow | null>(null)
  const [imageViewBook, setImageViewBook] = useState<BookRow | null>(null)

  // ============================================================================
  // ФУНКЦІЇ ДЛЯ РОБОТИ З КНИГАМИ
  // ============================================================================

  function handleViewBook(book: BookRow) {
    setSelectedBook(book)
  }

  function handleViewCover(book: BookRow) {
    setImageViewBook(book)
  }

  function handleEditBook(book: BookRow) {
    // TODO: Реалізувати редагування
    console.log('Edit book:', book)
  }

  async function handleDeleteBook(book: BookRow) {
    if (!confirm(`Ви впевнені, що хочете видалити книгу "${book.title}"?`)) {
      return
    }

    try {
      // TODO: Викликати deleteBook action
      console.log('Delete book:', book.id)
      onRefresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Помилка видалення книги')
    }
  }

  // ============================================================================
  // ДОПОМІЖНІ ФУНКЦІЇ
  // ============================================================================

  function getStatusBadge(status: string) {
    const labels = {
      available: "Доступна",
      issued: "Видана", 
      reserved: "Зарезервована",
      lost: "Втрачена"
    }

    const getStatusIcon = () => {
      switch (status) {
        case 'available': return <CheckCircle className="size-3" />
        case 'issued': return <BookOpenCheck className="size-3" />
        case 'reserved': return <Clock className="size-3" />
        case 'lost': return <XCircle className="size-3" />
        default: return null
      }
    }

    return (
      <Chip className={`flex items-center gap-1 ${
        status === 'available' ? 'bg-green-50 text-green-700' : 
        status === 'issued' ? 'bg-blue-50 text-blue-700' : 
        status === 'reserved' ? 'bg-yellow-50 text-yellow-700' : 
        'bg-red-50 text-red-700'
      }`}>
        {getStatusIcon()}
        {labels[status as keyof typeof labels] || status}
      </Chip>
    )
  }

  // ============================================================================
  // РЕНДЕР ТАБЛИЦІ
  // ============================================================================

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Управління книгами</h3>
          <p className="text-sm text-slate-500">Всього книг: {books.length}</p>
        </div>
        <AddBookDialog onBookCreated={onBookCreated} />
      </div>
      
      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Обкладинка</TableHead>
                  <TableHead>Код</TableHead>
                  <TableHead className="min-w-[200px]">Книга</TableHead>
                  <TableHead>Автор</TableHead>
                  <TableHead>Категорія</TableHead>
                  <TableHead className="text-center">Кількість</TableHead>
                  <TableHead className="text-right">Ціна</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Локація</TableHead>
                  <TableHead className="text-center">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id} className="group">
                    {/* Обкладинка */}
                    <TableCell className="p-2">
                      <div className="relative">
                        {book.cover_url ? (
                          <div 
                            className="relative group/cover cursor-pointer"
                            onClick={() => handleViewCover(book)}
                          >
                            <Image
                              src={book.cover_url}
                              alt={`Обкладинка: ${book.title}`}
                              width={48}
                              height={64}
                              className="rounded-lg object-cover border border-slate-200 shadow-sm transition-transform group-hover/cover:scale-105"
                            />
                            {/* Ефект при наведенні */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Eye className="size-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-16 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center">
                            <ImageIcon className="size-5 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Код книги */}
                    <TableCell>
                      <code className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                        {book.code}
                      </code>
                    </TableCell>

                    {/* Назва та опис */}
                    <TableCell>
                      <div className="space-y-1">
                        <div 
                          className="font-medium text-slate-900 line-clamp-2 cursor-pointer hover:text-blue-600"
                          onClick={() => handleViewBook(book)}
                          title={book.title}
                        >
                          {book.title}
                        </div>
                        {book.description && (
                          <div 
                            className="text-xs text-slate-500 line-clamp-2" 
                            title={book.description}
                          >
                            {book.description}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Автор */}
                    <TableCell>
                      <div className="text-sm text-slate-700 font-medium" title={book.author}>
                        {book.author}
                      </div>
                    </TableCell>

                    {/* Категорія */}
                    <TableCell>
                      <Chip className="text-xs whitespace-nowrap bg-slate-50 text-slate-700">
                        {book.category}
                      </Chip>
                    </TableCell>

                    {/* Кількість */}
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className={`font-medium ${book.qty_available === 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {book.qty_available}
                        </div>
                        <div className="text-xs text-slate-500">
                          з {book.qty_total}
                        </div>
                      </div>
                    </TableCell>

                    {/* Ціна */}
                    <TableCell className="text-right">
                      {book.price_uah ? (
                        <div className="font-medium text-slate-900">
                          {book.price_uah.toLocaleString('uk-UA')} ₴
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </TableCell>

                    {/* Статус */}
                    <TableCell>
                      {getStatusBadge(book.status)}
                    </TableCell>

                    {/* Локація */}
                    <TableCell>
                      {book.location ? (
                        <div className="text-sm text-slate-600 max-w-[120px] truncate" title={book.location}>
                          {book.location}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </TableCell>

                    {/* Дії */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="md"
                          variant="ghost"
                          className="size-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => handleViewBook(book)}
                          title="Переглянути деталі"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          size="md"
                          variant="ghost"
                          className="size-8 p-0 hover:bg-amber-50 hover:text-amber-600"
                          onClick={() => handleEditBook(book)}
                          title="Редагувати"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          size="md"
                          variant="ghost"
                          className="size-8 p-0 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDeleteBook(book)}
                          title="Видалити"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {books.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <ImageIcon className="size-8" />
                        <p>Книги не знайдено</p>
                        <p className="text-sm">Додайте першу книгу до колекції</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Діалог деталей книги */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Деталі книги</DialogTitle>
          </DialogHeader>
          
          {selectedBook && (
            <div className="grid gap-6">
              {/* Обкладинка */}
              {selectedBook.cover_url && (
                <div className="flex justify-center">
                  <div className="relative">
                    <Image
                      src={selectedBook.cover_url}
                      alt={`Обкладинка: ${selectedBook.title}`}
                      width={250}
                      height={375}
                      className="rounded-lg object-cover border border-slate-200 shadow-lg"
                    />
                    <Button
                      size="md"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => selectedBook.cover_url && window.open(selectedBook.cover_url, '_blank')}
                    >
                      <ExternalLink className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Інформація */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Код</Label>
                    <p className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{selectedBook.code}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Статус</Label>
                    <div className="mt-1">{getStatusBadge(selectedBook.status)}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-600">Назва</Label>
                  <p className="text-lg font-medium text-slate-900">{selectedBook.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Автор</Label>
                    <p className="font-medium text-slate-700">{selectedBook.author}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Категорія</Label>
                    <p className="text-slate-700">{selectedBook.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Кількість</Label>
                    <p className="text-slate-700">
                      <span className="font-medium">{selectedBook.qty_available}</span> доступно з{' '}
                      <span className="font-medium">{selectedBook.qty_total}</span> загалом
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Ціна закупки</Label>
                    <p className="text-slate-700">
                      {selectedBook.price_uah ? `${selectedBook.price_uah.toLocaleString('uk-UA')} ₴` : '—'}
                    </p>
                  </div>
                </div>

                {selectedBook.location && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Локація</Label>
                    <p className="text-slate-700">{selectedBook.location}</p>
                  </div>
                )}

                {selectedBook.description && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Опис</Label>
                    <p className="text-slate-700 text-sm leading-relaxed">{selectedBook.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Створено</Label>
                    <p className="text-xs text-slate-500">
                      {selectedBook.created_at ? new Date(selectedBook.created_at).toLocaleString('uk-UA') : '—'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Оновлено</Label>
                    <p className="text-xs text-slate-500">
                      {selectedBook.updated_at ? new Date(selectedBook.updated_at).toLocaleString('uk-UA') : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Діалог перегляду обкладинки */}
      <Dialog open={!!imageViewBook} onOpenChange={() => setImageViewBook(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Обкладинка книги</DialogTitle>
          </DialogHeader>
          
          {imageViewBook?.cover_url && (
            <div className="flex flex-col items-center gap-4">
              <Image
                src={imageViewBook.cover_url}
                alt={`Обкладинка: ${imageViewBook.title}`}
                width={300}
                height={450}
                className="rounded-lg object-cover border border-slate-200 shadow-lg"
              />
              <div className="text-center">
                <p className="font-medium text-slate-900">{imageViewBook.title}</p>
                <p className="text-sm text-slate-600">{imageViewBook.author}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => imageViewBook.cover_url && window.open(imageViewBook.cover_url, '_blank')}
                className="w-full"
              >
                <ExternalLink className="size-4 mr-2" />
                Відкрити в повному розмірі
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}