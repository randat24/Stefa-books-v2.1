"use client";

import { useState, useEffect } from "react";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { getRecentViews, clearRecentViews } from "@/lib/recentViews";
import { fetchBook } from "@/lib/api/books";
import { History, X, Loader2 } from "lucide-react";
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

  const loadRecentViews = async () => {
    try {
      setIsLoading(true);
      const recentIds = getRecentViews().slice(0, maxItems);
      
      if (recentIds.length === 0) {
        setRecentBooks([]);
        setIsLoading(false);
        return;
      }

      console.log('📚 RecentViews: Loading recent books:', recentIds);

      // Load books from API by IDs
      const bookPromises = recentIds.map(recentView => fetchBook(recentView.id));
      const bookResponses = await Promise.all(bookPromises);
      
      const validBooks = bookResponses
        .filter(response => response.success && response.data)
        .map(response => response.data!)
        .filter((book): book is Book => book !== undefined);

      setRecentBooks(validBooks);
      
      console.log('✅ RecentViews: Loaded recent books:', validBooks.length);
      
    } catch (error) {
      console.error('💥 RecentViews: Error loading recent books:', error);
      setRecentBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecentViews();
    
    // Listen for updates to recent views
    const handleRecentViewsUpdate = () => {
      loadRecentViews();
    };

    window.addEventListener("recentViewsUpdated", handleRecentViewsUpdate);
    
    return () => {
      window.removeEventListener("recentViewsUpdated", handleRecentViewsUpdate);
    };
  }, [maxItems]);

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

  // Don't render if no recent views
  if (recentBooks.length === 0) {
    return null;
  }

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
              <a href="/books">
                Переглянути всі книги
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}