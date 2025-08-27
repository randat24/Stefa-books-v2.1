"use client";
import { useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BOOKS } from "@/lib/mock";
import { BookCard } from "@/components/BookCard";
import { useStore } from "@/lib/store";
import type { Filters } from "@/lib/store";

function BooksPageContent() {
  const params = useSearchParams();
  const urlCat = params.get("category") as string | null;
  const { filters, setQ, setCategory, toggleAvailable } = useStore();

  useEffect(() => {
    if (urlCat) setCategory(urlCat as Filters["category"]);
  }, [urlCat, setCategory]);

  const categories = useMemo(()=> ["Усі", ...Array.from(new Set(BOOKS.map(b=> b.category)))], []);
  const list = useMemo(()=> {
    const q = filters.q.toLowerCase();
    return BOOKS.filter(b => {
      const byQ = [b.title, b.author, b.category].some(v => v.toLowerCase().includes(q));
      const byCat = filters.category === "Усі" ? true : b.category === filters.category;
      const byAvail = filters.onlyAvailable ? b.available : true;
      return byQ && byCat && byAvail;
    });
  }, [filters]);

  return (
    <>
      {/* Якорь для навігації */}
      <section id="catalog-top" />
      
      <div className="grid gap-8" id="top">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] items-center">
          <input
            className="input min-w-[260px]" placeholder="Пошук: назва, автор або категорія"
            defaultValue={filters.q} onChange={(e)=> setQ(e.currentTarget.value)}
          />
          <select className="input" value={filters.category} onChange={(e)=> setCategory(e.target.value as Filters["category"])}>
            {categories.map(c=> <option key={c}>{c}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-[--ink]">
            <input type="checkbox" checked={filters.onlyAvailable} onChange={toggleAvailable}/>
            Показувати лише доступні
          </label>
        </div>

        <div className="text-sm text-[--muted]">Знайдено: <b>{list.length}</b></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {list.map(b => <BookCard key={b.id} book={b} />)}
        </div>
      </div>
    </>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Завантаження...</div>}>
      <BooksPageContent />
    </Suspense>
  );
}
