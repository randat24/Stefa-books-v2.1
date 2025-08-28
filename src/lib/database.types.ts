export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          category: string
          subcategory: string | null
          description: string | null
          short_description: string | null
          code: string | null
          isbn: string | null
          pages: number | null
          age_range: string | null
          language: string | null
          publisher: string | null
          publication_year: number | null
          cover_url: string | null
          status: string | null
          available: boolean | null
          rating: number | null
          rating_count: number | null
          price_daily: number | null
          price_weekly: number | null
          price_monthly: number | null
          badges: string[] | null
          tags: string[] | null
          search_vector: unknown | null
          search_text: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          author: string
          category: string
          subcategory?: string | null
          description?: string | null
          short_description?: string | null
          code?: string | null
          isbn?: string | null
          pages?: number | null
          age_range?: string | null
          language?: string | null
          publisher?: string | null
          publication_year?: number | null
          cover_url?: string | null
          status?: string | null
          available?: boolean | null
          rating?: number | null
          rating_count?: number | null
          price_daily?: number | null
          price_weekly?: number | null
          price_monthly?: number | null
          badges?: string[] | null
          tags?: string[] | null
          search_vector?: unknown | null
          search_text?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          author?: string
          category?: string
          subcategory?: string | null
          description?: string | null
          short_description?: string | null
          code?: string | null
          isbn?: string | null
          pages?: number | null
          age_range?: string | null
          language?: string | null
          publisher?: string | null
          publication_year?: number | null
          cover_url?: string | null
          status?: string | null
          available?: boolean | null
          rating?: number | null
          rating_count?: number | null
          price_daily?: number | null
          price_weekly?: number | null
          price_monthly?: number | null
          badges?: string[] | null
          tags?: string[] | null
          search_vector?: unknown | null
          search_text?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          id: string
          name: string
          biography: string | null
          birth_year: number | null
          nationality: string | null
          website: string | null
          search_vector: unknown | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          biography?: string | null
          birth_year?: number | null
          nationality?: string | null
          website?: string | null
          search_vector?: unknown | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          biography?: string | null
          birth_year?: number | null
          nationality?: string | null
          website?: string | null
          search_vector?: unknown | null
          created_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          color: string | null
          search_vector: unknown | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          color?: string | null
          search_vector?: unknown | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          color?: string | null
          search_vector?: unknown | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      book_authors: {
        Row: {
          book_id: string
          author_id: string
          role: string | null
        }
        Insert: {
          book_id: string
          author_id: string
          role?: string | null
        }
        Update: {
          book_id?: string
          author_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_authors_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_authors_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          }
        ]
      }
      search_queries: {
        Row: {
          id: string
          query: string
          results_count: number | null
          search_time_ms: number | null
          user_agent: string | null
          ip_address: string | null
          filters: Json | null
          clicked_results: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          query: string
          results_count?: number | null
          search_time_ms?: number | null
          user_agent?: string | null
          ip_address?: string | null
          filters?: Json | null
          clicked_results?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          query?: string
          results_count?: number | null
          search_time_ms?: number | null
          user_agent?: string | null
          ip_address?: string | null
          filters?: Json | null
          clicked_results?: string[] | null
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_books: {
        Args: {
          query_text: string
          category_filter?: string[] | null
          author_filter?: string[] | null
          available_only?: boolean
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          author: string
          category: string
          description: string
          cover_url: string
          available: boolean
          rating: number
          rating_count: number
          relevance_score: number
        }[]
      }
      get_search_suggestions: {
        Args: {
          partial_query: string
          limit_count?: number
        }
        Returns: {
          suggestion: string
          type: string
          count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}