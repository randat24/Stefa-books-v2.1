import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function CatalogPage() {
	// Загружаем категории напрямую из Supabase на сервере
	const { data: categories, error } = await supabase
		.from('categories')
		.select('*')
		.order('name');
	
	return (
		<div className="container-default py-8">
			<h1 className="h1">Каталог книг</h1>
			<p className="text-muted mt-2">
				Оберіть потрібну книгу. Зверніть увагу, що ми постійно оновлюємо каталог. Якщо ви не знайшли бажаної книги, напишіть нам у будь-який зручний спосіб.
			</p>
			
			{/* Server-side Categories */}
			<div className="max-w-4xl mx-auto mt-8">
				<h2 className="text-2xl font-bold text-slate-900 mb-8">📚 Повний каталог</h2>
				{categories && !error ? (
					<div className="space-y-6">
						{categories.map((category: any) => (
							<Link
								key={category.id}
								href={`/books?category=${encodeURIComponent(category.name)}`}
								className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors block"
								style={{ 
									backgroundColor: category.color ? `${category.color}20` : '#F8FAFC',
									borderLeft: `4px solid ${category.color || '#64748B'}` 
								}}
							>
								<span className="text-2xl">{category.icon || '📚'}</span>
								<h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">
									{category.name}
								</h3>
								<span className="ml-auto text-sm text-slate-500 bg-white px-2 py-1 rounded-full">
									Переглянути книги →
								</span>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-12 text-red-600">
						❌ Помилка завантаження категорій: {error?.message}
					</div>
				)}
			</div>
			
		</div>
	)
}
