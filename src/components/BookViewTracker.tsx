"use client";

import { useEffect } from "react";
import { addToRecentViews } from "@/lib/recentViews";
import type { Book } from "@/lib/types";

interface BookViewTrackerProps {
  book: Book;
}

export function BookViewTracker({ book }: BookViewTrackerProps) {
  useEffect(() => {
    if (!book) return;
    
    // Track the book view when component mounts
    addToRecentViews(book);
  }, [book]);

  // This component doesn't render anything - it's a tracking utility
  return null;
}