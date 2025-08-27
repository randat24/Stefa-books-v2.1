import { BookOpen, Users, Star, Check, Crown, Heart } from 'lucide-react';

export default function PlansPage() {
	const plans = [
		{
			name: 'Mini',
			price: '300',
			period: 'грн/міс',
			description: 'Береть 1 книгу за раз, змінюйте коли забажаєте.',
			icon: BookOpen,
			bgColor: 'bg-green-50',
			borderColor: 'border-green-200',
			iconColor: 'text-green-600',
			priceColor: 'text-green-600',
			buttonColor: 'bg-green-600 hover:bg-green-700',
			features: [
				'1 книга за раз',
				'Самовивіз з кафе',
				'Безлімітна заміна книг',
				'Скасування в будь-який час'
			]
		},
		{
			name: 'Maxi',
			price: '500',
			period: 'грн/міс',
			description: 'Береть 2 книги за раз, змінюйте коли забажаєте.',
			icon: Users,
			bgColor: 'bg-yellow-50',
			borderColor: 'border-yellow-200',
			iconColor: 'text-yellow-600',
			priceColor: 'text-yellow-600',
			buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
			popular: true,
			features: [
				'2 книги за раз',
				'Самовивіз з кафе',
				'Безлімітна заміна книг',
				'Скасування в будь-який час'
			]
		},
		{
			name: 'Premium',
			price: '2500',
			period: 'грн/пів року',
			description: 'Вигідний план на 6 місяців: 2 книги за раз.',
			icon: Crown,
			bgColor: 'bg-purple-50',
			borderColor: 'border-purple-200',
			iconColor: 'text-purple-600',
			priceColor: 'text-purple-600',
			buttonColor: 'bg-purple-600 hover:bg-purple-700',
			features: [
				'2 книги за раз',
				'Самовивіз з кафе',
				'Безлімітна заміна книг',
				'Оплата на 6 місяців',
				'Економія 500 грн',
				'Скасування в будь-який час'
			]
		}
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
			<div className="container mx-auto px-6">
				{/* Заголовок */}
				<div className="text-center mb-16">
					<h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
						Оберіть свій тариф
					</h1>
					<p className="text-lg text-slate-600 max-w-2xl mx-auto">
						Підписка дає доступ до всіх книг у нашій бібліотеці. Змінюйте план в будь-який час.
					</p>
				</div>

				{/* Тарифы */}
				<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{plans.map((plan) => {
						const Icon = plan.icon;
						return (
							<div
								key={plan.name}
								className={`relative rounded-3xl p-8 ${plan.bgColor} border-2 ${plan.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full`}
							>
								{/* Popular badge */}
								{plan.popular && (
									<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
										<div className="bg-yellow-500 text-slate-900 px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
											<Star className="h-4 w-4 fill-current" />
											Найпопулярніший
										</div>
									</div>
								)}

								{/* Иконка */}
								<div className={`w-20 h-20 mx-auto mb-6 ${plan.bgColor} rounded-2xl flex items-center justify-center border ${plan.borderColor}`}>
									<Icon className={`h-10 w-10 ${plan.iconColor}`} />
								</div>

								{/* Название */}
								<div className="text-center mb-6">
									<h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
									<div className={`text-4xl font-bold ${plan.priceColor} mb-2`}>
										{plan.price} <span className="text-lg font-normal text-slate-600">{plan.period}</span>
									</div>
									<p className="text-slate-600 text-sm leading-relaxed">{plan.description}</p>
								</div>

								{/* Функции */}
								<ul className="space-y-3 mb-8 flex-1">
									{plan.features.map((feature, index) => (
										<li key={index} className="flex items-center gap-3">
											<div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
												<Check className="h-3 w-3 text-green-600" />
											</div>
											<span className="text-slate-700 text-sm">{feature}</span>
										</li>
									))}
								</ul>

								{/* Кнопка */}
								<a
									href={`/subscribe?plan=${plan.name.toLowerCase()}&price=${plan.price}&period=${encodeURIComponent(plan.period)}`}
									className={`w-full py-4 rounded-2xl text-white font-semibold transition-colors ${plan.buttonColor} flex items-center justify-center gap-2 mt-auto`}
								>
									<Heart className="h-4 w-4" />
									Обрати {plan.name}
								</a>
							</div>
						);
					})}
				</div>

				{/* Дополнительная информация */}
				<div className="text-center mt-16">
					<div className="bg-slate-100 rounded-2xl p-8 max-w-4xl mx-auto">
						<h3 className="text-xl font-semibold text-slate-900 mb-4">
							Усі плани включають:
						</h3>
						<div className="grid md:grid-cols-2 gap-4 text-slate-700">
							<div className="flex items-center gap-3">
								<Check className="h-5 w-5 text-green-600" />
								<span>Безлімітна заміна книг протягом місяця</span>
							</div>
							<div className="flex items-center gap-3">
								<Check className="h-5 w-5 text-green-600" />
								<span>Самовивіз з кафе (вул. Маріупольська 13/2)</span>
							</div>
							<div className="flex items-center gap-3">
								<Check className="h-5 w-5 text-green-600" />
								<span>Без прихованих платежів</span>
							</div>
							<div className="flex items-center gap-3">
								<Check className="h-5 w-5 text-green-600" />
								<span>Відміна в будь-який час</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
