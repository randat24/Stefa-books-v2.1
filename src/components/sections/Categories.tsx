"use client"

import { BookOpen, Brain, Baby, ScrollText, Coins, Sparkles, Star, Zap, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchCategoriesStats, type CategoryStats } from "@/lib/api/books"

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
	const [categories, setCategories] = useState<CategoryStats[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadCategories = async () => {
			try {
				const response = await fetchCategoriesStats()
				if (response.success) {
					setCategories(response.data)
				}
			} catch (error) {
				console.error('Error loading categories:', error)
			} finally {
				setLoading(false)
			}
		}

		loadCategories()
	}, [])

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
		)
	}

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
					const isDitya = category.name.toLowerCase().includes('дитяч') || category.name.toLowerCase().includes('казк')
					const isFantasy = category.name.toLowerCase().includes('фантастик') || category.name.toLowerCase().includes('містик')
					
					return (
						<button
							key={category.name}
							onClick={() => navigateToBooks(category.name)}
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
									<h3 className="text-lg font-semibold">{category.name}</h3>
									<p className="text-sm text-slate-600">{desc}</p>
								</div>
							</div>

							<div className="mt-6 inline-flex items-center gap-2 rounded-full bg-black/[.03] px-4 py-2 text-sm border border-black/10">
								Дивитись у каталозі
								<svg className="size-4 -mr-0.5 transition -rotate-45 group-hover:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
							</div>

							{/* кількість книг */}
							<div className="absolute top-4 right-4 text-xs rounded-full bg-black/[.06] px-2 py-1 text-slate-900">
								{category.available} книг
							</div>
						</button>
					)
				})}
			</div>
		</section>
	)
}
