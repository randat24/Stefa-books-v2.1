"use client"

import { BookOpen, Brain, Baby, ScrollText, Coins, Sparkles, Star, Zap, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchCategories } from "@/lib/api/books"

type Cat = {
	key: string               // значення для ?category=
	title: string
	desc: string
	Icon: React.ComponentType<{ className?: string }>
	count: number             // кількість книг у категорії
}

// Маппинг иконок для категорий
const getCategoryIcon = (category: string) => {
	const categoryLower = category.toLowerCase()
	
	if (categoryLower.includes('дитяч') || categoryLower.includes('казк')) return Baby
	if (categoryLower.includes('класик')) return ScrollText
	if (categoryLower.includes('фантастик') || categoryLower.includes('містик')) return Sparkles
	if (categoryLower.includes('підлітков')) return Heart
	if (categoryLower.includes('пізнавальн')) return Brain
	if (categoryLower.includes('природнич')) return BookOpen
	if (categoryLower.includes('сімейн')) return Heart
	
	return BookOpen // Default icon
}

// Генерация описания для категории
const getCategoryDescription = (category: string) => {
	const categoryLower = category.toLowerCase()
	
	if (categoryLower.includes('дитяч')) return "Розвиток та навчання"
	if (categoryLower.includes('казк')) return "Чарівні історії для дітей"
	if (categoryLower.includes('класик')) return "Вічні твори світової літератури"
	if (categoryLower.includes('фантастик')) return "Подорожі у неймовірні світи"
	if (categoryLower.includes('містик')) return "Загадкові пригоди та таємниці"
	if (categoryLower.includes('підлітков')) return "Історії для дорослішання"
	if (categoryLower.includes('пізнавальн')) return "Цікаві факти та знання"
	if (categoryLower.includes('природнич')) return "Про природу та довкілля"
	if (categoryLower.includes('сімейн')) return "Теплі родинні історії"
	
	return "Захоплююча література для читання"
}

export default function Categories() {
	const [categories, setCategories] = useState<string[]>([])
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

	const scrollToForm = () => {
		const el = document.getElementById("home-subscribe")
		if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
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
					const Icon = getCategoryIcon(category)
					const desc = getCategoryDescription(category)
					const isDitya = category.toLowerCase().includes('дитяч') || category.toLowerCase().includes('казк')
					const isFantasy = category.toLowerCase().includes('фантастик') || category.toLowerCase().includes('містик')
					
					return (
						<button
							key={category}
							onClick={() => navigateToBooks(category)}
							className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 hover:shadow-soft transition text-left hover:scale-[1.02]"
						>
							<div className="flex items-start gap-4">
								<div className={`size-12 rounded-2xl border-2 grid place-items-center ${
									isDitya || isFantasy ? "border-yellow-200 bg-yellow-50" :
									"border-blue-200 bg-blue-50"
								}`}>
									<Icon className={`size-6 ${
										isDitya || isFantasy ? "text-yellow-600" :
										"text-blue-600"
									}`} />
								</div>
								<div className="grid gap-1">
									<h3 className="text-lg font-semibold">{category}</h3>
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
