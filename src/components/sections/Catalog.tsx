'use client';
import { useState, useMemo } from 'react';
import { Search, X, Sparkles, BookOpen, Castle, Wand2 } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import type { Book } from '@/lib/types';

const CATEGORIES = ['Новинки', 'Дитяча література', 'Казки', 'Фентезі'];

export function Catalog({ books }: { books: Book[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Фільтрація книг за пошуком та категоріями
  const filteredBooks = useMemo(() => {
    let filtered = books;

    // Фільтр за категорією
    if (selectedCategory) {
      if (selectedCategory === 'Новинки') {
        filtered = filtered.filter(book => book.badges?.includes('Нове') || book.status === 'Нове');
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
        book.category.toLowerCase().includes(query)
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-4xl mx-auto">
          {CATEGORIES.map((category, index) => {
            const IconComponent = [Sparkles, BookOpen, Castle, Wand2][index];
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`transition-transform duration-200 ${
                    selectedCategory === category ? '' : 'group-hover:scale-110'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      selectedCategory === category ? 'text-white' : 'text-slate-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-semibold text-sm ${
                      selectedCategory === category ? 'text-white' : 'text-slate-900'
                    }`}>
                      {category}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </header>

      {/* Результати */}
      {items.length > 0 ? (
        <div
          className="
            grid grid-cols-1 gap-8
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {items.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600 mb-4">Книги не знайдені</p>
          <p className="text-sm text-slate-500">Спробуйте змінити пошуковий запит або обрати іншу категорію</p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Скинути фільтри
            </button>
          )}
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
