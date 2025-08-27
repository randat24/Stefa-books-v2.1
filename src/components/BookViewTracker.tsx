"use client";

import { useEffect } from "react";
import { addToRecentViews } from "@/lib/recentViews";

interface BookViewTrackerProps {
  bookId: string;
}

export function BookViewTracker({ bookId }: BookViewTrackerProps) {
  useEffect(() => {
    // Track the book view when component mounts
    addToRecentViews(bookId);
  }, [bookId]);

  // This component doesn't render anything
  return null;
}