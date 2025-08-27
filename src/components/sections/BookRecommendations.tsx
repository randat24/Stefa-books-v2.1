"use client";

import { useState, useMemo } from "react";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { BOOKS } from "@/lib/mock";
import { Sparkles, TrendingUp, Heart, Award } from "lucide-react";
import type { Book } from "@/lib/types";

interface BookRecommendationsProps {
  title?: string;
  subtitle?: string;
  excludeIds?: string[];
  category?: string;
  maxItems?: number;
  showCategories?: boolean;
}

type RecommendationType = "trending" | "popular" | "new" | "category";

export function BookRecommendations({ 
  title = "Рекомендації для вас",
  subtitle = "Книги, які можуть вас зацікавити",
  excludeIds = [],
  category,
  maxItems = 8,
  showCategories = true
}: BookRecommendationsProps) {
  const [activeType, setActiveType] = useState<RecommendationType>("trending");

  const recommendations = useMemo(() => {
    let filtered = BOOKS.filter(book => 
      book.available && 
      !excludeIds.includes(book.id) &&
      (!category || book.category === category)
    );

    switch (activeType) {
      case "trending":
        // Books with "В тренді" status or high ratings
        return filtered
          .filter(book => 
            book.status === "В тренді" || 
            (book.rating && book.rating.value >= 4.5)
          )
          .slice(0, maxItems);
      
      case "popular": 
        // Books with "Бестселер" status or high review counts
        return filtered
          .filter(book => 
            book.status === "Бестселер" || 
            (book.rating && book.rating.count >= 50)
          )
          .slice(0, maxItems);
      
      case "new":
        // Books with "Нове" status or recently added (mock logic)
        return filtered
          .filter(book => book.status === "Нове")
          .slice(0, maxItems);
      
      case "category":
        // Group by categories and take variety
        const categories = [...new Set(filtered.map(book => book.category))];
        const results: Book[] = [];
        const perCategory = Math.ceil(maxItems / categories.length);
        
        categories.forEach(cat => {
          const categoryBooks = filtered
            .filter(book => book.category === cat)
            .slice(0, perCategory);
          results.push(...categoryBooks);
        });
        
        return results.slice(0, maxItems);
      
      default:
        return filtered.slice(0, maxItems);
    }
  }, [activeType, excludeIds, category, maxItems]);

  const types = [
    { 
      key: "trending" as const, 
      label: "В тренді", 
      icon: TrendingUp, 
      description: "Найпопулярніші зараз" 
    },
    { 
      key: "popular" as const, 
      label: "Популярні", 
      icon: Heart, 
      description: "Улюблені читачів" 
    },
    { 
      key: "new" as const, 
      label: "Новинки", 
      icon: Sparkles, 
      description: "Нещодавно додані" 
    },
    ...(showCategories ? [{ 
      key: "category" as const, 
      label: "Різні жанри", 
      icon: Award, 
      description: "З усіх категорій" 
    }] : [])
  ];

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {types.map((type) => {
            const Icon = type.icon;
            const isActive = activeType === type.key;
            
            return (
              <button
                key={type.key}
                onClick={() => setActiveType(type.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-yellow-500 text-slate-900 shadow-lg"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Current type description */}
        <div className="text-center mb-8">
          <p className="text-slate-600">
            {types.find(t => t.key === activeType)?.description}
          </p>
        </div>

        {/* Books grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recommendations.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {/* Show more button if there are more books available */}
        {recommendations.length >= maxItems && (
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