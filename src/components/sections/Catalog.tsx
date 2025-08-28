'use client';
import { useState, useMemo, useEffect } from 'react';
import { Search, X, Sparkles, BookOpen, Castle, Wand2, Loader2 } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { fetchNewBooks, fetchCategories } from '@/lib/api/books';
import type { Book } from '@/lib/supabase';

export function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем книги и категории при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем книги и категории параллельно
        const [booksResponse, categoriesResponse] = await Promise.all([
          fetchNewBooks(20), // Больше книг для главной
          fetchCategories()
        ]);

        if (booksResponse.success) {
          setBooks(booksResponse.data);
          console.log('✅ Catalog: Loaded books:', booksResponse.data.length);
        } else {
          throw new Error(booksResponse.error || 'Ошибка загрузки книг');
        }

        if (categoriesResponse.success) {
          // Добавляем "Новинки" в начало списка категорий
          const allCategories = ['Новинки', ...categoriesResponse.data];
          setCategories(allCategories);
          console.log('✅ Catalog: Loaded categories:', allCategories);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(errorMessage);
        console.error('💥 Catalog: Error loading data:', err);
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
      if (selectedCategory === 'Новинки') {
        // Для "Новинки" показываем последние добавленные книги (уже отсортированы по created_at DESC)
        filtered = books.slice(0, 12);
      } else {
        filtered = filtered.filter(book => book.category === selectedCategory);
      }
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

  // максимум 8 штук = 2 ряда по 4 на десктопе
  const items = filteredBooks.slice(0, 8);

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
            <a
              href="/books"
              className="inline-flex items-center whitespace-nowrap rounded-2xl bg-slate-900 px-6 h-12 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Увесь каталог →
            </a>
          </div>
        </div>
        
        {/* Категорії */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-4xl mx-auto">
            {categories.slice(0, 8).map((category, index) => {
              // Иконки для первых 4 категорий, затем повторяем
              const IconComponent = [Sparkles, BookOpen, Castle, Wand2][index % 4];
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-full border transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${
                    selectedCategory === category ? 'text-white' : 'text-slate-600'
                  }`} />
                  <span className={`font-medium text-sm whitespace-nowrap ${
                    selectedCategory === category ? 'text-white' : 'text-slate-900'
                  }`}>
                    {category}
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
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
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
          <p className="text-lg text-slate-600 mb-4">Каталог порожній</p>
          <p className="text-sm text-slate-500">Книги скоро з'являться у нашому каталозі</p>
        </div>
      )}
      
      {/* Показуємо кількість знайдених книг */}
      {(searchQuery || selectedCategory) && (
        <div className="mt-8 text-center text-sm text-slate-500">
          Показано {items.length} з {filteredBooks.length} книг
          {filteredBooks.length > 8 && (
            <span className="block mt-2">
              Переглядьте весь каталог для перегляду всіх результатів
            </span>
          )}
        </div>
      )}
    </section>
  );
}
