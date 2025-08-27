"use client";

import { useState, useEffect } from "react";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { getRecentViews, clearRecentViews } from "@/lib/recentViews";
import { BOOKS } from "@/lib/mock";
import { History, X } from "lucide-react";
import type { Book } from "@/lib/types";

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

  const loadRecentViews = () => {
    const recentIds = getRecentViews().slice(0, maxItems);
    const books = recentIds
      .map(id => BOOKS.find(book => book.id === id))
      .filter((book): book is Book => book !== undefined);
    
    setRecentBooks(books);
    setIsLoading(false);
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

  // Don't render if no recent views or still loading
  if (isLoading || recentBooks.length === 0) {
    return null;
  }

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <div className="text-center flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-4">
              <History className="h-4 w-4" />
              Історія перегляду
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          
          {showClearButton && recentBooks.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              className="ml-4"
            >
              <X className="h-4 w-4 mr-2" />
              Очистити
            </Button>
          )}
        </div>

        {/* Books grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
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