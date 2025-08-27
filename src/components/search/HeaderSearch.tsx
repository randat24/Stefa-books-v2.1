'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BOOKS } from '@/lib/mock';

interface SearchResults {
  categories: string[];
  authors: string[];
  books: typeof BOOKS;
}

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
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

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    // Extract unique categories and authors from books
    const categories = [...new Set(BOOKS.map(book => book.category))];
    const authors = [...new Set(BOOKS.map(book => book.author))];
    
    // Filter results based on query
    const matchedCategories = categories.filter(cat => 
      cat.toLowerCase().includes(normalizedQuery)
    );
    
    const matchedAuthors = authors.filter(author => 
      author.toLowerCase().includes(normalizedQuery)
    );
    
    const matchedBooks = BOOKS.filter(book => {
      const searchText = `${book.title} ${book.author} ${book.category} ${book.short || ''}`.toLowerCase();
      return searchText.includes(normalizedQuery);
    });

    setSearchResults({
      categories: matchedCategories,
      authors: matchedAuthors,
      books: matchedBooks
    });
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

  const handleInputChange = (value: string) => {
    setQuery(value);
    performSearch(value);
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          {/* Click outside to close */}
          <div 
            className="absolute inset-0" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Search Container */}
          <div className="relative top-20 mx-auto max-w-2xl px-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[80vh] overflow-hidden">
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
              
              {/* Search Results */}
              {searchResults && (
                <div className="border-t border-slate-100 p-4 space-y-4 overflow-y-auto max-h-[60vh]">
                  {/* Books */}
                  {searchResults.books.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-600 text-sm font-medium">Книжки</h3>
                        <button className="text-slate-500 text-sm hover:text-slate-700 transition flex items-center gap-1">
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
                              <img 
                                src={book.cover} 
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
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
                        <button className="text-slate-500 text-sm hover:text-slate-700 transition flex items-center gap-1">
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
                              {BOOKS.filter(book => book.category === category).length} книг
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
                              {BOOKS.filter(book => book.author === author).length} книг
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Action */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={handleSearch}
                      className="w-full py-3 bg-yellow-500 text-slate-900 font-medium rounded-full hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                    >
                      Усі результати
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!searchResults && query && (
                <div className="p-8 text-center border-t border-slate-100">
                  <div className="text-slate-500 mb-2">Почніть вводити, щоб побачити результати</div>
                </div>
              )}
              
              {/* Initial State */}
              {!query && (
                <div className="p-8 text-center border-t border-slate-100">
                  <div className="text-slate-500 mb-4">Введіть назву книги, автора або категорію</div>
                  <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-yellow-500 text-slate-900 font-medium rounded-full hover:bg-yellow-400 transition"
                  >
                    Переглянути каталог
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}