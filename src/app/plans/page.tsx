export default function PlansPage() {
	return (
		<div className="container-default py-8">
			<h1 className="h1">Тарифи підписки</h1>
			<div className="grid md:grid-cols-2 gap-6 mt-6">
				<div className="card p-6">
					<h3 className="text-xl font-semibold">Mini</h3>
					<p className="text-3xl font-bold text-blue-600 mt-2">300 ₴/міс</p>
					<p className="text-muted mt-2">1 книга за раз</p>
					<ul className="mt-4 space-y-2">
						<li>✓ Безкоштовна доставка</li>
						<li>✓ Можна змінювати книгу</li>
						<li>✓ Скасування в будь-який час</li>
					</ul>
				</div>
				<div className="card p-6">
					<h3 className="text-xl font-semibold">Maxi</h3>
					<p className="text-3xl font-bold text-blue-600 mt-2">500 ₴/міс</p>
					<p className="text-muted mt-2">2 книги за раз</p>
					<ul className="mt-4 space-y-2">
						<li>✓ Безкоштовна доставка</li>
						<li>✓ Можна змінювати книгу</li>
						<li>✓ Скасування в будь-який час</li>
						<li>✓ Пріоритетна підтримка</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
