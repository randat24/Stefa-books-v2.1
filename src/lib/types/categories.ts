export interface Category {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  parent_id?: string;
  icon?: string;
  color?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithParent extends Category {
  parent_name?: string;
  parent_slug?: string;
}

export interface CategoryTree extends Category {
  level: number;
  path: string[];
  children?: CategoryTree[];
}

export interface CategoryBreadcrumb {
  id: string;
  name: string;
  slug: string;
  level: number;
}

export interface CategoryStats {
  category_id: string;
  books_count: number;
  available_books_count: number;
}

// Предопределенные категории для типизации
export const CATEGORY_TYPES = {
  AGE: 'age',
  GENRE: 'genre', 
  ADULTS: 'adults'
} as const;

export const AGE_CATEGORIES = {
  TODDLERS: 'toddlers',
  PRESCHOOL: 'preschool', 
  ELEMENTARY: 'elementary',
  MIDDLE: 'middle',
  TEEN: 'teen'
} as const;

export const GENRE_CATEGORIES = {
  FAIRY_TALES: 'fairy-tales',
  EDUCATIONAL: 'educational',
  DETECTIVE: 'detective', 
  ADVENTURE: 'adventure',
  NOVEL: 'novel',
  FANTASY: 'fantasy',
  REALISTIC: 'realistic',
  ROMANCE: 'romance'
} as const;

export const ADULT_CATEGORIES = {
  PSYCHOLOGY: 'psychology',
  MODERN_PROSE: 'modern-prose'
} as const;

// Функция для получения иконки по умолчанию для категории
export function getDefaultCategoryIcon(slug: string): string {
  const iconMap: Record<string, string> = {
    'catalog': '📚',
    'age': '👶',
    'toddlers': '🍼',
    'preschool': '🧸', 
    'elementary': '🎒',
    'middle': '📖',
    'teen': '🎓',
    'genre': '📚',
    'fairy-tales': '🧚',
    'educational': '🔬',
    'detective': '🔍', 
    'adventure': '🗺️',
    'novel': '📝',
    'fantasy': '🐉',
    'realistic': '🌍',
    'romance': '💝',
    'adults': '👥',
    'psychology': '🧠',
    'modern-prose': '✍️'
  };
  
  return iconMap[slug] || '📖';
}

// Функция для получения цвета по умолчанию для категории
export function getDefaultCategoryColor(slug: string): string {
  const colorMap: Record<string, string> = {
    'catalog': '#3B82F6',
    'age': '#F59E0B', 
    'toddlers': '#FEF3C7',
    'preschool': '#FDE68A',
    'elementary': '#FBBF24', 
    'middle': '#F59E0B',
    'teen': '#D97706',
    'genre': '#10B981',
    'fairy-tales': '#D1FAE5',
    'educational': '#A7F3D0',
    'detective': '#6EE7B7',
    'adventure': '#34D399',
    'novel': '#10B981', 
    'fantasy': '#059669',
    'realistic': '#047857',
    'romance': '#065F46',
    'adults': '#8B5CF6',
    'psychology': '#DDD6FE',
    'modern-prose': '#C4B5FD'
  };
  
  return colorMap[slug] || '#6B7280';
}