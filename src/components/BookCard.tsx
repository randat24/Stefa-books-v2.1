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
};

export function BookCard({ book }: { book: Book }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm',
          'transition hover:shadow-lg'
        )}
      >
        {/* Обложка */}
        <button
          onClick={() => setOpen(true)}
          className="relative aspect-[3/4] w-full overflow-hidden"
          aria-label={`Переглянути ${book.title}`}
        >
          <Image
            alt={book.title}
            src={book.cover}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 100vw"
          />
        </button>

        {/* Статус-бейдж */}
        {book.status && (
          <span
            className="pointer-events-none absolute left-4 top-4 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur"
          >
            {book.status}
          </span>
        )}

        {/* Быстрые действия */}
        <div className="absolute right-4 top-4 flex gap-2">
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

        {/* Контент */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-[13px] font-medium text-slate-500">{book.category}</p>

          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-900">
            {book.title}
          </h3>

          <p className="text-sm text-slate-600">{book.author}</p>

          {/* Метки */}
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
              Код: {book.code}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
              Сторінок: {book.pages}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              <BookOpen className="h-4 w-4" />
              Переглянути
            </button>
          </div>
        </div>
      </article>

      {/* Поп-ап з повним описом (легкий, без порталу) */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 shadow-sm"
              aria-label="Закрити"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-6 p-6 md:grid-cols-[180px,1fr] md:gap-8 md:p-8">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
                <Image alt={book.title} src={book.cover} fill className="object-cover" />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm text-slate-500">{book.category}</p>
                <h3 className="text-2xl font-semibold text-slate-900">{book.title}</h3>
                <p className="text-slate-700">{book.author}</p>

                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                    Код: {book.code}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                    Сторінок: {book.pages}
                  </span>
                  {book.status && (
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-700">
                      {book.status}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href="/books"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Перейти до каталогу
                  </a>
                  <a
                    href="#subscribe-form"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  >
                    Оформити підписку
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
