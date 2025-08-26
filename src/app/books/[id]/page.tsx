import { notFound } from "next/navigation";
import Image from "next/image";
import { BOOKS } from "@/lib/mock";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const book = BOOKS.find(b => b.id === params.id);
  if (!book) return { title: "Книга не знайдена" };
  return {
    title: `${book.title} — Stefa.Books`,
    description: `${book.author} • ${book.category}${book.age ? ` • ${book.age}` : ""}`,
    openGraph: { title: book.title, images: [{ url: book.cover }] }
  };
}

export default function BookPage({ params }: { params: Params }) {
  const book = BOOKS.find(b => b.id === params.id);
  if (!book) return notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <div className="card overflow-hidden">
        <div className="relative aspect-[3/4]">
          <Image src={book.cover} alt={book.title} fill className="object-cover" />
        </div>
      </div>
      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[--ink]">{book.title}</h1>
            <p className="text-[--muted]">{book.author}</p>
            <p className="text-sm text-[--muted]">{book.category}{book.age ? ` • ${book.age}` : ""}</p>
          </div>
          <FavoriteButton id={book.id} />
        </div>
        {book.price?.old && <div className="text-sm text-[--muted] line-through">{book.price.old} ₴</div>}
        <div className="text-2xl font-semibold text-[--ink]">{book.price?.current ?? "—"} ₴</div>
        <div className="flex items-center gap-3 text-sm">
          <span className={book.available ? "text-green-600" : "text-red-600"}>
            {book.available ? "Доступна" : "Усі видані"}
          </span>
          {book.badges?.length ? <span className="text-[--muted]">• {book.badges.join(" • ")}</span> : null}
        </div>
        {book.short && <p className="text-[--ink]">{book.short}</p>}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <Button variant="dark" asChild>
            <a href={`/books?rent=${book.id}`}>Орендувати</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/books">Назад до каталогу</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
