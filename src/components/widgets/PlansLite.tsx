'use client';

import { useCallback } from 'react';
import Image from 'next/image';

type PlanKey = 'mini' | 'maxi';

export default function PlansLite() {
  const setPlanAndGo = useCallback((plan: PlanKey) => {
    const el = document.getElementById('form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/subscribe#form';
    }
  }, []);

  return (
    <section id="plans" className="py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Оберіть свій тариф
        </h3>
        <p className="text-slate-600 text-lg mb-12">
          Береть 1 книгу за раз, повертайте, та береть нову.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {/* Mini */}
          <div className="relative rounded-3xl border-2 border-slate-200 bg-white p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Illustration area */}
            <div className="w-32 h-32 mx-auto mb-6">
              <Image
                src="/images/books/Mini1.png"
                alt="Mini план - 1 книга"
                width={128}
                height={128}
                className="object-contain w-full h-full"
              />
            </div>
            
            <h4 className="text-3xl font-bold text-slate-900 mb-2">Mini</h4>
            <p className="text-2xl font-bold text-slate-900 mb-2">300 грн/міс.</p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Береть 1 книгу за раз, повертайте,<br />
              та береть нову.
            </p>

            <button
              onClick={() => setPlanAndGo('mini')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-2xl font-semibold transition-colors"
            >
              Обрати Mini
            </button>
          </div>

          {/* Maxi */}
          <div className="relative rounded-3xl border-2 border-yellow-200 bg-yellow-50 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Illustration area */}
            <div className="w-32 h-32 mx-auto mb-6">
              <Image
                src="/images/books/Maxi2.png"
                alt="Maxi план - 2 книги"
                width={128}
                height={128}
                className="object-contain w-full h-full"
              />
            </div>
            
            <h4 className="text-3xl font-bold text-slate-900 mb-2">Maxi</h4>
            <p className="text-2xl font-bold text-yellow-600 mb-2">500 грн/міс.</p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Береть 1-2 книги за раз,<br />
              повертайте, та береть нові.
            </p>

            <button
              onClick={() => setPlanAndGo('maxi')}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 py-3 px-6 rounded-2xl font-semibold transition-colors"
            >
              Обрати Maxi
            </button>
          </div>
        </div>

        {/* Link to all plans */}
        <div className="mt-8">
          <a 
            href="/plans" 
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            Переглянути всі тарифи →
          </a>
        </div>
      </div>
    </section>
  );
}
