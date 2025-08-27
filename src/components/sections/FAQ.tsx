"use client";
import { useState, useEffect } from "react";

const QA = [
  {
    q: "Де працює Stefa.Books?",
    a: "Ми працюємо в Миколаєві. Забрати книгу можна у точці видачі або замовити доставку «Новою поштою»."
  },
  {
    q: "Як працює підписка Mini та Maxi?",
    a: "Mini — 300 ₴/міс, 1 книга одночасно. Maxi — 500 ₴/міс, 2 книги одночасно. Міняти книги можна протягом місяця без доплат."
  },
  {
    q: "Як оплатити?",
    a: "Переказ на карту, готівка при отриманні або онлайн‑оплата (скоро). Реквізити показуються у формі підписки."
  },
  {
    q: "Чи потрібно заставу?",
    a: "Ні. Але ми просимо дбайливо ставитися до книжок і повертати їх у зазначений термін."
  },
  {
    q: "Що, якщо книги немає в наявності?",
    a: "Можна додати її в «Обране» і оформити передзамовлення — ми повідомимо, коли вона з'явиться."
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setOpen(0); // Set first item open after mount
  }, []);
  return (
    <section className="py-10 lg:py-16">
      <h2 className="h2 text-center mb-3">Питання та відповіді</h2>
      <p className="text-center text-muted mb-8">Коротко про головне — щоб ви швидко розібралися</p>

      <div className="grid gap-3 max-w-3xl mx-auto">
        {QA.map((item, i) => {
          const active = open === i;
          return (
            <div key={i} className="rounded-2xl border border-[--line] bg-white">
              <button
                className="w-full text-left px-5 py-4 font-medium flex items-center justify-between text-[--ink] hover:bg-black/[.02] transition"
                onClick={() => setOpen(active ? null : i)}
                aria-expanded={active}
              >
                {item.q}
                <span className={`transition text-2xl ${active ? "rotate-45" : ""}`}>+</span>
              </button>
              {mounted && active && (
                <div className="px-5 pb-5 text-muted">{item.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
