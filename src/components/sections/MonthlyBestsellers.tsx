"use client";

import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { BOOKS } from "@/lib/mock";
import { TrendingUp, Calendar, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const months = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

export function MonthlyBestsellers() {
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  
  // Get bestsellers for the selected month (mock data - in real app would come from API)
  const getBestsellersForMonth = (monthIndex: number) => {
    // Simulate different bestsellers for different months by using different filters
    const offset = monthIndex * 2;
    return BOOKS
      .filter(book => 
        book.available && 
        (book.status === "Бестселер" || 
         book.rating?.value >= 4.3 ||
         book.status === "В тренді")
      )
      .slice(offset, offset + 6)
      .map((book, index) => ({
        ...book,
        monthlyRank: index + 1,
        monthlyReads: Math.floor(Math.random() * 100) + 50 // Mock reading count
      }));
  };

  const bestsellers = getBestsellersForMonth(selectedMonth);
  
  const nextMonth = () => {
    setSelectedMonth(prev => (prev + 1) % 12);
  };
  
  const prevMonth = () => {
    setSelectedMonth(prev => (prev - 1 + 12) % 12);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium mb-4">
            <Award className="h-4 w-4" />
            Бестселери місяця
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Найпопулярніші книги
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Книги, які читачі обирають найчастіше цього місяця
          </p>
        </div>

        {/* Month selector */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 transition-all"
            aria-label="Попередній місяць"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-200">
            <Calendar className="h-5 w-5 text-slate-600" />
            <span className="text-lg font-semibold text-slate-900">
              {months[selectedMonth]} {new Date().getFullYear()}
            </span>
          </div>
          
          <button
            onClick={nextMonth}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 transition-all"
            aria-label="Наступний місяць"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {bestsellers.length > 0 ? (
          <>
            {/* All bestsellers in one row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
              {bestsellers.map((book, index) => (
                <div key={book.id} className="relative">
                  {/* Rank badge */}
                  <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-slate-400' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-slate-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* Enhanced book card */}
                  <div className="relative">
                    <BookCard book={book} />
                    
                    {/* Reading stats overlay - only for top 3 */}
                    {index < 3 && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-white/50 shadow-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-medium text-slate-700">
                                {book.monthlyReads} читачів
                              </span>
                            </div>
                            <div className={`text-xs font-bold ${
                              index === 0 ? 'text-yellow-600' :
                              index === 1 ? 'text-slate-600' :
                              'text-orange-600'
                            }`}>
                              #{index + 1}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button variant="outline" asChild className="bg-white hover:bg-slate-50">
                <a href="/books">
                  Переглянути всі книги
                </a>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <Award className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Бестселери ще формуються
            </h3>
            <p className="text-slate-500">
              Статистика за {months[selectedMonth].toLowerCase()} ще збирається
            </p>
          </div>
        )}
      </div>
    </section>
  );
}