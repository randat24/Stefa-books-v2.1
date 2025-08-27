import { notFound } from "next/navigation";
import Image from "next/image";
import { BOOKS } from "@/lib/mock";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { BookCard } from "@/components/BookCard";
import { BookViewTracker } from "@/components/BookViewTracker";
import { Star, BookOpen, Calendar, Users, Award } from "lucide-react";
import type { Metadata } from "next";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const book = BOOKS.find(b => b.id === params.id);
  if (!book) return { title: "Книга не знайдена" };
  return {
    title: `${book.title} — Stefa.books`,
    description: `${book.author} • ${book.category}${book.age ? ` • ${book.age}` : ""}`,
    openGraph: { title: book.title, images: [{ url: book.cover }] }
  };
}

export default function BookPage({ params }: { params: Params }) {
  const book = BOOKS.find(b => b.id === params.id);
  if (!book) return notFound();

  // Get related books (same category, excluding current book)
  const relatedBooks = BOOKS
    .filter(b => b.id !== book.id && b.category === book.category && b.available)
    .slice(0, 4);

  // Mock detailed description (in real app, this would come from database)
  const fullDescription = book.short ? 
    `${book.short}\n\nЦя захоплююча книга розкриває перед читачами цілий світ пригод та відкриттів. Написана доступною мовою, вона ідеально підходить для дитячого читання і допоможе розвинути любов до літератури. Автор майстерно поєднує розважальний сюжет з навчальними елементами, що робить читання не тільки цікавим, але й корисним.` :
    "Захоплююча дитяча книга, що поєднує в собі пригоди, навчання та розваги. Ідеально підходить для читання разом з батьками або самостійного вивчення. Допоможе розвинути фантазію та мовні навички.";

  return (
    <>
      <BookViewTracker bookId={book.id} />
      <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Main book info section */}
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <div className="card overflow-hidden">
          <div className="relative aspect-[3/4]">
            <Image src={book.cover} alt={book.title} fill className="object-cover" />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-[--ink] mb-2">{book.title}</h1>
              <p className="text-xl text-[--muted] mb-1">{book.author}</p>
              <p className="text-sm text-[--muted] mb-3">{book.category}{book.age ? ` • ${book.age}` : ""}</p>
              
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
          <div className="flex items-center gap-3">
            {book.price?.old && (
              <div className="text-lg text-[--muted] line-through">{book.price.old} ₴</div>
            )}
            <div className="text-2xl font-semibold text-[--ink]">{book.price?.current ?? "Безкоштовно"} ₴</div>
          </div>
          
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
          
          {/* Short description */}
          {book.short && (
            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-yellow-500">
              <p className="text-[--ink] font-medium">{book.short}</p>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="grid sm:grid-cols-2 gap-3 pt-4">
            <Button variant="dark" asChild disabled={!book.available}>
              <a href={`/books?rent=${book.id}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Орендувати книгу
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/books">Назад до каталогу</a>
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

      {/* Book specifications */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-[--ink] mb-6 flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Характеристики
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-[--muted]">Категорія</p>
              <p className="font-semibold text-[--ink]">{book.category}</p>
            </div>
          </div>
          
          {book.age && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-[--muted]">Вікова група</p>
                <p className="font-semibold text-[--ink]">{book.age}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-[--muted]">Статус</p>
              <p className="font-semibold text-[--ink]">
                {book.available ? "Доступна" : "Видана"}
              </p>
            </div>
          </div>
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
