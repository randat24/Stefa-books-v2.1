'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useSearch } from './SearchProvider';
import { BookCard } from '@/components/BookCard';
import { Badge } from '@/components/ui/Badge';
import type { Book } from '@/lib/types';
import { logger } from '@/lib/logger';

interface SearchFilters {
  categories: string[];
  priceRange: [number, number];
  authors: string[];
  searchMode: 'fuzzy' | 'semantic' | 'hybrid';
}

interface AdvancedSearchProps {
  books: Book[];
  onSearchResults?: (results: Book[]) => void;
}

export function AdvancedSearch({ books, onSearchResults }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    priceRange: [0, 1000],
    authors: [],
    searchMode: 'hybrid'
  });

  // Use integrated search context
  const { 
    performSearch, 
    getSuggestions, 
    searchResults, 
    searchStats, 
    isSearching, 
    clearSearch,
    isInitialized 
  } = useSearch();

  // State to track filtered books for when there's no search query
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>(books);

  // Helper function to apply current filters to books
  const applyFiltersToBooks = (booksToFilter: Book[]) => {
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

  // Extract filter options from books
  const filterOptions = {
    categories: [...new Set(books.map(book => book.category))].sort(),
    authors: [...new Set(books.map(book => book.author))].sort(),
    maxPrice: 1000 // Default max price since books don't have price field currently
  };

  // Handle autocomplete suggestions
  useEffect(() => {
    if (query.length >= 2 && isInitialized) {
      const newSuggestions = getSuggestions(query);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, getSuggestions, isInitialized]);

  // Initialize displayed books when books prop changes
  useEffect(() => {
    setDisplayedBooks(books);
  }, [books]);

  // Apply filters to books when no search query
  useEffect(() => {
    if (!query) {
      const filteredBooks = applyFiltersToBooks(books);
      setDisplayedBooks(filteredBooks);
      onSearchResults?.(filteredBooks);
    }
  }, [filters, query, books, onSearchResults]);

  // Update parent component when search results change
  useEffect(() => {
    if (query && searchResults) {
      onSearchResults?.(searchResults);
    }
  }, [searchResults, onSearchResults, query]);

  // Perform search using integrated search context
  const performSearchWithFilters = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      clearSearch();
      return;
    }

    if (!isInitialized) {
      logger.warn('Search engines not initialized yet');
      return;
    }

    try {
      // Convert our local filters to the format expected by performSearch
      const searchFilters = {
        categories: filters.categories,
        authors: filters.authors
      };

      await performSearch(searchQuery, {
        mode: filters.searchMode,
        filters: searchFilters
      });

    } catch (error) {
      logger.error('Search error', error);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowSuggestions(false);
    performSearchWithFilters(searchQuery);
  };

  const clearLocalSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    clearSearch();
    // Reset to showing filtered books based on current filters
    const filteredBooks = applyFiltersToBooks(books);
    setDisplayedBooks(filteredBooks);
    onSearchResults?.(filteredBooks);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (query.trim()) {
      // If there's a search query, perform search with new filters
      performSearchWithFilters(query);
    } else {
      // If no search query, just apply filters to all books
      const filteredBooks = applyFiltersToBooks(books);
      setDisplayedBooks(filteredBooks);
      onSearchResults?.(filteredBooks);
    }
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, filterOptions.maxPrice],
      authors: [],
      searchMode: 'hybrid'
    });
    
    if (query.trim()) {
      performSearchWithFilters(query);
    } else {
      // Reset to showing all books when no search query
      setDisplayedBooks(books);
      onSearchResults?.(books);
    }
  };

  const activeFilterCount = filters.categories.length + filters.authors.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < filterOptions.maxPrice ? 1 : 0);

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
            disabled={!isInitialized}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                onClick={clearLocalSearch}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-accent">
                  {activeFilterCount}
                </Badge>
              )}
            </button>
            <button
              onClick={() => handleSearch(query)}
              disabled={isSearching || !isInitialized}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Пошук...' : 'Знайти'}
            </button>
          </div>
        </div>

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-lg z-50">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 p-6 border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Розширені фільтри
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Очистити всі
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search Mode */}
            <div>
              <label className="block text-sm font-medium mb-2">Режим пошуку</label>
              <select
                value={filters.searchMode}
                onChange={(e) => updateFilter('searchMode', e.target.value as SearchFilters['searchMode'])}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="hybrid">Гібридний (рекомендований)</option>
                <option value="fuzzy">Нечіткий пошук</option>
                <option value="semantic">Семантичний пошук</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium mb-2">Категорії</label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {filterOptions.categories.map(category => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...filters.categories, category]
                          : filters.categories.filter(c => c !== category);
                        updateFilter('categories', newCategories);
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Authors */}
            <div>
              <label className="block text-sm font-medium mb-2">Автори</label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {filterOptions.authors.slice(0, 10).map(author => (
                  <label key={author} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.authors.includes(author)}
                      onChange={(e) => {
                        const newAuthors = e.target.checked
                          ? [...filters.authors, author]
                          : filters.authors.filter(a => a !== author);
                        updateFilter('authors', newAuthors);
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{author}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Stats */}
      {(query || activeFilterCount > 0) && (
        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {query 
              ? `${searchResults?.length || 0} результатів пошуку за ${searchStats.searchTime.toFixed(0)} мс`
              : `${displayedBooks.length} книг з ${books.length}`
            }
          </span>
          {searchStats.correctedQuery && (
            <span className="text-accent">
              Виправлено: "{searchStats.correctedQuery}"
            </span>
          )}
          {activeFilterCount > 0 && (
            <Badge variant="secondary">
              {activeFilterCount} активних фільтрів
            </Badge>
          )}
        </div>
      )}

      {/* Search Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {(query ? (searchResults || []) : displayedBooks).map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* No Results */}
      {((query && (!searchResults || searchResults.length === 0)) || (!query && displayedBooks.length === 0)) && !isSearching && (
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
  );
}