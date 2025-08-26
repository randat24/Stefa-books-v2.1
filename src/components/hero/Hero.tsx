"use client";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import HeroStepsCard from "./HeroStepsCard";

export default function Hero() {
	return (
		<section className="py-6 px-4 sm:py-8 md:py-10">
			<div className="rounded-2xl sm:rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white shadow-sm overflow-hidden">
				<div className="relative">
					
					<div className="relative grid items-start gap-8 p-6 sm:p-8 md:p-10 lg:grid-cols-[1.2fr,1fr] lg:gap-12 xl:p-12">
						{/* LEFT */}
						<div className="space-y-5 sm:space-y-6 md:space-y-7">
							<Badge icon={BookOpen}>
								Книжкова оренда у Миколаєві
							</Badge>

							<h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl text-slate-900">
								Читай легко. Оформлюй підписку та забирай книги зручно.
							</h1>

							<p className="max-w-[42ch] text-slate-600 text-base sm:text-lg leading-relaxed">
								Вітаємо у книгарні за підпискою. Обирай план, шукай улюблені книжки і залишай заявку на оренду.
								Ми підготуємо і передамо у зручному місці.
							</p>

							{/* Краткая статистика */}
							<div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-200/60">
								<div className="text-center">
									<div className="text-xl font-bold text-slate-900">1000+</div>
									<div className="text-sm text-slate-500">книг</div>
								</div>
								<div className="text-center border-x border-slate-200/60">
									<div className="text-xl font-bold text-slate-900">300₴</div>
									<div className="text-sm text-slate-500">від / міс</div>
								</div>
								<div className="text-center">
									<div className="text-xl font-bold text-slate-900">24/7</div>
									<div className="text-sm text-slate-500">підтримка</div>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
								<Link 
									href="#subscribe" 
									className="inline-flex items-center justify-center rounded-full font-semibold text-base h-12 px-8 bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
								>
									Оформити підписку
								</Link>
								<Link 
									href="/books" 
									className="inline-flex items-center justify-center rounded-full font-medium text-base h-12 px-8 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-yellow-300 transition-colors"
								>
									Перейти до каталогу
								</Link>
							</div>

							{/* Дополнительная информация */}
							<div className="flex items-center gap-6 text-sm text-slate-500 pt-2">
								<div className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-blue-500" />
									Безкоштовна доставка
								</div>
								<div className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-yellow-500" />
									Скасування будь-коли
								</div>
							</div>
						</div>

						{/* RIGHT */}
						<div className="lg:sticky lg:top-8">
							<HeroStepsCard />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
