"use client";

import type { Book } from "@/lib/types";

const STORAGE_KEY = "stefa_recent_views";
const MAX_RECENT_VIEWS = 10;

// Get recent views from localStorage
export function getRecentViews(): Book["id"][] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Add a book to recent views
export function addToRecentViews(bookId: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const current = getRecentViews();
    
    // Remove if already exists to avoid duplicates
    const filtered = current.filter(id => id !== bookId);
    
    // Add to front of array
    const updated = [bookId, ...filtered];
    
    // Limit to max items
    const limited = updated.slice(0, MAX_RECENT_VIEWS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent("recentViewsUpdated", { 
      detail: { bookId, recentViews: limited }
    }));
  } catch (error) {
    console.error("Failed to update recent views:", error);
  }
}

// Clear all recent views
export function clearRecentViews(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("recentViewsUpdated", { 
      detail: { recentViews: [] }
    }));
  } catch (error) {
    console.error("Failed to clear recent views:", error);
  }
}

// Remove specific book from recent views
export function removeFromRecentViews(bookId: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const current = getRecentViews();
    const updated = current.filter(id => id !== bookId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("recentViewsUpdated", { 
      detail: { bookId, recentViews: updated }
    }));
  } catch (error) {
    console.error("Failed to remove from recent views:", error);
  }
}