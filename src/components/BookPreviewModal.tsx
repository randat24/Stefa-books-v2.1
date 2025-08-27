"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { BookOpen, Users, Star, Award, ExternalLink } from "lucide-react";
import type { Book } from "@/lib/types";

interface BookPreviewModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookPreviewModal({ book, isOpen, onClose }: BookPreviewModalProps) {
  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Швидкий перегляд">
      <div className="grid md:grid-cols-[200px_1fr] gap-6">
        {/* Book cover */}
        <div className="mx-auto md:mx-0">
          <div className="relative aspect-[3/4] w-full max-w-[200px] rounded-lg overflow-hidden shadow-lg">
            <Image 
              src={book.cover} 
              alt={book.title} 
              fill 
              className="object-cover"
            />
          </div>
        </div>

        {/* Book info */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[--ink] mb-2">{book.title}</h3>
              <p className="text-lg text-[--muted] mb-1">{book.author}</p>
              <p className="text-sm text-[--muted]">{book.category}{book.age ? ` • ${book.age}` : ""}</p>
            </div>
            <FavoriteButton id={book.id} />
          </div>

          {/* Badges */}
          {book.badges?.length && (
            <div className="flex flex-wrap gap-2">
              {book.badges.map((badge, i) => (
                <Badge key={i} variant="secondary">
                  <Award className="h-3 w-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            {book.price?.old && (
              <div className="text-base text-[--muted] line-through">{book.price.old} ₴</div>
            )}
            <div className="text-xl font-semibold text-[--ink]">
              {book.price?.current ?? "Безкоштовно"} ₴
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              book.available 
                ? "text-green-700 bg-green-100" 
                : "text-red-700 bg-red-100"
            }`}>
              {book.available ? "✓ Доступна для оренди" : "✗ Усі екземпляри видані"}
            </span>
          </div>

          {/* Short description */}
          {book.short && (
            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-yellow-500">
              <p className="text-[--ink] text-sm leading-relaxed">{book.short}</p>
            </div>
          )}

          {/* Quick specs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-[--muted]">Категорія</p>
                <p className="text-sm font-medium text-[--ink]">{book.category}</p>
              </div>
            </div>
            
            {book.age && (
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-[--muted]">Вік</p>
                  <p className="text-sm font-medium text-[--ink]">{book.age}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="dark" asChild disabled={!book.available} className="flex-1">
              <a href={`/books?rent=${book.id}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Орендувати
              </a>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a href={`/books/${book.id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Детальніше
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}