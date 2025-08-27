'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, SlidersHorizontal, BookOpen, Users, Grid3X3 } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { Badge } from '@/components/ui/Badge';
import { FilterPopup } from '@/components/filters/FilterPopup';
import type { Book } from '@/lib/types';
import { logger } from '@/lib/logger';

interface SearchFilters {
  categories: string[];
  authors: string[];
  searchMode: 'simple';
}

interface SimpleSearchProps {
  books: Book[];
  onSearchResults?: (results: Book[]) => void;
}

export function SimpleSearch({ books, onSearchResults }: SimpleSearchProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    authors: [],
    searchMode: 'simple'
  });

  // State to track displayed books
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>(books);

  // Extract filter options from books
  const filterOptions = {
    categories: [...new Set(books.map(book => book.category))].sort(),
    authors: [...new Set(books.map(book => book.author))].sort()
  };

  // Simple search function
  const performSimpleSearch = (searchQuery: string) => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    if (!normalizedQuery) {
      // No search query - apply only filters
      const filtered = applyFilters(books);
      setDisplayedBooks(filtered);
      onSearchResults?.(filtered);
      return;
    }

    setIsSearching(true);
    const startTime = performance.now();

    try {
      // First apply filters
      let searchableBooks = applyFilters(books);
      
      // Then search within filtered books
      const results = searchableBooks.filter(book => {
        const searchText = `${book.title} ${book.author} ${book.category} ${book.short || ''}`.toLowerCase();
        return searchText.includes(normalizedQuery);
      });

      const endTime = performance.now();
      const searchTime = endTime - startTime;

      setDisplayedBooks(results);
      onSearchResults?.(results);

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

  // Initialize displayed books
  useEffect(() => {
    setDisplayedBooks(books);
  }, [books]);

  // Handle URL search parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setQuery(urlSearch);
      performSimpleSearch(urlSearch);
    }
  }, [searchParams, books]);

  // Apply filters when they change and no search query
  useEffect(() => {
    if (!query) {
      const filtered = applyFilters(books);
      setDisplayedBooks(filtered);
      onSearchResults?.(filtered);
    }
  }, [filters, books, onSearchResults, query]);

  // Perform search when query changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSimpleSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const clearSearch = () => {
    setQuery('');
    const filtered = applyFilters(books);
    setDisplayedBooks(filtered);
    onSearchResults?.(filtered);
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

  const activeFilterCount = filters.categories.length + filters.authors.length;

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
            : `${displayedBooks.length} з ${books.length} книг`
          }
        </div>
      )}

      {/* Search Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {displayedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

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