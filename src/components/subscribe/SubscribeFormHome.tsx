"use client";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info } from "lucide-react";

type FormData = {
  name: string;
  phone: string;
  handle?: string;
  email: string;
  plan: "mini" | "maxi";
  payment: "Онлайн оплата" | "Переказ на карту" | "Готівка при отриманні";
  note?: string;
  screenshot?: File;
};

function SubscribeFormHomeContent() {
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();

  const {
    register, handleSubmit, formState: { errors }, watch, setValue, trigger
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      plan: "mini",
      payment: "Онлайн оплата",
      phone: "+380",
    }
  });

  const payment = watch("payment");

  // авто-подстановка тарифа из URL (?plan=mini|maxi) или sessionStorage
  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan === "mini" || plan === "maxi") {
      setValue("plan", plan);
      return;
    }
    
    // Проверяем sessionStorage для выбранного плана только на клиенте
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('selected_plan');
        if (saved === 'mini' || saved === 'maxi') {
          setValue("plan", saved);
          sessionStorage.removeItem('selected_plan');
        }
      } catch {
        // Игнорируем ошибки sessionStorage
      }
    }
  }, [searchParams, setValue]);

  // авто-префікс + маска для UA
  const onPhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.currentTarget.value.replace(/\s+/g, "");
    if (!v.startsWith("+380")) v = "+380";
    // Разрешаем только + и цифры, ограничим до +380 + 9 цифр
    v = "+" + v.replace(/[^\d]/g, "");
    if (!v.startsWith("+380")) v = "+380";
    v = v.slice(0, 13);
    setValue("phone", v, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async () => {
    // TODO: заменить на реальный бекенд (Supabase/API route)
    // await fetch('/api/subscribe', { method:'POST', body: JSON.stringify(data) })
    setSent(true);
    if (fileRef.current) fileRef.current.value = "";
  };

  if (sent) {
    return (
      <div className="card p-6" id="subscribe">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-600" size={24} />
          <h3 className="text-xl font-semibold">Заявку надіслано</h3>
        </div>
        <p className="text-[--muted] mt-1">
          Ми звʼяжемося з вами для підтвердження підписки.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="dark" asChild>
            <a href="/books#top">Перейти до вибору книг</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/books?rent=1#rent-form">Оформити ще заявку</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16" id="subscribe">
      <div className="card p-7 lg:p-9 scroll-mt-[96px]">   {/* ↑ больше отступов + scroll-mt */}
        <div className="mb-6">
          <h2 className="h2">Оформити підписку</h2>
          <p className="text-slate-600 mt-1">Mini — 300 ₴/міс • Maxi — 500 ₴/міс</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm text-slate-600">Ім&apos;я та прізвище*</span>
              <input className="input" placeholder="Іван Петренко" {...register("name")} />
              {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-slate-600">Телефон* (UA)</span>
              <input
                className="input"
                inputMode="tel"
                {...register("phone")}
                onChange={onPhoneInput}
                onBlur={() => trigger("phone")}
              />
              <span className="text-xs text-gray-500">Формат: +380XXXXXXXXX</span>
              {errors.phone && <span className="text-xs text-red-600">{errors.phone.message}</span>}
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm text-slate-600">Ваш Instagram або Telegram</span>
              <input className="input" placeholder="@username" {...register("handle")} />
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-slate-600">Email*</span>
              <input className="input" placeholder="you@email.com" {...register("email")} />
              {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm text-slate-600">План підписки*</span>
              <select className="input" {...register("plan")}>
                <option value="mini">Mini — 300 ₴/міс</option>
                <option value="maxi">Maxi — 500 ₴/міс</option>
              </select>
              {errors.plan && <span className="text-xs text-red-600">{errors.plan.message}</span>}
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-slate-600">Спосіб оплати*</span>
              <select className="input" {...register("payment")}>
                <option>Онлайн оплата</option>
                <option>Переказ на карту</option>
                <option>Готівка при отриманні</option>
              </select>
              {errors.payment && <span className="text-xs text-red-600">{errors.payment.message}</span>}
            </label>
          </div>

          {/* Инфокарта для "Переказ на карту" */}
          {payment === "Переказ на карту" && (
            <div className="rounded-2xl border border-black/10 bg-black/[.02] p-5">
              <p className="text-lg font-semibold text-slate-900 mb-3">Інформація для переказу</p>
              <div className="grid gap-2 text-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Номер карти:</span>
                  <span className="tracking-widest text-lg font-bold">4441&nbsp;1144&nbsp;4444&nbsp;4444</span>
                </div>
                <div><span className="text-slate-600">Отримувач:</span> <b>СТЕФА КНИГИ</b></div>
                <div><span className="text-slate-600">Банк:</span> <b>Monobank</b></div>
              </div>
              <div className="mt-3 rounded-xl bg-black/[.03] px-3 py-2 text-slate-900 flex items-center gap-2">
                <Info size={16} className="text-blue-600 flex-shrink-0" />
                <span>Збережіть та відправте квитанцію після оплати</span>
              </div>
            </div>
          )}

          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Коментар</span>
            <textarea className="input min-h-[110px]" placeholder="Побажання, зручний час зв&apos;язку" {...register("note")} />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-slate-600">Скріншот (необовʼязково)</span>
            <input
              type="file"
              className="input file:mr-4 file:rounded-full file:border-0 file:bg-[--brand] file:text-white file:px-4 file:py-2"
              accept="image/png,image/jpeg,image/jpg"
              {...register("screenshot")}
            />
            <span className="text-xs text-gray-500">JPG/PNG до 5MB — підтвердження оплати або побажання</span>
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="dark">Надіслати заявку</Button>
            <Button variant="outline" asChild>
              <a href="/books#top">Перейти до вибору книг</a>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function SubscribeFormHome() {
  return (
    <Suspense fallback={<div>Завантаження...</div>}>
      <SubscribeFormHomeContent />
    </Suspense>
  );
}
