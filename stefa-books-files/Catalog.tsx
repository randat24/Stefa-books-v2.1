'use client';
import { useState, useMemo, useEffect } from 'react';
import { Search, X, BookOpen, Wand2, Loader2, Brain, Globe, Heart, Baby, ScrollText, Star, Crown, GraduationCap, Compass, BookText, Palette, BookMarked } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { fetchBooks, fetchCategories, type Category } from '@/lib/api/books';
import type { Book } from '@/lib/supabase';
import Link from 'next/link';

export function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Показываем ровно 18 книг (3 ряда по 6) на главной странице

  // Загружаем книги и категории при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем книги и категории параллельно - ровно 18 книг для 3 рядов по 6
        const [booksResponse, categoriesResponse] = await Promise.all([
          fetchBooks({ limit: 18 }), // Ровно 18 книг для 3 рядов по 6
          fetchCategories()
        ]);

        if (booksResponse.success && booksResponse.data) {
          setBooks(booksResponse.data);
        } else {
          console.error('❌ Catalog: Books response failed:', booksResponse)
          throw new Error(booksResponse.error || 'Ошибка загрузки книг');
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        } else {
          console.error('❌ Catalog: Categories response failed:', categoriesResponse)
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Фільтрація книг за пошуком та категоріями
  const filteredBooks = useMemo(() => {
    let filtered = books;

    // Фільтр за категорією
    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Фільтр за пошуковим запитом
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query) ||
        (book.description && book.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [books, searchQuery, selectedCategory]);

  // Отображение элементов - показываем все книги или заглушки для 18 карточек (3 ряда по 6)
  const items = filteredBooks.slice(0, 18);

  console.log('📚 Catalog: Final items to display:', { 
    total: books.length, 
    filtered: filteredBooks.length, 
    displayed: items.length,
    items: items.map(b => ({ id: b.id, title: b.title, author: b.author })),
    showPlaceholders: items.length === 0,
    expectedRows: Math.ceil(items.length / 6) // Ожидаемое количество рядов
  });

  return (
    <section className="px-6">
      <header className="mb-12 text-center">
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="h2 text-slate-900 mb-4">Каталог книг</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">Оберіть потрібну книгу. Зверніть увагу, що ми постійно оновлюємо каталог. Якщо ви не знайшли бажаної книги, напишіть нам у будь-який зручний спосіб.</p>
          
          {/* Пошук та кнопка каталогу */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Пошук за назвою, автором або категорією..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              )}
            </div>
            <Link
              href="/books"
              className="inline-flex items-center whitespace-nowrap rounded-2xl bg-slate-900 px-6 h-12 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Увесь каталог →
            </Link>
          </div>
        </div>
        
        {/* Категорії - максимум 2 ряди (10 категорій) */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-6xl mx-auto">
            {categories.slice(0, 10).map((category) => {
              // Получаем правильную иконку для каждой категории
              const getCategoryIcon = (slug: string) => {
                switch (slug) {
                  case 'fairy-tales': return Crown
                  case 'educational': return GraduationCap
                  case 'mystery': return Search
                  case 'adventure': return Compass
                  case 'novel': return BookText
                  case 'fantasy': return Wand2
                  case 'realistic': return Globe
                  case 'romance': return Heart
                  case 'toddlers': return Baby
                  case 'preschool': return Palette
                  case 'elementary': return BookOpen
                  case 'middle-grade': return ScrollText
                  case 'teen': return Star
                  case 'psychology': return Brain
                  case 'contemporary': return BookMarked
                  default: return BookOpen
                }
              }
              
              const IconComponent = getCategoryIcon(category.slug);
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border-2 transition-all duration-200 text-xs relative z-20 ${
                    selectedCategory === category.name
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${
                    selectedCategory === category.name ? 'text-white' : 'text-slate-600'
                  }`} />
                  <span className={`font-medium text-xs whitespace-nowrap leading-tight ${
                    selectedCategory === category.name ? 'text-white' : 'text-slate-900'
                  }`}>
                    {category.name}
                  </span>
                  <span className={`text-xs px-0.5 py-0.5 rounded-full ${
                    selectedCategory === category.name 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {category.book_count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Загрузка */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg font-medium">Завантаження книг...</span>
          </div>
        </div>
      )}

      {/* Ошибка */}
      {error && !loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full mb-4">
            <X className="w-4 h-4" />
            <span className="font-medium">Помилка завантаження</span>
          </div>
          <p className="text-sm text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            Спробувати знову
          </button>
        </div>
      )}

      {/* Результати */}
      {!loading && !error && (
        <>
          {/* Сетка книг - всегда показываем 18 карточек (3 ряда по 6) с фиксированными размерами */}
          <div className="flex flex-wrap justify-start gap-6 max-w-7xl">
            {items.length > 0 ? (
              // Показываем реальные книги
              items.map((b) => (
                <BookCard key={b.id} book={b} />
              ))
            ) : (
              // Показываем заглушки для 18 карточек (3 ряда по 6)
              Array.from({ length: 18 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center min-h-[280px] shadow-sm w-full max-w-[240px]">
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-300" />
                  </div>
                  <div className="text-center w-full">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">Карточка {index + 1}</div>
                </div>
              ))
            )}
          </div>
          
          {/* Кнопка "Перейти в каталог" - показываем всегда на главной странице */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-medium"
            >
              Перейти в повний каталог →
            </Link>
          </div>
        </>
      )}

      {/* Пусто */}
      {!loading && !error && items.length === 0 && books.length > 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600 mb-4">Книги не знайдені</p>
          <p className="text-sm text-slate-500 mb-4">Спробуйте змінити пошуковий запит або обрати іншу категорію</p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              Скинути фільтри
            </button>
          )}
        </div>
      )}

      {/* Нет книг в базе */}
      {!loading && !error && books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-600 mb-4">Каталог порожній або завантажується</p>
          <p className="text-sm text-slate-500 mb-4">Книги скоро з&apos;являться у нашому каталозі</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            Оновити сторінку
          </button>
        </div>
      )}
      
      {/* Показуємо кількість знайдених книг */}
      {(searchQuery || selectedCategory) && (
        <div className="mt-8 text-center text-sm text-slate-500">
          Показано {items.length} з {filteredBooks.length} книг
          {filteredBooks.length > 18 && (
            <span className="block mt-2">
              Перейдіть в повний каталог для перегляду всіх результатів
            </span>
          )}
        </div>
      )}
    </section>
  );
}
