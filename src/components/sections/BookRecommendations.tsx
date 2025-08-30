"use client";

import { useState, useMemo, useEffect } from "react";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { fetchBooks } from "@/lib/api/books";
import { Sparkles, TrendingUp, Heart, Award, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/lib/supabase";

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
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load books from API
  useEffect(() => {
    const loadBooks = async () => {
      try {
        console.log('🔄 BookRecommendations: Starting to load books...')
        setLoading(true);
        setError(null);

        

        const response = await fetchBooks({
          available_only: true,
          limit: 20 // Load more books for better recommendations
        });

        console.log('📚 BookRecommendations: Books response:', { 
          success: response.success, 
          count: response.count, 
          hasData: !!response.data,
          error: response.error 
        })

        if (response.success) {
          setBooks(response.data);
          console.log('✅ BookRecommendations: Books loaded successfully:', response.data.length)
        } else {
          throw new Error(response.error || 'Ошибка загрузки рекомендаций');
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
        console.error('❌ BookRecommendations: Error loading books:', err)
        setError(errorMessage);
        
      } finally {
        setLoading(false);
        console.log('🏁 BookRecommendations: Data loading completed')
      }
    };

    loadBooks();
  }, []);

  const recommendations = useMemo(() => {
    const filtered = books.filter(book => 
      book.available && 
      !excludeIds.includes(book.id) &&
      (!category || book.category === category)
    );

    console.log('🔍 BookRecommendations: Filtered books:', { 
      total: books.length, 
      filtered: filtered.length, 
      category, 
      excludeIds: excludeIds.length 
    });

    switch (activeType) {
      case "trending":
        // Recently added books (new in database) or books with high ratings
        return filtered
          .filter(book => 
            (book.rating && book.rating >= 4.5) ||
            (book.badges && book.badges.includes('Нове'))
          )
          .slice(0, maxItems);
      
      case "popular": 
        // Books with high ratings or rating counts
        return filtered
          .filter(book => 
            (book.rating && book.rating >= 4.0) ||
            (book.rating_count && book.rating_count >= 10)
          )
          .slice(0, maxItems);
      
      case "new":
        // Recently added books (sort by created_at)
        return filtered
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
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
  }, [activeType, excludeIds, category, maxItems, books]);

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

  // Don't render if loading or no books
  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-slate-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium">Завантаження рекомендацій...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Quietly fail for recommendations
  }

  console.log('📚 BookRecommendations: Final recommendations:', { 
    total: books.length, 
    recommendations: recommendations.length,
    type: activeType,
    items: recommendations.map(b => ({ id: b.id, title: b.title, author: b.author }))
  });

  // Don't render if no books
  if (!loading && books.length === 0) {
    console.log('📚 BookRecommendations: No books to display')
    // Show a message instead of returning null
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
            <p className="text-lg text-slate-600 mb-8">{subtitle}</p>
            <p className="text-slate-500">Рекомендації завантажуються або каталог порожній</p>
          </div>
        </div>
      </section>
    )
  }

  console.log('📚 BookRecommendations: Rendering with', books.length, 'books, activeType:', activeType)

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-[1000px] mx-auto">
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

        {/* Books grid - исправленная структура 4x4 как на главной странице */}
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {recommendations.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
          </div>
        </div>

        {/* Show more button if there are more books available */}
        {recommendations.length >= maxItems && (
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