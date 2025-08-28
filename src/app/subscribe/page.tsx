"use client";

import SubscribeFormHome from "@/components/subscribe/SubscribeFormHome";
import PlansLite from "@/components/widgets/PlansLite";

export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Оформлення підписки
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Оберіть план та заповніть форму. Ми зв'яжемося з вами для підтвердження деталей.
            </p>
          </div>

          {/* Тарифні плани */}
          <PlansLite />

          {/* Форма підписки */}
          <SubscribeFormHome />
        </div>
      </div>
    </main>
  );
}