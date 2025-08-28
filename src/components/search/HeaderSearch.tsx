'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, ShoppingBag, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchBooks, fetchCategories } from '@/lib/api/books';
import type { Book } from '@/lib/supabase';

interface SearchResults {
  categories: string[];
  authors: string[];
  books: Book[];
}

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    
    try {
      console.log('🔍 HeaderSearch: Searching for:', searchQuery);

      // Поиск книг и получение категорий параллельно
      const [booksResponse, categoriesResponse] = await Promise.all([
        searchBooks(searchQuery, 10), // Ограничиваем до 10 результатов для заголовка
        fetchCategories()
      ]);

      if (booksResponse.success && categoriesResponse.success) {
        const books = booksResponse.data;
        const allCategories = categoriesResponse.data;
        
        // Извлекаем уникальных авторов из найденных книг
        const authors = [...new Set(books.map(book => book.author))];
        
        // Фильтруем категории по запросу
        const normalizedQuery = searchQuery.toLowerCase().trim();
        const matchedCategories = allCategories.filter(cat => 
          cat.toLowerCase().includes(normalizedQuery)
        );

        setSearchResults({
          categories: matchedCategories,
          authors: authors,
          books: books
        });

        console.log('✅ HeaderSearch: Found results:', {
          categories: matchedCategories.length,
          authors: authors.length,
          books: books.length
        });
      } else {
        console.error('❌ HeaderSearch: Search failed');
        setSearchResults(null);
      }

    } catch (error) {
      console.error('💥 HeaderSearch: Search error:', error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/books?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    } else {
      router.push('/books');
      setIsOpen(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setSearchResults(null);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setIsSearching(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
        aria-label="Пошук книг"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Search Modal/Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm">
          {/* Click outside to close */}
          <div 
            className="absolute inset-0" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Search Container */}
          <div className="relative top-20 mx-auto max-w-2xl px-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[80vh] overflow-hidden flex flex-col">
              {/* Search Bar */}
              <div className="flex items-center px-4 py-3">
                <Search className="h-5 w-5 text-slate-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Пошук книг за назвою, автором, категорією..."
                  className="flex-1 bg-transparent text-slate-900 placeholder-slate-500 text-lg outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-3 p-1 hover:bg-slate-100 rounded-md transition"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>
              
              {/* Loading State */}
              {isSearching && (
                <div className="border-t border-slate-100 p-4 flex-1 flex items-center justify-center">
                  <div className="flex items-center justify-center py-8 text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Пошук...</span>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults && !isSearching && (
                <>
                  {/* Scrollable Content */}
                  <div className="border-t border-slate-100 p-4 space-y-4 overflow-y-auto flex-1 min-h-0">
                    {/* Books */}
                    {searchResults.books.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-slate-600 text-sm font-medium">Книжки</h3>
                          <button 
                            onClick={() => {
                              router.push(`/books?search=${encodeURIComponent(query)}`);
                              setIsOpen(false);
                            }}
                            className="text-slate-500 text-sm hover:text-slate-700 transition flex items-center gap-1"
                          >
                            Усі →
                          </button>
                        </div>
                        <div className="space-y-3">
                          {searchResults.books.slice(0, 3).map((book) => (
                            <button
                              key={book.id}
                              onClick={() => {
                                router.push(`/books/${book.id}`);
                                setIsOpen(false);
                              }}
                              className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition w-full text-left"
                            >
                              <div className="h-16 w-12 rounded-lg overflow-hidden bg-slate-100">
                                {book.cover_url ? (
                                  <img 
                                    src={book.cover_url} 
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                    <ShoppingBag className="h-6 w-6 text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="text-slate-900 font-medium line-clamp-1">{book.title}</div>
                                <div className="text-slate-600 text-sm">{book.author}</div>
                              </div>
                              <div className="text-slate-400">
                                <ShoppingBag className="h-5 w-5" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categories */}
                    {searchResults.categories.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-slate-600 text-sm font-medium">Категорії</h3>
                          <button 
                            onClick={() => {
                              router.push('/books');
                              setIsOpen(false);
                            }}
                            className="text-slate-500 text-sm hover:text-slate-700 transition flex items-center gap-1"
                          >
                            Усі →
                          </button>
                        </div>
                        <div className="space-y-2">
                          {searchResults.categories.slice(0, 3).map((category, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                router.push(`/books?category=${encodeURIComponent(category)}`);
                                setIsOpen(false);
                              }}
                              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition w-full text-left"
                            >
                              <div className="text-slate-700 text-sm">{category}</div>
                              <div className="text-slate-400 text-xs ml-auto">
                                {searchResults?.books.filter(book => book.category === category).length || 0} книг
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Authors */}
                    {searchResults.authors.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-slate-600 text-sm font-medium">Автори</h3>
                          <button className="text-slate-500 text-sm hover:text-slate-700 transition flex items-center gap-1">
                            Усі →
                          </button>
                        </div>
                        <div className="space-y-2">
                          {searchResults.authors.slice(0, 3).map((author, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                router.push(`/books?search=${encodeURIComponent(author)}`);
                                setIsOpen(false);
                              }}
                              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition w-full text-left"
                            >
                              <div className="text-slate-700 text-sm">{author}</div>
                              <div className="text-slate-400 text-xs ml-auto">
                                {searchResults?.books.filter(book => book.author === author).length || 0} книг
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fixed Bottom Action */}
                  <div className="border-t border-slate-100 p-4 bg-white">
                    <button
                      onClick={handleSearch}
                      className="w-full py-3 bg-yellow-500 text-slate-900 font-medium rounded-full hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                    >
                      Усі результати
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}

              {/* Empty State */}
              {!searchResults && query && (
                <>
                  <div className="p-8 text-center border-t border-slate-100 flex-1 flex items-center justify-center">
                    <div className="text-slate-500">Результатів не знайдено</div>
                  </div>
                  {/* Fixed Bottom Action */}
                  <div className="border-t border-slate-100 p-4 bg-white">
                    <button
                      onClick={handleSearch}
                      className="w-full py-3 bg-yellow-500 text-slate-900 font-medium rounded-full hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                    >
                      Переглянути всі книги
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
              
              {/* Initial State */}
              {!query && (
                <>
                  <div className="p-8 text-center border-t border-slate-100 flex-1 flex items-center justify-center">
                    <div>
                      <div className="text-slate-500 mb-4">Введіть назву книги, автора або категорію</div>
                      <div className="text-slate-400 text-sm">Або переглядайте весь каталог</div>
                    </div>
                  </div>
                  {/* Fixed Bottom Action */}
                  <div className="border-t border-slate-100 p-4 bg-white">
                    <button
                      onClick={handleSearch}
                      className="w-full py-3 bg-yellow-500 text-slate-900 font-medium rounded-full hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                    >
                      Переглянути каталог
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}