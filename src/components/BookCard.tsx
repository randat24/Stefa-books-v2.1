'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BookOpen, Bookmark, Share2, X } from 'lucide-react';
import { cn } from '@/lib/cn';

type Book = {
  id: string;
  title: string;
  author: string;
  code: string;        // напр. "NF-002"
  category: string;    // напр. "Нон-фікшн"
  pages: number;       // 280
  cover: string;       // url
  status?: 'В тренді' | 'Бестселер' | 'Нове' | string;
  short?: string;      // описание книги
  rating?: { value: number; count: number };
  available?: boolean;
};

export function BookCard({ book }: { book: Book }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-3xl bg-white',
          'transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border hover:border-slate-200'
        )}
      >
        {/* Обложка */}
        <button
          onClick={() => setOpen(true)}
          className="relative aspect-[3/4] w-full overflow-hidden rounded-t-3xl"
          aria-label={`Переглянути ${book.title}`}
        >
          <Image
            alt={book.title}
            src={book.cover}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 100vw"
          />
          
          {/* Overlay при наведении */}
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Кнопка "Переглянути" при наведении */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2 text-sm font-medium text-slate-900 shadow-lg backdrop-blur">
              <BookOpen className="h-4 w-4" />
              Переглянути
            </div>
          </div>
        </button>

        {/* Статус-бейдж - показываем при наведении */}
        {book.status && (
          <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {book.status}
          </span>
        )}

        {/* Быстрые действия - показываем при наведении */}
        <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            className="rounded-full border border-slate-200 bg-white/90 p-2.5 shadow-sm hover:bg-white"
            aria-label="Додати в обране"
          >
            <Bookmark className="h-4 w-4 text-slate-700" />
          </button>
          <button
            className="rounded-full border border-slate-200 bg-white/90 p-2.5 shadow-sm hover:bg-white"
            aria-label="Поділитися"
          >
            <Share2 className="h-4 w-4 text-slate-700" />
          </button>
        </div>

        {/* Контент - только название и автор */}
        <div className="flex flex-1 flex-col gap-3 px-4 pb-5 pt-4">
          <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-slate-900 leading-tight">
            {book.title}
          </h3>

          <p className="text-base text-slate-600 font-medium">{book.author}</p>
        </div>
      </article>

      {/* Поп-ап с полным описом */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 p-0 md:p-4"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 md:relative md:right-auto md:top-auto rounded-full border border-white/20 bg-white/10 backdrop-blur-sm md:border-slate-200 md:bg-white p-2 md:p-2 shadow-sm z-10 text-white md:text-slate-700 mb-2 md:mb-0"
            aria-label="Закрити"
          >
            <X className="h-4 w-4" />
          </button>
          <div
            className="relative w-full max-w-full md:max-w-2xl lg:max-w-4xl max-h-[100vh] md:max-h-[95vh] overflow-y-auto rounded-none md:rounded-3xl bg-white shadow-xl mx-0 md:mx-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Мобильный и планшетный вид - вертикальная раскладка */}
            <div className="flex flex-col md:hidden">
              {/* Заголовок */}
              <div className="p-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-1">{book.title}</h3>
                <p className="text-sm text-slate-600">{book.author}</p>
              </div>

              {/* Основной контент */}
              <div className="flex-1 p-4 space-y-4">
                {/* Обложка и рейтинг в одной строке */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-28 overflow-hidden rounded-lg">
                      <Image alt={book.title} src={book.cover} fill className="object-cover" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* Рейтинг */}
                    {book.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 text-base">★</span>
                          <span className="font-medium text-base">{book.rating.value}</span>
                        </div>
                        <span className="text-xs text-slate-500">({book.rating.count} відгуків)</span>
                      </div>
                    )}
                    
                    {/* Метаданные */}
                    <div className="space-y-1 text-xs text-slate-500">
                      <div>Код: {book.code}</div>
                      <div>{book.pages} сторінок • {book.category}</div>
                      {book.status && <div className="font-medium">{book.status}</div>}
                      <div className={cn(
                        "font-medium",
                        book.available ? "text-green-600" : "text-red-600"
                      )}>
                        {book.available ? "В наявності" : "Зарезервовано"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Описание */}
                {book.short && (
                  <div>
                    <p className="text-sm text-slate-600 leading-relaxed">{book.short}</p>
                  </div>
                )}

                {/* Кнопки */}
                <div className="space-y-2 pt-2">
                  <a
                    href="#subscribe"
                    className="w-full inline-flex items-center justify-center rounded-xl bg-yellow-500 px-4 py-3 text-sm font-medium text-slate-900 hover:bg-yellow-400 transition-colors"
                  >
                    Оформити підписку
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                      aria-label="Додати в обране"
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      <span className="text-xs">Обране</span>
                    </button>
                    <button
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                      aria-label="Поділитися"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      <span className="text-xs">Поділитись</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Десктопный вид - горизонтальная раскладка */}
            <div className="hidden md:grid md:grid-cols-[180px,1fr] lg:grid-cols-[220px,1fr] gap-6 lg:gap-8 p-6 lg:p-8">
              <div className="flex flex-col gap-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
                  <Image alt={book.title} src={book.cover} fill className="object-cover" />
                </div>
                
                {/* Рейтинг под обложкой */}
                {book.rating && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="font-medium text-lg">{book.rating.value}</span>
                      </div>
                      <span className="text-sm text-slate-500">({book.rating.count} відгуків)</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-2 leading-tight">{book.title}</h3>
                  <p className="text-lg lg:text-xl text-slate-700 mb-4">{book.author}</p>
                </div>

                {/* Описание книги */}
                {book.short && (
                  <div>
                    <p className="text-slate-600 leading-relaxed text-base lg:text-lg">{book.short}</p>
                  </div>
                )}

                {/* Метки */}
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span>Код: {book.code}</span>
                  <span>•</span>
                  <span>{book.pages} сторінок</span>
                  <span>•</span>
                  <span>{book.category}</span>
                  {book.status && (
                    <>
                      <span>•</span>
                      <span>{book.status}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className={cn(
                    book.available ? "text-green-600" : "text-red-600"
                  )}>
                    {book.available ? "В наявності" : "Зарезервовано"}
                  </span>
                </div>

                {/* Действия */}
                <div className="mt-6 flex gap-3">
                  <a
                    href="#subscribe"
                    className="flex-1 inline-flex items-center justify-center rounded-2xl bg-yellow-500 px-6 py-3 text-sm font-medium text-slate-900 hover:bg-yellow-400 transition-colors"
                  >
                    Оформити підписку
                  </a>
                  <button
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                    aria-label="Додати в обране"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                    aria-label="Поділитися"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}