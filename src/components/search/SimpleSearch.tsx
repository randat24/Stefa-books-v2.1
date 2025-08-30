'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal, Loader2, ChevronDown } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { FilterPopup } from '@/components/filters/FilterPopup';
import { fetchBooks, fetchCategories } from '@/lib/api/books';
import type { Book } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface SearchFilters {
  categories: string[];
  authors: string[];
  searchMode: 'simple';
}

interface SimpleSearchProps {
  onSearchResults?: (results: Book[]) => void;
}

export function SimpleSearch({ onSearchResults }: SimpleSearchProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    authors: [],
    searchMode: 'simple'
  });

  // State to track all books and displayed books
  const [books, setBooks] = useState<Book[]>([]);
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Load more state - 20 книг за раз (4 ряды по 5 книг)
  const [visibleCount, setVisibleCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 SimpleSearch: Starting to load data...')
        setLoading(true);
        setError(null);

        // Load books and categories in parallel
        console.log('🔄 SimpleSearch: Loading books and categories in parallel...')
        const [booksResponse, categoriesResponse] = await Promise.all([
          fetchBooks({ limit: 100 }), // Load more books for catalog page
          fetchCategories()
        ]);

        console.log('📚 SimpleSearch: Books response:', { 
          success: booksResponse.success, 
          count: booksResponse.count, 
          hasData: !!booksResponse.data,
          error: booksResponse.error 
        })

        if (booksResponse.success) {
          setBooks(booksResponse.data);
          setDisplayedBooks(booksResponse.data);
          setHasMore(booksResponse.data.length > visibleCount);
          console.log('✅ SimpleSearch: Books loaded successfully:', booksResponse.data.length)
        } else {
          throw new Error(booksResponse.error || 'Ошибка загрузки книг');
        }

        console.log('📂 SimpleSearch: Categories response:', { 
          success: categoriesResponse.success, 
          count: categoriesResponse.count, 
          hasData: !!categoriesResponse.data,
          error: categoriesResponse.error 
        })

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data.map(cat => cat.name));
          console.log('✅ SimpleSearch: Categories loaded successfully:', categoriesResponse.data.length)
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
        console.error('❌ SimpleSearch: Error loading data:', err)
        setError(errorMessage);
        // Error logging removed for production
      } finally {
        setLoading(false);
        console.log('🏁 SimpleSearch: Data loading completed')
      }
    };

    loadData();
  }, []);

  // Extract filter options from loaded books
  const filterOptions = {
    categories: categories.length > 0 ? categories : [...new Set(books.map(book => book.category))].sort(),
    authors: [...new Set(books.map(book => book.author))].sort()
  };

  // Simple search function
  const performSimpleSearch = (searchQuery: string) => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    if (!normalizedQuery) {
      // No search query - apply only filters
      const filtered = applyFilters(books);
      setDisplayedBooks(filtered);
      setHasMore(filtered.length > visibleCount);
      onSearchResults?.(filtered);
      return;
    }

    setIsSearching(true);
    const startTime = performance.now();

    try {
      // First apply filters
      const searchableBooks = applyFilters(books);
      
      // Then search within filtered books
      const results = searchableBooks.filter(book => {
        const searchText = `${book.title} ${book.author} ${book.category} ${book.short_description || ''}`.toLowerCase();
        return searchText.includes(normalizedQuery);
      });

      const endTime = performance.now();
      const searchTime = endTime - startTime;

      setDisplayedBooks(results);
      setHasMore(results.length > visibleCount);
      onSearchResults?.(results);
      
      // Сброс видимого количества при поиске
      setVisibleCount(15);

      logger.search(`Found ${results.length} results in ${searchTime.toFixed(1)}ms`, { query: searchQuery, resultsCount: results.length, searchTime });
      
    } finally {
      setIsSearching(false);
    }
  };

  // Apply current filters to books
  const applyFilters = (booksToFilter: Book[]) => {
    let filteredBooks = booksToFilter;
    
    if (filters.categories.length > 0) {
      filteredBooks = filteredBooks.filter(book => 
        filters.categories.includes(book.category)
      );
    }
    
    if (filters.authors.length > 0) {
      filteredBooks = filteredBooks.filter(book =>
        filters.authors.includes(book.author)
      );
    }
    
    return filteredBooks;
  };

  // Update displayed books when books change
  useEffect(() => {
    if (!loading && books.length > 0) {
      const filtered = applyFilters(books);
      setDisplayedBooks(filtered);
      setHasMore(filtered.length > visibleCount);
      onSearchResults?.(filtered);
    }
  }, [books, loading, visibleCount]);

  // Handle URL search parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && !loading) {
      setQuery(urlSearch);
      performSimpleSearch(urlSearch);
    }
  }, [searchParams, books, loading]);

  // Apply filters when they change and no search query
  useEffect(() => {
    if (!query && !loading) {
      const filtered = applyFilters(books);
      setDisplayedBooks(filtered);
      setHasMore(filtered.length > visibleCount);
      onSearchResults?.(filtered);
      // Сброс видимого количества при изменении фильтров
      setVisibleCount(15);
    }
  }, [filters, books, onSearchResults, query, loading, visibleCount]);

  // Perform search when query changes
  useEffect(() => {
    if (!loading) {
      const debounceTimer = setTimeout(() => {
        performSimpleSearch(query);
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [query, loading, books]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const clearSearch = () => {
    setQuery('');
    const filtered = applyFilters(books);
    setDisplayedBooks(filtered);
    setHasMore(filtered.length > visibleCount);
    onSearchResults?.(filtered);
    
    // Сброс видимого количества при очистке поиска
    setVisibleCount(20);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      authors: [],
      searchMode: 'simple'
    });
  };

  // Load more books function
  const handleLoadMore = () => {
    const newVisibleCount = visibleCount + 20; // Загружаем еще 4 ряда (20 книг)
    setVisibleCount(newVisibleCount);
    setHasMore(displayedBooks.length > newVisibleCount);
  };

  const activeFilterCount = filters.categories.length + filters.authors.length;

  // Validate books and categories data
  if (books.length > 0) {
    console.log('📚 SimpleSearch: Valid books data:', { count: books.length, firstBook: books[0]?.title })
  }
  
  if (categories.length > 0) {
    console.log('📂 SimpleSearch: Valid categories data:', categories.slice(0, 3))
  }

  // Don't render if no books
  if (!loading && books.length === 0) {
    console.log('📚 SimpleSearch: No books to display')
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-slate-600 mb-4">Каталог завантажується</p>
        <p className="text-sm text-slate-500">Зачекайте, будь ласка...</p>
      </div>
    )
  }

  console.log('📚 SimpleSearch: Rendering with', books.length, 'books, displayed:', displayedBooks.length, 'visible:', visibleCount, 'hasMore:', hasMore)

  // Show loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg font-medium">Завантаження каталогу...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full">
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
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Пошук книг за назвою, автором, категорією..."
            className="w-full h-14 pl-12 pr-24 rounded-full border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                onClick={clearSearch}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilterPopup(true)}
              className="relative p-2 rounded-full transition-colors hover:bg-muted"
              title="Показати каталог фільтрів"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Compact Filter Tags */}
      <div className="mb-4">
        {/* All Filters in One Compact Row */}
        <div className="flex flex-wrap gap-1.5">
          {/* Category Tags */}
          {filterOptions.categories.map(category => (
            <button
              key={category}
              onClick={() => {
                const newCategories = filters.categories.includes(category)
                  ? filters.categories.filter(c => c !== category)
                  : [...filters.categories, category];
                updateFilter('categories', newCategories);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                filters.categories.includes(category)
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-accent/50'
              }`}
            >
              {category}
            </button>
          ))}

          {/* Separator */}
          {filterOptions.categories.length > 0 && filterOptions.authors.length > 0 && (
            <span className="self-center text-border">•</span>
          )}

          {/* Author Tags - First 6 only */}
          {filterOptions.authors.slice(0, 6).map(author => (
            <button
              key={author}
              onClick={() => {
                const newAuthors = filters.authors.includes(author)
                  ? filters.authors.filter(a => a !== author)
                  : [...filters.authors, author];
                updateFilter('authors', newAuthors);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                filters.authors.includes(author)
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-blue-300'
              }`}
            >
              {author}
            </button>
          ))}

          {/* Show More Authors Button */}
          {filterOptions.authors.length > 6 && (
            <button
              onClick={() => setShowFilterPopup(true)}
              className="px-2.5 py-1 text-xs font-medium text-muted-foreground border border-dashed border-border rounded-full hover:text-foreground hover:border-solid transition-all"
            >
              +{filterOptions.authors.length - 6}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mb-4 p-4 border rounded-lg bg-muted/30">
          {/* All Authors Grid */}
          {filterOptions.authors.length > 6 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
              {filterOptions.authors.map(author => (
                <button
                  key={author}
                  onClick={() => {
                    const newAuthors = filters.authors.includes(author)
                      ? filters.authors.filter(a => a !== author)
                      : [...filters.authors, author];
                    updateFilter('authors', newAuthors);
                  }}
                  className={`px-2 py-1 text-xs font-medium rounded border transition-all text-left ${
                    filters.authors.includes(author)
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-border bg-background hover:border-blue-300'
                  }`}
                >
                  {author}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Filters - More Compact */}
      {activeFilterCount > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1 text-xs">
          <span className="text-muted-foreground">Активні:</span>
          
          {/* Selected Categories */}
          {filters.categories.map(category => (
            <button
              key={`active-cat-${category}`}
              onClick={() => {
                const newCategories = filters.categories.filter(c => c !== category);
                updateFilter('categories', newCategories);
              }}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-accent text-accent-foreground rounded hover:bg-accent/80 transition-colors"
            >
              {category}
              <X className="h-3 w-3" />
            </button>
          ))}
          
          {/* Selected Authors */}
          {filters.authors.map(author => (
            <button
              key={`active-author-${author}`}
              onClick={() => {
                const newAuthors = filters.authors.filter(a => a !== author);
                updateFilter('authors', newAuthors);
              }}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors"
            >
              {author}
              <X className="h-3 w-3" />
            </button>
          ))}

          {/* Clear All Button */}
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-muted-foreground hover:text-foreground border border-border rounded hover:bg-muted transition-colors"
          >
            <X className="h-3 w-3" />
            Очистити
          </button>
        </div>
      )}

      {/* Search Stats - More Compact */}
      {(query || activeFilterCount > 0) && (
        <div className="mb-3 text-xs text-muted-foreground">
          {query 
            ? `${displayedBooks.length} результатів пошуку`
            : `Показано ${Math.min(visibleCount, displayedBooks.length)} з ${displayedBooks.length} книг`
          }
        </div>
      )}

      {/* Search Results - исправленная структура 5x4 как на главной странице */}
      <div className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {displayedBooks
          .slice(0, visibleCount)
          .map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
      
      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-medium rounded-full hover:bg-accent/80 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ChevronDown className="w-5 h-5" />
            Завантажити ще 4 ряди книг
          </button>
        </div>
      )}

      {/* No Results */}
      {displayedBooks.length === 0 && !isSearching && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {query ? "Нічого не знайдено" : "Немає книг за вибраними фільтрами"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {query 
              ? "Спробуйте змінити запит або скористайтеся фільтрами"
              : "Спробуйте змінити фільтри або очистити їх"
            }
          </p>
          {(activeFilterCount > 0 || query) && (
            <div className="space-y-2">
              {query && (
                <button
                  onClick={clearSearch}
                  className="text-accent hover:underline mr-4"
                >
                  Очистити пошук
                </button>
              )}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-accent hover:underline"
                >
                  Очистити фільтри
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filter Popup */}
      <FilterPopup 
        isOpen={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
      />
    </div>
  );
}