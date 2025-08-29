"use client";
import Link from "next/link";

export default function PricingInline() {
  return (
    <div id="plans" className="rounded-3xl border border-black/10 bg-white p-6 lg:p-8 shadow-sm">
      <h3 className="text-[18px] font-semibold text-center">Тарифи</h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl bg-black/[.04] hover:bg-black/[.06] transition p-4">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium">Mini</span>
            <span className="text-blue-600 font-semibold">300 ₴/міс</span>
          </div>
          <p className="text-[13px] text-black/60 mt-1">1 книга за раз</p>
          <Link
            href={{ pathname: "/", query: { plan: "mini" }, hash: "subscribe" }}
            className="mt-3 inline-flex h-10 px-4 rounded-xl bg-[#0B1220] text-white items-center justify-center"
          >
            Обрати Mini
          </Link>
        </article>

        <article className="rounded-2xl bg-black/[.04] hover:bg-black/[.06] transition p-4">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium">Maxi</span>
            <span className="text-blue-600 font-semibold">500 ₴/міс</span>
          </div>
          <p className="text-[13px] text-black/60 mt-1">2 книги за раз</p>
          <Link
            href={{ pathname: "/", query: { plan: "maxi" }, hash: "subscribe" }}
            className="mt-3 inline-flex h-10 px-4 rounded-xl bg-[#0B1220] text-white items-center justify-center"
          >
            Обрати Maxi
          </Link>
        </article>
      </div>
    </div>
  );
}
