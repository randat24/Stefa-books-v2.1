import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { BookCard } from '@/components/BookCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { fetchBooks } from '@/lib/api/books';

export default async function CatalogPage() {
	// Загружаем категории и книги напрямую из Supabase на сервере
	const [categoriesResponse, booksResponse] = await Promise.all([
		supabase
			.from('categories')
			.select('*')
			.order('name'),
		fetchBooks({ limit: 100 })
	]);
	
	const categories = categoriesResponse.data || [];
	const books = booksResponse.success ? booksResponse.data : [];
	
	return (
		<div className="container-default py-8">
			{/* Breadcrumbs */}
			<Breadcrumb 
				items={[
					{ label: 'Каталог книг' }
				]}
				className="mb-6"
			/>
			
			<h1 className="h1">Каталог книг</h1>
			<p className="text-muted mt-2">
				Оберіть потрібну книгу. Зверніть увагу, що ми постійно оновлюємо каталог. Якщо ви не знайшли бажаної книги, напишіть нам у будь-який зручний спосіб.
			</p>
			
			{/* Server-side Categories */}
			<div className="max-w-4xl mx-auto mt-8">
				<h2 className="text-2xl font-bold text-slate-900 mb-8">📚 Повний каталог</h2>
				{categories && !categoriesResponse.error ? (
					<div className="space-y-6">
						{categories.map((category: any) => (
							<Link
								key={category.id}
								href={`/books?category=${encodeURIComponent(category.name)}`}
								className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors"
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
						❌ Помилка завантаження категорій: {categoriesResponse.error?.message}
					</div>
				)}
			</div>

			{/* Сетка книг - такая же как на главной странице */}
			{books.length > 0 && (
				<div className="mt-12">
					<h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">📖 Всі книги</h2>
					<div className="flex flex-wrap justify-start gap-6 max-w-7xl">
						{books.map((book) => (
							<BookCard key={book.id} book={book} />
						))}
					</div>
				</div>
			)}
		</div>
	)
}
