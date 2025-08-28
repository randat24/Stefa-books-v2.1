"use client";

import PlansLite from "@/components/widgets/PlansLite";

export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Тарифні плани
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Оберіть зручний для вас тарифний план підписки на оренду книг.
            </p>
          </div>

          {/* Тарифні плани */}
          <PlansLite />
        </div>
      </div>
    </main>
  );
}