"use client";

import PlansLite from "@/components/widgets/PlansLite";

export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Тарифні плани */}
          <PlansLite />
        </div>
      </div>
    </main>
  );
}