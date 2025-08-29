"use client";

import PlansLite from "@/components/widgets/PlansLite";

export default function SubscribePage() {
  return (
    <main className="min-h-screen">
      {/* Серый фон на всю ширину и высоту, включая область под заголовком */}
      <div className="w-full min-h-screen bg-gray-50">
        {/* Заголовок страницы */}
        <div className="pt-8 pb-16 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Тарифні плани підписки
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Оберіть план, який підходить саме вам. Mini для початківців, Maxi для завзятих читачів.
          </p>
        </div>
        
        {/* Тарифні плани */}
        <PlansLite />
      </div>
    </main>
  );
}