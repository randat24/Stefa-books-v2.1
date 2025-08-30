'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Bookmark, Share2, Heart } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Book } from '@/lib/supabase';
import { convertGoogleDriveUrl, getBookPlaceholder } from '@/lib/utils/imageUtils';
import { BookPreviewModal } from './BookPreviewModal';

export function BookCard({ book }: { book: Book }) {
  const [showPreview, setShowPreview] = useState(false);
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
          'transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border hover:border-slate-200',
          'w-full max-w-[240px]' // Более компактная ширина карточки
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
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-900 shadow-lg backdrop-blur">
              <BookOpen className="h-3 w-3" />
              Переглянути
            </div>
          </div>
        </Link>

        {/* Статус-бейдж - показываем при наведении */}
        {book.status && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-slate-200 bg-white/90 px-2 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {book.status}
          </span>
        )}

        {/* Быстрые действия - показываем при наведении */}
        <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => setShowPreview(true)}
            className="rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm hover:bg-white"
            aria-label="Швидкий перегляд"
          >
            <BookOpen className="h-3 w-3 text-slate-700" />
          </button>
          <button
            className="rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm hover:bg-white"
            aria-label="Додати в обране"
          >
            <Bookmark className="h-3 w-3 text-slate-700" />
          </button>
          <button
            className="rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm hover:bg-white"
            aria-label="Поділитися"
          >
            <Share2 className="h-3 w-3 text-slate-700" />
          </button>
        </div>

        {/* Контент - название и автор с ссылкой */}
        <div className="flex flex-1 flex-col gap-2 px-3 pb-4 pt-3">
          <Link 
            href={`/books/${book.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-slate-900 leading-tight">
              {book.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 font-medium">{book.author}</p>
        </div>
      </article>

      {/* Модальное окно быстрого просмотра */}
      <BookPreviewModal 
        book={book}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
}