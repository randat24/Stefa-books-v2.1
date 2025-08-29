import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

// ============================================================================
// API ДЛЯ РАБОТЫ С КАТЕГОРИЯМИ
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tree = searchParams.get('tree') === 'true';
    const parentId = searchParams.get('parent_id');
    
    logger.info('📂 API: Categories endpoint called', { tree, parentId });

    if (tree) {
      try {
        // Получаем полное дерево категорий 
        const { data: categories, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) {
          logger.error('Error fetching categories from DB', error);
          // Если таблица не существует или пустая, возвращаем mock данные
          if (error.message.includes('does not exist') || error.code === 'PGRST116' || error.code === 'PGRST301') {
            logger.info('📂 Categories table not ready yet, returning mock data');
            const mockCategoryTree = [
              {
                id: 'mock-age',
                name: 'За віком',
                slug: 'age',
                parent_id: null,
                icon: '👶',
                color: '#F59E0B',
                sort_order: 1,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                children: [
                  {
                    id: 'mock-preschool',
                    name: 'Дошкільний вік',
                    slug: 'preschool',
                    parent_id: 'mock-age',
                    icon: '🧸',
                    color: '#FDE68A',
                    sort_order: 1,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    children: []
                  }
                ]
              },
              {
                id: 'mock-genre',
                name: 'За жанром',
                slug: 'genre',
                parent_id: null,
                icon: '📚',
                color: '#10B981',
                sort_order: 2,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                children: [
                  {
                    id: 'mock-fairy-tales',
                    name: 'Казки',
                    slug: 'fairy-tales',
                    parent_id: 'mock-genre',
                    icon: '🧚',
                    color: '#D1FAE5',
                    sort_order: 1,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    children: []
                  }
                ]
              }
            ];
            return NextResponse.json({
              success: true,
              data: mockCategoryTree,
              count: mockCategoryTree.length
            });
          }
          
          logger.error('Error fetching categories', error);
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
          );
        }

        // Если нет данных, возвращаем mock
        if (!categories || categories.length === 0) {
          logger.info('📂 Categories table empty, returning mock data');
          const mockCategoryTree = [
            {
              id: 'mock-age',
              name: 'За віком',
              slug: 'age',
              parent_id: null,
              icon: '👶',
              color: '#F59E0B',
              sort_order: 1,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              children: [
                {
                  id: 'mock-preschool',
                  name: 'Дошкільний вік',
                  slug: 'preschool',
                  parent_id: 'mock-age',
                  icon: '🧸',
                  color: '#FDE68A',
                  sort_order: 1,
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  children: []
                }
              ]
            },
            {
              id: 'mock-genre',
              name: 'За жанром',
              slug: 'genre',
              parent_id: null,
              icon: '📚',
              color: '#10B981',
              sort_order: 2,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              children: [
                {
                  id: 'mock-fairy-tales',
                  name: 'Казки',
                  slug: 'fairy-tales',
                  parent_id: 'mock-genre',
                  icon: '🧚',
                  color: '#D1FAE5',
                  sort_order: 1,
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  children: []
                }
              ]
            }
          ];
          return NextResponse.json({
            success: true,
            data: mockCategoryTree,
            count: mockCategoryTree.length
          });
        }

        // Строим дерево из плоского списка
        const categoryTree = buildCategoryTree(categories || []);
        
        // Возвращаем все корневые категории (в реальной базе нет 'catalog')
        const rootCategories = categoryTree.filter(cat => 
          cat.parent_id === null
        );

        logger.info(`✅ API: Built category tree with ${rootCategories.length} root categories`);
        return NextResponse.json({
          success: true,
          data: rootCategories,
          count: rootCategories.length
        });
      } catch (err) {
        logger.error('Unexpected error fetching category tree', err);
        return NextResponse.json(
          { success: false, error: 'Database not ready' },
          { status: 503 }
        );
      }
    }

    // Если указан parent_id, возвращаем дочерние категории
    if (parentId) {
      try {
        const { data: children, error } = await supabase
          .from('categories')
          .select('*')
          .eq('parent_id', parentId)
          .order('sort_order')
          .order('name');

        if (error && (error.message.includes('does not exist') || error.code === 'PGRST116')) {
          return NextResponse.json({
            success: true,
            data: [],
            count: 0
          });
        }

        if (error) {
          logger.error('Error fetching child categories', error);
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
          );
        }

        logger.info(`✅ API: Found ${children?.length || 0} child categories for parent ${parentId}`);
        return NextResponse.json({
          success: true,
          data: children || [],
          count: children?.length || 0
        });
      } catch (err) {
        return NextResponse.json({
          success: true,
          data: [],
          count: 0
        });
      }
    }

    // Возвращаем все категории
    try {
      const { data: allCategories, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order')
        .order('name');

      if (error && (error.message.includes('does not exist') || error.code === 'PGRST116')) {
        return NextResponse.json({
          success: true,
          data: [],
          count: 0
        });
      }

      if (error) {
        logger.error('Error fetching all categories', error);
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      logger.info(`✅ API: Found ${allCategories?.length || 0} total categories`);
      return NextResponse.json({
        success: true,
        data: allCategories || [],
        count: allCategories?.length || 0
      });
    } catch (err) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0
      });
    }

  } catch (error) {
    logger.error('API error', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// ПОЛУЧЕНИЕ ХЛЕБНЫХ КРОШЕК ДЛЯ КАТЕГОРИИ
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const { action, category_id } = await request.json();
    
    if (action === 'get_breadcrumbs') {
      logger.info('📍 API: Breadcrumbs endpoint called', { category_id });
      
      if (!category_id) {
        return NextResponse.json(
          { success: false, error: 'category_id is required' },
          { status: 400 }
        );
      }

      // Временно возвращаем пустые хлебные крошки до миграции БД
      logger.info(`📍 API: Breadcrumbs temporarily disabled until DB migration`);
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    return NextResponse.json(
      { success: false, error: 'Неизвестное действие' },
      { status: 400 }
    );

  } catch (error) {
    logger.error('API error', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Построение дерева категорий из плоского списка
 */
function buildCategoryTree(flatList: any[]) {
  const itemsById: Record<string, any> = {};
  const rootItems: any[] = [];

  // Сначала создаем объекты для всех элементов
  flatList.forEach(item => {
    itemsById[item.id] = {
      ...item,
      children: []
    };
  });

  // Затем строим иерархию
  flatList.forEach(item => {
    const currentItem = itemsById[item.id];
    
    if (item.parent_id && itemsById[item.parent_id]) {
      // Добавляем к родительскому элементу
      if (!itemsById[item.parent_id].children) {
        itemsById[item.parent_id].children = [];
      }
      itemsById[item.parent_id].children.push(currentItem);
    } else {
      // Это корневой элемент
      rootItems.push(currentItem);
    }
  });

  // Сортируем детей по sort_order
  Object.values(itemsById).forEach(item => {
    if (item.children && item.children.length > 0) {
      item.children.sort((a: any, b: any) => a.sort_order - b.sort_order);
    }
  });

  return rootItems.sort((a, b) => a.sort_order - b.sort_order);
}