"use client";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import HeroStepsCard from "./HeroStepsCard";

export default function Hero() {
	return (
		<section className="section-sm">
			<div className="container">
				<div className="card gap-fluid overflow-hidden" style={{paddingInline: 'var(--space-8)', paddingBlock: 'var(--space-8)'}}>
					<div className="relative grid items-start gap-6 md:gap-8 md:grid-cols-1 lg:grid-cols-[1.2fr,1fr]">
						{/* LEFT */}
						<div style={{display: 'grid', gap: 'var(--space-6)'}} className="md:px-4 lg:pl-6 lg:pr-0 max-w-2xl">
										<Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800 inline-flex items-center gap-2 px-4 py-2 text-sm max-w-fit">
				<BookOpen className="w-4 h-4" />
				<span className="whitespace-nowrap">Книжкова оренда у Миколаєві</span>
			</Badge>

							<h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-slate-900 hero-title max-w-4xl">
								Читай легко. Оформлюй підписку та забирай книги зручно.
							</h1>

							<p className="text-slate-600 hero-description max-w-3xl" style={{fontSize: 'var(--font-size-lg)'}}>
								Вітаємо у книгарні за підпискою. Обирай план, шукай улюблені книжки і залишай заявку на оренду.
								Ми підготуємо і передамо у зручному місці.
							</p>

							{/* Краткая статистика */}
							<div className="grid grid-cols-3 border-y border-slate-200/60 gap-4 py-4 max-w-md">
								<div className="text-center">
									<div className="font-bold text-slate-900 text-lg">500+</div>
									<div className="text-slate-500 text-sm">книг</div>
								</div>
								<div className="text-center border-x border-slate-200/60">
									<div className="font-bold text-slate-900 text-lg">300₴</div>
									<div className="text-slate-500 text-sm">1 книжка / міс</div>
								</div>
								<div className="text-center">
									<div className="font-bold text-slate-900 text-lg">500₴</div>
									<div className="text-slate-500 text-sm">1 - 2 книжки</div>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 max-w-md">
								<Link 
									href="#subscribe" 
									className="btn-primary text-sm px-6 py-2.5"
								>
									Оформити підписку
								</Link>
								<Link 
									href="/books" 
									className="btn-outline text-sm px-6 py-2.5"
								>
									Перейти до каталогу
								</Link>
							</div>

							{/* Дополнительная информация */}
							<div className="flex items-center text-slate-500 gap-4 pt-2 text-sm max-w-md">
								<div className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-blue-500" />
									Безкоштовна доставка
								</div>
								<div className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-yellow-500" />
									Легкий обмін книг
								</div>
							</div>
						</div>

						{/* RIGHT */}
						<div className="lg:sticky lg:top-8 md:px-0 md:w-full md:mx-auto lg:w-auto lg:mx-0 lg:pr-5 lg:pl-0">
							<HeroStepsCard />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
