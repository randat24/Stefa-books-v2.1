/**
 * Скрипт для миграции категорий из старой структуры в новую иерархическую
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Маппинг старых категорий в новые
const CATEGORY_MAPPING = {
  // Возрастные категории
  'toddlers': { parent: 'age', age_range: 'Найменші' },
  'preschool': { parent: 'age', age_range: 'Дошкільний вік' },
  'elementary': { parent: 'age', age_range: 'Молодший вік' },
  'middle': { parent: 'age', age_range: 'Середній вік' },
  'teen': { parent: 'age', age_range: 'Підлітковий вік' },

  // Жанровые категории
  'fairy-tales': { parent: 'genre', category: 'Казки' },
  'educational': { parent: 'genre', category: 'Пізнавальні' },
  'detective': { parent: 'genre', category: 'Детектив' },
  'adventure': { parent: 'genre', category: 'Пригоди' },
  'novel': { parent: 'genre', category: 'Повість' },
  'fantasy': { parent: 'genre', category: 'Фентезі' },
  'realistic': { parent: 'genre', category: 'Реалістична проза' },
  'romance': { parent: 'genre', category: 'Романтика' },

  // Взрослые категории
  'psychology': { parent: 'adults', category: 'Психологія і саморозвиток' },
  'modern-prose': { parent: 'adults', category: 'Сучасна проза' }
};

async function migrateCategories() {
  console.log('🔄 Starting category migration...');

  try {
    // 1. Сначала запускаем миграцию для создания структуры категорий
    console.log('📁 Creating category structure...');
    
    // Проверяем, что миграция была выполнена
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, slug')
      .limit(5);

    if (categoriesError && categoriesError.code === '42P01') {
      console.log('⚠️ Categories table not found. Please run the migration first:');
      console.log('   Run: 001_create_categories.sql in your Supabase dashboard');
      return;
    }

    if (!categories || categories.length === 0) {
      console.log('⚠️ No categories found. The migration may not have been run yet.');
      return;
    }

    // 2. Получаем все существующие книги
    console.log('📚 Fetching existing books...');
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, category, age_range');

    if (booksError) {
      throw new Error(`Error fetching books: ${booksError.message}`);
    }

    console.log(`Found ${books?.length || 0} books to migrate`);

    // 3. Получаем категории для маппинга
    const { data: allCategories } = await supabase
      .from('categories')
      .select('id, slug, name');

    const categoryMap = allCategories?.reduce((acc, cat) => {
      acc[cat.slug] = cat;
      return acc;
    }, {} as Record<string, any>) || {};

    // 4. Мигрируем каждую книгу
    let migratedCount = 0;
    let errorCount = 0;

    for (const book of books || []) {
      try {
        const updates: any = {};

        // Определяем категорию по жанру
        if (book.category) {
          // Ищем соответствующую категорию по названию
          const genreCategory = findCategoryByName(allCategories || [], book.category);
          if (genreCategory) {
            updates.category_id = genreCategory.id;
          }
        }

        // Определяем возрастную категорию
        if (book.age_range) {
          const ageCategory = findCategoryByName(allCategories || [], book.age_range);
          if (ageCategory) {
            updates.age_category_id = ageCategory.id;
          }
        }

        // Обновляем книгу, если есть изменения
        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from('books')
            .update(updates)
            .eq('id', book.id);

          if (updateError) {
            console.error(`❌ Error updating book ${book.id}:`, updateError.message);
            errorCount++;
          } else {
            migratedCount++;
          }
        }
      } catch (error) {
        console.error(`❌ Error processing book ${book.id}:`, error);
        errorCount++;
      }
    }

    console.log(`✅ Migration completed!`);
    console.log(`   📈 Migrated: ${migratedCount} books`);
    console.log(`   ❌ Errors: ${errorCount} books`);

    // 5. Показываем статистику по категориям
    console.log('\n📊 Category Statistics:');
    await showCategoryStats();

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Функция для поиска категории по названию
function findCategoryByName(categories, name) {
  return categories.find(cat => 
    cat.name.toLowerCase() === name.toLowerCase() ||
    cat.name === name
  );
}

// Показать статистику по категориям
async function showCategoryStats() {
  const { data: stats } = await supabase
    .from('books')
    .select(`
      category_id,
      age_category_id,
      available,
      categories!books_category_id_fkey(name),
      age_categories:categories!books_age_category_id_fkey(name)
    `);

  const categoryStats = {};
  const ageStats = {};

  stats?.forEach(book => {
    // Статистика по жанрам
    if (book.category_id && book.categories) {
      const categoryName = book.categories.name;
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = { total: 0, available: 0 };
      }
      categoryStats[categoryName].total++;
      if (book.available) {
        categoryStats[categoryName].available++;
      }
    }

    // Статистика по возрасту
    if (book.age_category_id && book.age_categories) {
      const ageName = book.age_categories.name;
      if (!ageStats[ageName]) {
        ageStats[ageName] = { total: 0, available: 0 };
      }
      ageStats[ageName].total++;
      if (book.available) {
        ageStats[ageName].available++;
      }
    }
  });

  console.log('\n🎭 Genre Categories:');
  Object.entries(categoryStats).forEach(([name, stats]) => {
    console.log(`   ${name}: ${stats.total} books (${stats.available} available)`);
  });

  console.log('\n👶 Age Categories:');
  Object.entries(ageStats).forEach(([name, stats]) => {
    console.log(`   ${name}: ${stats.total} books (${stats.available} available)`);
  });
}

// Запуск миграции
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateCategories();
}