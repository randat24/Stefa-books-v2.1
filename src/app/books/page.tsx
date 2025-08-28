"use client";
import React, { Suspense } from "react";
import { SimpleSearch } from "@/components/search/SimpleSearch";

function BooksPageContent() {
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

        <SimpleSearch />
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
