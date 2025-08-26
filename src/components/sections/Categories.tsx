import { BookOpen, Brain, Baby, ScrollText, Coins, Sparkles } from "lucide-react"

type Cat = {
	key: string               // значення для ?category=
	title: string
	desc: string
	Icon: React.ComponentType<{ className?: string }>
	count: number             // кількість книг у категорії
}

const CATS: Cat[] = [
	{ key: "Діти",        title: "Для дітей",           desc: "Казки, пригоди, розвиток",     Icon: Baby,       count: 89 },
	{ key: "Психологія",  title: "Психологія",          desc: "Про емоції та стійкість",      Icon: Brain,      count: 156 },
	{ key: "Художня",     title: "Художня література",  desc: "Романи, драма, класика",       Icon: ScrollText, count: 234 },
	{ key: "Нон‑фікшн",   title: "Нон‑фікшн",           desc: "Біографії, історія, наука",    Icon: BookOpen,   count: 178 },
	{ key: "Бізнес",      title: "Бізнес/розвиток",     desc: "Кар'єра, лідерство, гроші",    Icon: Coins,      count: 145 },
	{ key: "Фентезі",     title: "Фентезі",             desc: "Світ пригод і магії",          Icon: Sparkles,   count: 98 },
]

export default function Categories() {
	const scrollToForm = () => {
		const el = document.getElementById("home-subscribe")
		if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
	}

	return (
		<section id="catalog" className="py-10 lg:py-16">
			<div className="flex items-end justify-between mb-5">
				<div>
					<h2 className="h2">Категорії</h2>
					<p className="text-slate-600">Вибирай настрій читання — і вперед!</p>
				</div>
				<button 
					onClick={scrollToForm}
					className="inline-flex items-center justify-center rounded-full font-semibold h-10 px-4 bg-transparent text-slate-900 hover:bg-slate-50 transition-colors"
				>
					Дивитись всі книги
				</button>
			</div>

			{/* великі плитки */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{CATS.map(({ key, title, desc, Icon, count }) => (
					<button
						key={key}
						onClick={scrollToForm}
						className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 hover:shadow-soft transition text-left hover:scale-[1.02]"
					>
						<div className="flex items-start gap-4">
							<div className={`size-12 rounded-2xl border-2 grid place-items-center ${
								key === "Діти" || key === "Фентезі" ? "border-yellow-200 bg-yellow-50" :
								key === "Психологія" || key === "Художня" ? "border-blue-200 bg-blue-50" :
								"border-yellow-200 bg-yellow-50"
							}`}>
								<Icon className={`size-6 ${
									key === "Діти" || key === "Фентезі" ? "text-yellow-600" :
									key === "Психологія" || key === "Художня" ? "text-blue-600" :
									"text-yellow-600"
								}`} />
							</div>
							<div className="grid gap-1">
								<h3 className="text-lg font-semibold">{title}</h3>
								<p className="text-sm text-slate-600">{desc}</p>
							</div>
						</div>

						<div className="mt-6 inline-flex items-center gap-2 rounded-full bg-black/[.03] px-4 py-2 text-sm border border-black/10">
							Дивитись у каталозі
							<svg className="size-4 -mr-0.5 transition -rotate-45 group-hover:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
						</div>

						{/* кількість книг */}
						<div className="absolute top-4 right-4 text-xs rounded-full bg-black/[.06] px-2 py-1 text-slate-900">
							{count} книг
						</div>
					</button>
				))}
			</div>
		</section>
	)
}
