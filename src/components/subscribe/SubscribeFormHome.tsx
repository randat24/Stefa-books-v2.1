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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      let screenshotUrl = null;
      
      // Загрузка скриншота в Cloudinary если есть файл
      if (data.screenshot && data.screenshot.length > 0) {
        const formData = new FormData();
        formData.append('file', data.screenshot[0]);
        formData.append('upload_preset', 'stefa_books'); // TODO: создать upload preset в Cloudinary
        
        const cloudinaryResponse = await fetch(
          'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', // TODO: заменить на реальный cloud name
          {
            method: 'POST',
            body: formData,
          }
        );
        
        if (cloudinaryResponse.ok) {
          const cloudinaryResult = await cloudinaryResponse.json();
          screenshotUrl = cloudinaryResult.secure_url;
        }
      }
      
      // Отправка данных формы
      const submitData = {
        ...data,
        screenshot: screenshotUrl,
      };
      
      // TODO: заменить на реальный бекенд (Supabase/API route)
      console.log('Form data:', submitData);
      // await fetch('/api/subscribe', { 
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submitData) 
      // });
      
      setSent(true);
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      console.error('Помилка при відправці форми:', error);
      // TODO: показать уведомление об ошибке
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <section className="py-16 px-6" id="subscribe">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Заявку надіслано!</h3>
            <p className="text-slate-600 mb-6">
              Дякуємо за заявку! Ми зв'яжемося з вами найближчим часом для підтвердження підписки.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                asChild
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
              >
                <a href="/books#top">Переглянути книги</a>
              </Button>
              <Button
                asChild
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 border-0"
              >
                <a href="/#plans">Обрати інший план</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6" id="subscribe">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Оформити підписку
          </h2>
          <p className="text-lg text-slate-600">
            Заповніть форму і ми зв'яжемося з вами найближчим часом
          </p>
          <div className="mt-4 inline-flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700">
              Mini — 300 ₴/міс
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-yellow-700">
              Maxi — 500 ₴/міс
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Имя */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Ім'я та прізвище *
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Іван Петренко"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="you@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Телефон */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Телефон *
              </label>
              <input
                {...register("phone")}
                id="phone"
                type="tel"
                inputMode="tel"
                onChange={onPhoneInput}
                onBlur={() => trigger("phone")}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="+380 XX XXX XX XX"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* План подписки */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">
                План підписки *
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <div
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    watch("plan") === 'mini'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setValue('plan', 'mini')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      watch("plan") === 'mini' ? 'border-green-500 bg-green-500' : 'border-slate-300'
                    }`}>
                      {watch("plan") === 'mini' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className={`font-semibold ${watch("plan") === 'mini' ? 'text-green-900' : 'text-slate-700'}`}>
                        Mini
                      </p>
                      <p className={`text-sm ${watch("plan") === 'mini' ? 'text-green-700' : 'text-slate-500'}`}>
                        300 ₴/міс
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    watch("plan") === 'maxi'
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setValue('plan', 'maxi')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      watch("plan") === 'maxi' ? 'border-yellow-500 bg-yellow-500' : 'border-slate-300'
                    }`}>
                      {watch("plan") === 'maxi' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className={`font-semibold ${watch("plan") === 'maxi' ? 'text-yellow-900' : 'text-slate-700'}`}>
                        Maxi
                      </p>
                      <p className={`text-sm ${watch("plan") === 'maxi' ? 'text-yellow-700' : 'text-slate-500'}`}>
                        500 ₴/міс
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <input type="hidden" {...register('plan')} />
            </div>

            {/* Способ оплаты */}
            <div>
              <label htmlFor="payment" className="block text-sm font-medium text-slate-700 mb-2">
                Спосіб оплати *
              </label>
              <select
                {...register("payment")}
                id="payment"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option>Онлайн оплата</option>
                <option>Переказ на карту</option>
                <option>Готівка при отриманні</option>
              </select>
              {errors.payment && (
                <p className="mt-1 text-sm text-red-600">{errors.payment.message}</p>
              )}
            </div>

            {/* Информация для перевода */}
            {payment === "Переказ на карту" && (
              <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Інформація для переказу
                </h3>
                
                <div className="space-y-4">
                  {/* Номер карты */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-200">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">Номер карти:</p>
                      <p className="text-xl font-bold text-blue-600 tracking-wider">4441 1144 4444 4444</p>
                    </div>
                  </div>

                  {/* Получатель */}
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-sm font-medium text-slate-600 mb-1">Отримувач:</p>
                    <p className="text-lg font-semibold text-slate-900">СТЕФА КНИГИ</p>
                  </div>

                  {/* Банк */}
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-sm font-medium text-slate-600 mb-1">Банк:</p>
                    <p className="text-lg font-semibold text-slate-900">Монобанк</p>
                  </div>
                </div>

                {/* Важная информация */}
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-2">Важливо:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Зробіть переказ на вказану карту</li>
                        <li>Зробіть скріншот підтвердження оплати</li>
                        <li>Завантажте скріншот у формі нижче</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Скриншот для перевода на карту */}
            {payment === "Переказ на карту" && (
              <div>
                <label htmlFor="screenshot" className="block text-sm font-medium text-slate-700 mb-2">
                  Скріншот оплати *
                </label>
                <input
                  {...register("screenshot", {
                    required: payment === "Переказ на карту" ? "Скріншот оплати обов'язковий" : false
                  })}
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
                <p className="mt-1 text-sm text-slate-500">
                  Завантажте скріншот підтвердження переказу (JPG, PNG до 10MB)
                </p>
                {errors.screenshot && (
                  <p className="mt-1 text-sm text-red-600">{errors.screenshot.message}</p>
                )}
              </div>
            )}

            {/* Комментарий */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-2">
                Додаткова інформація
              </label>
              <textarea
                {...register("note")}
                id="note"
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ваші побажання або питання..."
              />
            </div>

            {/* Кнопка отправки */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-400 text-slate-900 py-4 px-6 rounded-2xl text-lg font-semibold transition-colors"
            >
              {isSubmitting ? 'Відправляємо...' : 'Оформити підписку'}
            </Button>
          </form>
        </div>
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