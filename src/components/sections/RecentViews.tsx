"use client";

import { useState, useEffect, useCallback } from "react";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { getRecentViews, clearRecentViews, removeFromRecentViews } from "@/lib/recentViews";
import { fetchBooks, fetchBook } from "@/lib/api/books";
import { History, X, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/lib/supabase";

interface RecentViewsProps {
  title?: string;
  subtitle?: string;
  maxItems?: number;
  showClearButton?: boolean;
}

export function RecentViews({ 
  title = "Нещодавно переглянуті", 
  subtitle = "Книги, які ви переглядали останнім часом",
  maxItems = 6,
  showClearButton = true
}: RecentViewsProps) {
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasBooksInDatabase, setHasBooksInDatabase] = useState(false);

  // Check if there are books in the database
  const checkDatabaseForBooks = useCallback(async () => {
    try {
      const result = await fetchBooks({ limit: 1 });
      setHasBooksInDatabase(result.success && result.data && result.data.length > 0);
    } catch (error) {
      console.warn('⚠️ RecentViews: Failed to check database for books:', error);
      setHasBooksInDatabase(false);
    }
  }, []);

  const loadRecentViews = useCallback(async () => {
    // Don't load recent views if there are no books in database
    if (!hasBooksInDatabase) {
      console.log('📋 RecentViews: No books in database, skipping recent views')
      setRecentBooks([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 RecentViews: Loading recent views...')
      
      const recentViews = getRecentViews();
      console.log('📋 RecentViews: Found', recentViews.length, 'recent views')
      
      if (recentViews.length === 0) {
        console.log('📋 RecentViews: No recent views found')
        setRecentBooks([]);
        return;
      }
      
      // Filter out invalid IDs and limit to maxItems
      const validIds = recentViews
        .filter(recentView => recentView.id && recentView.id.trim() !== '')
        .slice(0, maxItems);
      
      if (validIds.length === 0) {
        console.log('📋 RecentViews: No valid IDs found')
        setRecentBooks([]);
        return;
      }
      
      console.log('📚 RecentViews: Loading', validIds.length, 'books...')
      
      const bookPromises = validIds.map(async (recentView) => {
        try {
          const result = await fetchBook(recentView.id);
          
          // Check if the book was found successfully
          if (result.success && result.data) {
            return result.data;
          } else {
            console.warn('⚠️ RecentViews: Book not found or failed to load:', recentView.id, result.error);
            // Remove invalid book from recent views
            removeFromRecentViews(recentView.id);
            return null;
          }
        } catch (error) {
          console.warn('⚠️ RecentViews: Failed to load book:', recentView.id, error);
          // Remove invalid book from recent views
          removeFromRecentViews(recentView.id);
          return null;
        }
      });
      
      const bookResponses = await Promise.all(bookPromises);
      
      const validBooks = bookResponses
        .filter((book): book is Book => book !== null && book !== undefined);

      console.log('✅ RecentViews: Books loaded successfully:', validBooks.length)
      setRecentBooks(validBooks);
      
    } catch (error) {
      console.error('❌ RecentViews: Error loading recent views:', error)
      setRecentBooks([]);
    } finally {
      setIsLoading(false);
      console.log('🏁 RecentViews: Data loading completed')
    }
  }, [maxItems, hasBooksInDatabase]);

  useEffect(() => {
    // First check if there are books in database
    checkDatabaseForBooks();
  }, [checkDatabaseForBooks]);

  useEffect(() => {
    // Then load recent views if books exist
    if (hasBooksInDatabase) {
      loadRecentViews();
    }
    
    // Listen for updates to recent views
    const handleRecentViewsUpdate = () => {
      if (hasBooksInDatabase) {
        loadRecentViews();
      }
    };

    window.addEventListener("recentViewsUpdated", handleRecentViewsUpdate);
    
    return () => {
      window.removeEventListener("recentViewsUpdated", handleRecentViewsUpdate);
    };
  }, [loadRecentViews, hasBooksInDatabase]);

  const handleClearAll = () => {
    if (window.confirm("Очистити історію перегляду книг?")) {
      clearRecentViews();
    }
  };

  // Show loading state briefly
  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-slate-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-lg font-medium">Завантаження історії...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Validate recent books data
  if (recentBooks.length > 0) {
    console.log('📚 RecentViews: Valid recent books data:', recentBooks.map(b => ({ id: b.id, title: b.title, author: b.author })))
  }

  // Don't render if no books in database or no recent views
  if (!hasBooksInDatabase || recentBooks.length === 0) {
    console.log('📋 RecentViews: No books in database or no recent views, hiding section')
    return null;
  }

  console.log('📚 RecentViews: Rendering with', recentBooks.length, 'books')

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-4">
            <History className="h-4 w-4" />
            Історія перегляду
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            {subtitle}
          </p>
          
          {showClearButton && recentBooks.length > 0 && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="md" 
                onClick={handleClearAll}
              >
                <X className="h-4 w-4 mr-2" />
                Очистити
              </Button>
            </div>
          )}
        </div>

        {/* Books grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {recentBooks.map((book, index) => (
            <div key={book.id} className="relative">
              {/* Recently viewed indicator */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                {index + 1}
              </div>
              <BookCard book={book} />
            </div>
          ))}
        </div>

        {/* Show more books button */}
        {recentBooks.length >= maxItems && (
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/books">
                Переглянути всі книги
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}