'use client';

import { useCallback } from 'react';

type PlanKey = 'mini' | 'maxi';

export default function PlansLite() {
  const setPlanAndGo = useCallback((plan: PlanKey) => {
    try {
      sessionStorage.setItem('selected_plan', plan);
    } catch {}
    const el = document.getElementById('form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/subscribe#form';
    }
  }, []);

  return (
    <section id="plans" className="py-16 text-center">
      <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
        Тарифи
      </h3>
      <p className="mt-3 text-slate-500 text-lg">
        Обери тип підписки. Ціна показується вже у формі оплати.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Mini */}
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h4 className="text-2xl font-bold text-slate-900">Mini</h4>
          <p className="mt-2 text-slate-600">1 книга за раз</p>

          <button
            onClick={() => setPlanAndGo('mini')}
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-5 py-3 text-white hover:bg-blue-600 transition-colors font-semibold"
          >
            Обрати Mini
          </button>
        </div>

        {/* Maxi */}
        <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-slate-900 font-bold text-lg">M</span>
          </div>
          <h4 className="text-2xl font-bold text-slate-900">Maxi</h4>
          <p className="mt-2 text-slate-600">2 книги за раз</p>

          <button
            onClick={() => setPlanAndGo('maxi')}
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-yellow-500 px-5 py-3 text-slate-900 hover:bg-yellow-400 transition-colors font-semibold"
          >
            Обрати Maxi
          </button>
        </div>
      </div>
    </section>
  );
}
