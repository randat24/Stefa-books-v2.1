"use client"

import { BookOpen, Brain, Baby, ScrollText, Star, Heart, Wand2, Search, BookMarked, Globe, BookText, GraduationCap, Compass, Palette, Crown } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchCategories, type Category } from "@/lib/api/books"

// Маппинг иконок для категорий по названию - точные соответствия
const getCategoryIcon = (category: string) => {
	const categoryLower = category.toLowerCase()
	
	// Категории по возрасту
	if (categoryLower.includes('найменші') || categoryLower.includes('0-3')) return Baby
	if (categoryLower.includes('дошкільн') || categoryLower.includes('3-6')) return Palette
	if (categoryLower.includes('молодш') || categoryLower.includes('6-9')) return BookOpen
	if (categoryLower.includes('середн') || categoryLower.includes('9-12')) return ScrollText
	if (categoryLower.includes('підлітков') || categoryLower.includes('12+')) return Star
	
	// Категории по жанрам
	if (categoryLower.includes('казк')) return Crown
	if (categoryLower.includes('пізнавальн')) return GraduationCap
	if (categoryLower.includes('детектив')) return Search
	if (categoryLower.includes('пригоди')) return Compass
	if (categoryLower.includes('повість')) return BookText
	if (categoryLower.includes('фентезі')) return Wand2
	if (categoryLower.includes('реалістичн')) return Globe
	if (categoryLower.includes('романтик')) return Heart
	
	// Категории для взрослых
	if (categoryLower.includes('психологі')) return Brain
	if (categoryLower.includes('сучасн')) return BookMarked
	
	return BookOpen // Default icon
}

// Генерация описания для категории по названию - точные соответствия
const getCategoryDescription = (category: string) => {
	const categoryLower = category.toLowerCase()
	
	// Категории по возрасту
	if (categoryLower.includes('найменші') || categoryLower.includes('0-3')) return "Книги для найменших читачів"
	if (categoryLower.includes('дошкільн') || categoryLower.includes('3-6')) return "Розвиваючі книги для дошкільнят"
	if (categoryLower.includes('молодш') || categoryLower.includes('6-9')) return "Книги для молодших школярів"
	if (categoryLower.includes('середн') || categoryLower.includes('9-12')) return "Література для середнього віку"
	if (categoryLower.includes('підлітков') || categoryLower.includes('12+')) return "Книги для підлітків та молоді"
	
	// Категории по жанрам
	if (categoryLower.includes('казк')) return "Чарівні історії та казки для дітей"
	if (categoryLower.includes('пізнавальн')) return "Пізнавальна література для розвитку"
	if (categoryLower.includes('детектив')) return "Загадкові пригоди та детективи"
	if (categoryLower.includes('пригоди')) return "Захоплюючі подорожі та пригоди"
	if (categoryLower.includes('повість')) return "Художня проза для читання"
	if (categoryLower.includes('фентезі')) return "Фантастичні світи та магія"
	if (categoryLower.includes('реалістичн')) return "Реалістичні історії про життя"
	if (categoryLower.includes('романтик')) return "Романтичні історії та почуття"
	
	// Категории для взрослых
	if (categoryLower.includes('психологі')) return "Психологія та саморозвиток"
	if (categoryLower.includes('сучасн')) return "Сучасна проза та белетристика"
	
	return "Захоплююча література для читання"
}

export default function Categories() {
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadCategories = async () => {
			try {
				console.log('🔄 Categories: Starting to load categories...')
				const response = await fetchCategories()
				console.log('📊 Categories: Response:', { 
					success: response.success, 
					count: response.count, 
					hasData: !!response.data,
					error: response.error 
				})
				if (response.success) {
					setCategories(response.data)
					console.log('✅ Categories: Categories loaded successfully:', response.data.length)
				} else {
					console.error('❌ Categories: Failed to load categories:', response.error)
				}
			} catch (error) {
				console.error('❌ Categories: Error loading categories:', error)
			} finally {
				setLoading(false)
				console.log('🏁 Categories: Data loading completed')
			}
		}

		loadCategories()
	}, [])

	// Validate categories data
	if (categories.length > 0) {
		console.log('📊 Categories: Valid categories data:', categories)
	}

	const navigateToBooks = (category?: string) => {
		if (category) {
			window.location.href = `/books?category=${encodeURIComponent(category)}`
		} else {
			window.location.href = '/books'
		}
	}


	if (loading) {
		return (
			<section id="catalog" className="py-10 lg:py-16">
				<div className="flex items-end justify-between mb-5">
					<div>
						<h2 className="h2">Категорії</h2>
						<p className="text-slate-600">Вибирай настрій читання — і вперед!</p>
					</div>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 animate-pulse">
							<div className="flex items-start gap-4">
								<div className="size-12 rounded-2xl bg-slate-200"></div>
								<div className="grid gap-2 flex-1">
									<div className="h-5 bg-slate-200 rounded w-3/4"></div>
									<div className="h-4 bg-slate-200 rounded w-full"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		);
	}

	// Don't render if no categories
	if (categories.length === 0) {
		console.log('📂 Categories: No categories to display')
		return (
			<section id="catalog" className="py-10 lg:py-16">
				<div className="flex items-end justify-between mb-5">
					<div>
						<h2 className="h2">Категорії</h2>
						<p className="text-slate-600">Вибирай настрій читання — і вперед!</p>
					</div>
				</div>
				<div className="text-center py-12">
					<p className="text-lg text-slate-600 mb-4">Категорії завантажуються</p>
					<p className="text-sm text-slate-500">Зачекайте, будь ласка...</p>
				</div>
			</section>
		);
	}

	console.log('📊 Categories: Rendering with', categories.length, 'categories')

	return (
		<section id="catalog" className="py-10 lg:py-16">
			<div className="flex items-end justify-between mb-5">
				<div>
					<h2 className="h2">Категорії</h2>
					<p className="text-slate-600">Вибирай настрій читання — і вперед!</p>
				</div>
				<button 
					onClick={() => navigateToBooks()}
					className="inline-flex items-center justify-center rounded-full font-semibold h-10 px-4 bg-transparent text-slate-900 hover:bg-slate-50 transition-colors"
				>
					Дивитись всі книги
				</button>
			</div>

			{/* великі плитки */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{categories.slice(0, 6).map((category) => {
					const Icon = getCategoryIcon(category.name)
					const desc = getCategoryDescription(category.name)
					const isAgeCategory = category.name.toLowerCase().includes('найменші') || category.name.toLowerCase().includes('дошкільн') || category.name.toLowerCase().includes('молодш') || category.name.toLowerCase().includes('середн') || category.name.toLowerCase().includes('підлітков')
					const isFantasyCategory = category.name.toLowerCase().includes('казк') || category.name.toLowerCase().includes('фентезі')
					const isEducationalCategory = category.name.toLowerCase().includes('пізнавальн') || category.name.toLowerCase().includes('психологі')
					const isAdventureCategory = category.name.toLowerCase().includes('детектив') || category.name.toLowerCase().includes('пригоди')
					
					return (
						<button
							key={category.id}
							onClick={() => navigateToBooks(category.name)}
							className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 hover:shadow-soft transition text-left hover:scale-[1.02]"
						>
							{/* Количество книг в верхнем правом углу */}
							<div className="absolute top-3 right-3">
								<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white/80 border border-white/50 shadow-sm">
									<BookOpen className="size-3" />
									{category.book_count}
								</span>
							</div>

							<div className="flex items-start gap-4">
								<div className={`size-12 rounded-2xl border-2 grid place-items-center ${
									isAgeCategory ? "border-yellow-200 bg-yellow-50" :
									isFantasyCategory ? "border-purple-200 bg-purple-50" :
									isEducationalCategory ? "border-blue-200 bg-blue-50" :
									isAdventureCategory ? "border-red-200 bg-red-50" :
									"border-slate-200 bg-slate-50"
								}`}>
									<Icon className={`size-6 ${
										isAgeCategory ? "text-yellow-600" :
										isFantasyCategory ? "text-purple-600" :
										isEducationalCategory ? "text-blue-600" :
										isAdventureCategory ? "text-red-600" :
										"text-slate-600"
									}`} />
								</div>
								<div className="grid gap-1">
									<h3 className="text-lg font-semibold">{category.name}</h3>
									<p className="text-sm text-slate-600">{desc}</p>
								</div>
							</div>

							<div className="mt-6 inline-flex items-center gap-2 rounded-full bg-black/[.03] px-4 py-2 text-sm border border-black/10">
								Дивитись у каталозі
								<svg className="size-4 -mr-0.5 transition -rotate-45 group-hover:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
							</div>
						</button>
					)
				})}
			</div>
		</section>
	)
}
