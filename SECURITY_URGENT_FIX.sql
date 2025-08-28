-- ============================================================================
-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ SECURITY WARNINGS
-- Выполните этот SQL в Supabase Dashboard -> SQL Editor
-- ============================================================================

-- Пересоздаем функцию search_books с безопасным search_path
DROP FUNCTION IF EXISTS public.search_books(TEXT, TEXT[], TEXT[], BOOLEAN, INTEGER, TEXT);

CREATE OR REPLACE FUNCTION public.search_books(
    query_text TEXT,
    category_filter TEXT[] DEFAULT NULL,
    author_filter TEXT[] DEFAULT NULL,
    available_only BOOLEAN DEFAULT false,
    limit_count INTEGER DEFAULT 50,
    sort_by TEXT DEFAULT 'relevance'
)
RETURNS TABLE(
    id UUID,
    code TEXT,
    title TEXT,
    author TEXT,
    category TEXT,
    subcategory TEXT,
    cover_url TEXT,
    rating DECIMAL,
    rating_count INTEGER,
    available BOOLEAN,
    badges TEXT[],
    rank REAL
)
SET search_path = public  -- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ БЕЗОПАСНОСТИ
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    clean_query TEXT;
    search_clause TEXT;
BEGIN
    -- Очищаем и подготавливаем поисковый запрос
    clean_query := TRIM(COALESCE(query_text, ''));
    
    -- Базовый запрос с фильтрами
    RETURN QUERY
    EXECUTE format('
        SELECT 
            b.id, b.code, b.title, b.author, b.category, b.subcategory,
            b.cover_url, b.rating, b.rating_count, b.available, b.badges,
            CASE 
                WHEN $1 = '''' THEN COALESCE(b.rating, 0)::REAL
                ELSE ts_rank_cd(b.search_vector, plainto_tsquery(''ukrainian'', $1)) * 100
            END as rank
        FROM public.books b
        WHERE 1=1
            %s  -- search condition
            %s  -- category filter  
            %s  -- author filter
            %s  -- available filter
        ORDER BY %s
        LIMIT $2
    ',
    CASE WHEN clean_query != '' THEN 
        'AND (b.search_vector @@ plainto_tsquery(''ukrainian'', $1) OR b.title ILIKE ''%'' || $1 || ''%'' OR b.author ILIKE ''%'' || $1 || ''%'')'
    ELSE '' END,
    CASE WHEN category_filter IS NOT NULL THEN 'AND b.category = ANY($3)' ELSE '' END,
    CASE WHEN author_filter IS NOT NULL THEN 'AND b.author = ANY($4)' ELSE '' END, 
    CASE WHEN available_only THEN 'AND b.available = true' ELSE '' END,
    CASE sort_by 
        WHEN 'title' THEN 'b.title ASC'
        WHEN 'author' THEN 'b.author ASC' 
        WHEN 'rating' THEN 'b.rating DESC NULLS LAST'
        WHEN 'newest' THEN 'b.created_at DESC'
        ELSE 'rank DESC, b.rating DESC NULLS LAST'
    END
    ) USING clean_query, limit_count, category_filter, author_filter;
END;
$$;

-- Пересоздаем функцию update_book_availability с безопасным search_path
DROP FUNCTION IF EXISTS public.update_book_availability();

CREATE OR REPLACE FUNCTION public.update_book_availability()
RETURNS TRIGGER
SET search_path = public  -- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ БЕЗОПАСНОСТИ  
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    book_record RECORD;
    active_rentals INTEGER;
BEGIN
    -- При изменении статуса аренды пересчитываем доступность книги
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Получаем информацию о книге
        SELECT * INTO book_record FROM public.books WHERE id = NEW.book_id;
        
        -- Считаем активные аренды
        SELECT COUNT(*) INTO active_rentals 
        FROM public.rentals 
        WHERE book_id = NEW.book_id 
        AND status IN ('active', 'overdue');
        
        -- Обновляем доступность
        UPDATE public.books 
        SET 
            qty_available = GREATEST(0, qty_total - active_rentals),
            available = (qty_total - active_rentals) > 0,
            status = CASE 
                WHEN (qty_total - active_rentals) > 0 THEN 'available'
                ELSE 'issued'
            END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.book_id;
        
        RETURN NEW;
    END IF;
    
    -- При удалении аренды тоже пересчитываем
    IF TG_OP = 'DELETE' THEN
        SELECT * INTO book_record FROM public.books WHERE id = OLD.book_id;
        
        SELECT COUNT(*) INTO active_rentals 
        FROM public.rentals 
        WHERE book_id = OLD.book_id 
        AND status IN ('active', 'overdue')
        AND id != OLD.id; -- исключаем удаляемую запись
        
        UPDATE public.books 
        SET 
            qty_available = GREATEST(0, qty_total - active_rentals),
            available = (qty_total - active_rentals) > 0,
            status = CASE 
                WHEN (qty_total - active_rentals) > 0 THEN 'available'
                ELSE 'issued'
            END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.book_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;

-- Уведомление о завершении
SELECT 'Security fixes applied! Check Security Advisor - warnings should be gone.' as result;