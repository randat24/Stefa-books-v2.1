"use client";
import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BOOKS } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { SimpleSearch } from "@/components/search/SimpleSearch";
import type { Filters } from "@/lib/store";

function BooksPageContent() {
  const params = useSearchParams();
  const urlCat = params.get("category") as string | null;
  const { setCategory } = useStore();

  useEffect(() => {
    if (urlCat) setCategory(urlCat as Filters["category"]);
  }, [urlCat, setCategory]);

  return (
    <>
      {/* Якорь для навігації */}
      <section id="catalog-top" />
      
      <div className="grid gap-8" id="top">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Каталог книг</h1>
          <p className="text-muted-foreground">
            Знайдіть ідеальну книгу за допомогою пошуку та фільтрів
          </p>
        </div>

        <SimpleSearch books={BOOKS} />
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
