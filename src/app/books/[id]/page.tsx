import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchBook, fetchBooksByCategory } from "@/lib/api/books";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { BookCard } from "@/components/BookCard";
import { BookViewTracker } from "@/components/BookViewTracker";
import { BookOpen, Award } from "lucide-react";
import type { Metadata } from "next";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const response = await fetchBook(id);
  if (!response.success || !response.data) return { title: "Книга не знайдена" };
  
  const book = response.data;
  return {
    title: `${book.title} — Stefa.books`,
    description: `${book.author} • ${book.category}${book.age_range ? ` • ${book.age_range}` : ""}`,
    openGraph: { 
      title: book.title, 
      images: book.cover_url ? [{ url: book.cover_url }] : []
    }
  };
}

export default async function BookPage({ params }: { params: Params }) {
  const { id } = await params;
  const bookResponse = await fetchBook(id);
  if (!bookResponse.success || !bookResponse.data) return notFound();

  const book = bookResponse.data;

  // Get related books (same category, excluding current book)
  const relatedBooksResponse = await fetchBooksByCategory(book.category, 8);
  const relatedBooks = relatedBooksResponse.success
    ? relatedBooksResponse.data
        .filter(b => b.id !== book.id && b.available)
        .slice(0, 4)
    : [];

  // Use description from database, with fallback
  const fullDescription = book.description || 
    book.short_description || 
    "Захоплююча дитяча книга, що поєднує в собі пригоди, навчання та розваги. Ідеально підходить для читання разом з батьками або самостійного вивчення. Допоможе розвинути фантазію та мовні навички.";

  return (
    <>
      <BookViewTracker bookId={book.id} book={book} />
      <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Main book info section */}
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <div className="card overflow-hidden">
          <div className="relative aspect-[3/4]">
            {book.cover_url ? (
              <Image src={book.cover_url} alt={book.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-slate-400" />
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-[--ink] mb-2">{book.title}</h1>
              <p className="text-xl text-[--muted] mb-1">{book.author}</p>
              <p className="text-sm text-[--muted] mb-3">{book.category}{book.age_range ? ` • ${book.age_range}` : ""}</p>
              
              {/* Badges */}
              {book.badges?.length && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.badges.map((badge, i) => (
                    <Badge key={i} variant="secondary">
                      <Award className="h-3 w-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <FavoriteButton id={book.id} />
          </div>
          
          {/* Price section */}
          {book.price_uah && (
            <div className="flex items-center gap-3">
              <div className="text-lg text-[--muted]">Вартість книги:</div>
              <div className="text-2xl font-semibold text-[--ink]">{book.price_uah} ₴</div>
            </div>
          )}
          
          {/* Availability */}
          <div className="flex items-center gap-3 text-sm">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              book.available 
                ? "text-green-700 bg-green-100" 
                : "text-red-700 bg-red-100"
            }`}>
              {book.available ? "✓ Доступна для оренди" : "✗ Усі екземпляри видані"}
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="grid sm:grid-cols-2 gap-3 pt-4">
            <Button variant="dark" asChild disabled={!book.available}>
              <a href={`/books?rent=${book.id}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Орендувати книгу
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/books">Назад до каталогу</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed description section */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-[--ink] mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Про книгу
        </h2>
        <div className="prose prose-slate max-w-none">
          {fullDescription.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-[--ink] mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Related books */}
      {relatedBooks.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-[--ink] mb-6">Схожі книги</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relatedBook) => (
              <BookCard key={relatedBook.id} book={relatedBook} />
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
}