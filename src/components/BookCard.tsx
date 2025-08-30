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
          'group relative flex flex-col overflow-hidden rounded-xl bg-white border border-slate-200',
          'transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1',
          'w-full max-w-[200px]' // Уменьшенная ширина для сетки 4x4
        )}
      >
        {/* Обложка */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-xl">
          <Image
            alt={book.title}
            src={imageSrc}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 200px, (min-width: 768px) 25vw, 50vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            onError={handleImageError}
          />
          
          {/* Статус-бейдж - показываем всегда */}
          {book.status && (
            <span className="absolute left-2 top-2 rounded-full border border-slate-200 bg-white/90 px-1.5 py-0.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
              {book.status}
            </span>
          )}

          {/* Overlay при наведении */}
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Кнопка "Переглянути" при наведении */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-medium text-slate-900 shadow-lg backdrop-blur">
              <BookOpen className="h-3 w-3" />
              Переглянути
            </div>
          </div>

          {/* Быстрые действия - показываем при наведении */}
          <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={() => setShowPreview(true)}
              className="rounded-full border border-slate-200 bg-white/90 p-1.5 shadow-sm hover:bg-white"
              aria-label="Швидкий перегляд"
            >
              <BookOpen className="h-3 w-3 text-slate-700" />
            </button>
            <button
              className="rounded-full border border-slate-200 bg-white/90 p-1.5 shadow-sm hover:bg-white"
              aria-label="Додати в обране"
            >
              <Bookmark className="h-3 w-3 text-slate-700" />
            </button>
            <button
              className="rounded-full border border-slate-200 bg-white/90 p-1.5 shadow-sm hover:bg-white"
              aria-label="Поділитися"
            >
              <Share2 className="h-3 w-3 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Контент - название, автор и категория */}
        <div className="flex flex-1 flex-col gap-1.5 px-2 pb-3 pt-2">
          <Link 
            href={`/books/${book.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            <h3 className="line-clamp-2 text-sm font-semibold tracking-tight text-slate-900 leading-tight">
              {book.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 font-medium">{book.author}</p>
          
          {book.category && (
            <p className="text-xs text-slate-500">{book.category}</p>
          )}
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