"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";

type FormData = {
  name: string;
  phone: string;
  instagram?: string;
  bookId?: string;
  plan: "Mini" | "Maxi";
  delivery: "Самовивіз" | "Нова Пошта" | "Поштомат";
  address?: string;
  note?: string;
};

export default function RentalForm({ bookId }: { bookId?: string }) {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { plan: "Mini", delivery: "Самовивіз", bookId }
  });

  const onSubmit = async () => {
    // TODO: replace with your backend / Supabase function
    // await fetch('/api/rent', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
    setSent(true);
    reset();
  };

  if (sent) return (
    <div className="p-8 rounded-2xl bg-green-50 border border-green-200">
      <p className="font-medium text-green-900">Заявку надіслано!</p>
      <p className="text-sm text-green-800 mt-3">Ми зв&apos;яжемося з вами для підтвердження оренди.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <label className="grid gap-2">
          <span className="text-sm text-muted">Ім&apos;я*</span>
          <input className="input" placeholder="Іван Петренко" {...register("name")} />
          {errors.name && <span className="text-xs text-red-600 mt-2">{errors.name.message}</span>}
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-muted">Телефон*</span>
          <input className="input" placeholder="+380 00 000 00 00" {...register("phone")} />
          {errors.phone && <span className="text-xs text-red-600 mt-2">{errors.phone.message}</span>}
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <label className="grid gap-2">
          <span className="text-sm text-muted">Instagram</span>
          <input className="input" placeholder="@username" {...register("instagram")} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-muted">Книга (ID)</span>
          <input className="input" placeholder="наприклад: 3" {...register("bookId")} />
        </label>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        <label className="grid gap-2">
          <span className="text-sm text-muted">План</span>
          <select className="input" {...register("plan")}>
            <option>Mini</option><option>Maxi</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-muted">Доставка</span>
          <select className="input" {...register("delivery")}>
            <option>Самовивіз</option><option>Нова Пошта</option><option>Поштомат</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-muted">Адреса (якщо доставка)</span>
          <input className="input" placeholder="м. Миколаїв, ..." {...register("address")} />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm text-muted">Коментар</span>
        <textarea className="input min-h-[90px]" placeholder="Побажання, час зв&apos;язку" {...register("note")} />
      </label>
      <button type="submit" className="btn-base bg-[--ink] text-white rounded-2xl h-11 px-6 mt-4">Надіслати заявку</button>
    </form>
  );
}
