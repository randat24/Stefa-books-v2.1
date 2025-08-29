'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { BookOpen, Bookmark, Share2, X, Star, Heart } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Book } from '@/lib/supabase';
import { convertGoogleDriveUrl, getBookPlaceholder } from '@/lib/utils/imageUtils';

/** Рейтинг с одной звездочкой */
function Rating({ value = 0, count = 0 }: { value: number; count?: number }) {
  return (
    <div className="inline-flex items-center gap-1" aria-label={`Рейтинг ${value} из 5`}>
      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" aria-hidden="true" />
      <span className="font-medium text-base">{value.toFixed(1)}</span>
      {count > 0 && (
        <span className="text-xs text-slate-500">({count} відгуків)</span>
      )}
    </div>
  );
}

function BookDialog({
  open,
  onClose,
  book
}: {
  open: boolean;
  onClose: () => void;
  book: Book;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const handleImageError = () => {
    console.log('🖼️ Dialog image failed to load for book:', book.title, 'URL:', book.cover_url);
    setImageError(true);
  };

  const imageSrc = imageError || !book.cover_url ? getBookPlaceholder() : convertGoogleDriveUrl(book.cover_url);

  if (!open) return null;

  // Validate book data
  if (!book || !book.id || !book.title || !book.author) {
    console.error('❌ BookDialog: Invalid book data:', book);
    return null;
  }

  console.log('📖 BookDialog: Rendering dialog for book:', { id: book.id, title: book.title, author: book.author });

  const statusMap = {
    'В наявності': { label: 'В наявності', className: 'bg-green-100 text-green-700 ring-green-200' },
    'Зарезервовано': { label: 'Зарезервовано', className: 'bg-amber-100 text-amber-700 ring-amber-200' },
  };
  
  const statusInfo = book.available 
    ? statusMap['В наявності'] 
    : statusMap['Зарезервовано'];

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `${book.title} — ${book.author}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: book.title, text, url });
      } else {
        const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(tg, '_blank');
      }
    } catch {/* noop */}
  };

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-dialog-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        ref={dialogRef}
        className="relative z-10 mx-auto my-6 w-[min(95vw,900px)] rounded-2xl bg-white shadow-xl outline-none"
        style={{ marginTop: 'max(1.5rem, calc(50vh - 300px))' }}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black z-10"
          aria-label="Закрити діалог"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid gap-4 p-4 sm:p-6">
          {/* Мобильная версия с обложкой сверху */}
          <div className="flex flex-col gap-4 sm:hidden">
            {/* Обложка для мобильных */}
            <div className="relative mx-auto">
              <div className="aspect-[3/4] w-48 overflow-hidden rounded-xl">
                <Image
                  src={imageSrc}
                  alt={`Обкладинка: ${book.title}`}
                  fill
                  className="object-cover"
                  sizes="192px"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  onError={handleImageError}
                />
              </div>
              <span
                className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusInfo.className}`}
                aria-live="polite"
              >
                <span className="inline-block size-1.5 rounded-full bg-current/70" />
                {statusInfo.label}
              </span>
            </div>

            {/* Рейтинг под обложкой для мобильных */}
            {book.rating && (
              <div className="flex justify-center">
                <Rating value={book.rating || 0} count={book.rating_count || 0} />
              </div>
            )}

            {/* Контент для мобильных */}
            <div className="flex min-w-0 flex-col gap-4 text-center">
              <header className="space-y-2">
                <h2
                  id="book-dialog-title"
                  className="text-balance font-semibold tracking-tight text-xl"
                >
                  {book.title}
                </h2>
                <p className="text-base text-slate-600">{book.author}</p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
                    {book.category}
                  </span>
                  {book.status && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700 ring-1 ring-blue-200">
                      {book.status}
                    </span>
                  )}
                </div>
              </header>

              {book.short_description && (
                <p className="text-pretty text-sm leading-relaxed text-slate-700 text-left">
                  {book.short_description}
                </p>
              )}

              {/* Метаданные */}
              <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                <span>Код: {book.code}</span>
                <span>•</span>
                <span>{book.pages} сторінок</span>
              </div>

              {/* Действия для мобильных */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-slate-900 bg-yellow-500 hover:bg-yellow-400 transition-colors"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Взяти в аренду
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 ring-1 ring-slate-200 transition-colors"
                  >
                    <Heart className="h-4 w-4" aria-hidden="true" />
                    В обране
                  </button>
                  <button
                    onClick={share}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 ring-1 ring-slate-200 transition-colors"
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                    Поділитися
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Планшетная и десктопная версия */}
          <div className="hidden sm:grid sm:grid-cols-[280px_1fr] md:grid-cols-[320px_1fr] sm:gap-6">
            {/* Обложка и рейтинг */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-xl">
                  <Image
                    src={imageSrc}
                    alt={`Обкладинка: ${book.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 280px, 320px"
                    onError={handleImageError}
                  />
                </div>
                <span
                  className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusInfo.className}`}
                  aria-live="polite"
                >
                  <span className="inline-block size-1.5 rounded-full bg-current/70" />
                  {statusInfo.label}
                </span>
              </div>
              
              {/* Рейтинг под обложкой */}
              {book.rating && (
                <div className="flex justify-center">
                  <Rating value={book.rating || 0} count={book.rating_count || 0} />
                </div>
              )}
            </div>

            {/* Контент */}
            <div className="flex min-w-0 flex-col gap-4">
              <header className="space-y-2">
                <h2
                  id="book-dialog-title"
                  className="text-balance font-semibold tracking-tight text-xl sm:text-2xl lg:text-3xl"
                >
                  {book.title}
                </h2>
                <p className="text-base sm:text-lg text-slate-600">{book.author}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
                    {book.category}
                  </span>
                  {book.status && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700 ring-1 ring-blue-200">
                      {book.status}
                    </span>
                  )}
                </div>
              </header>

              {book.short_description && (
                <p className="max-w-lg text-pretty text-sm sm:text-base leading-relaxed text-slate-700 mr-8">
                  {book.short_description}
                </p>
              )}

              {/* Метаданные */}
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Код: {book.code}</span>
                <span>•</span>
                <span>{book.pages} сторінок</span>
              </div>

              {/* Действия */}
              <div className="mt-auto flex flex-wrap gap-3 pt-4">
                <Link
                  href={`/books/${book.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Переглянути детально
                </Link>

                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-slate-900 bg-yellow-500 hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 transition-colors"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Взяти в аренду
                </button>

                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 ring-1 ring-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 transition-colors"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  В обране
                </button>

                <button
                  onClick={share}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 ring-1 ring-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 transition-colors"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  Поділитися
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookCard({ book }: { book: Book }) {
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Validate book data
  if (!book || !book.id || !book.title || !book.author) {
    console.error('❌ BookCard: Invalid book data:', book);
    return null;
  }

  const handleImageError = () => {
    console.log('🖼️ Image failed to load for book:', book.title, 'URL:', book.cover_url);
    setImageError(true);
  };

  const imageSrc = imageError || !book.cover_url ? getBookPlaceholder() : convertGoogleDriveUrl(book.cover_url);

  console.log('📖 BookCard: Rendering book:', { id: book.id, title: book.title, author: book.author });

  return (
    <>
      <article
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-xl bg-white',
          'transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border hover:border-slate-200'
        )}
      >
        {/* Обложка - теперь с ссылкой на страницу книги */}
        <Link
          href={`/books/${book.id}`}
          className="relative aspect-[3/4] w-full overflow-hidden rounded-t-xl block"
          aria-label={`Перейти на сторінку книги ${book.title}`}
        >
          <Image
            alt={book.title}
            src={imageSrc}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 100vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            onError={handleImageError}
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
        </Link>

        {/* Статус-бейдж - показываем при наведении */}
        {book.status && (
          <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {book.status}
          </span>
        )}

        {/* Быстрые действия - показываем при наведении */}
        <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => setOpen(true)}
            className="rounded-full border border-slate-200 bg-white/90 p-2.5 shadow-sm hover:bg-white"
            aria-label="Швидкий перегляд"
          >
            <BookOpen className="h-4 w-4 text-slate-700" />
          </button>
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

        {/* Контент - название и автор с ссылкой */}
        <div className="flex flex-1 flex-col gap-3 px-4 pb-5 pt-4">
          <Link 
            href={`/books/${book.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-900 leading-tight">
              {book.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 font-medium">{book.author}</p>
        </div>
      </article>

      <BookDialog open={open} onClose={() => setOpen(false)} book={book} />
    </>
  );
}