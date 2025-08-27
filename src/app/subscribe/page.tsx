'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

type SubscribeFormData = {
  name: string;
  email: string;
  phone: string;
  plan?: 'mini' | 'maxi';
  message?: string;
};

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<'mini' | 'maxi' | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SubscribeFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      plan: undefined,
      message: '',
    },
  });

  // Читаем выбранный план из sessionStorage
  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('selected_plan') : null;
    if (saved === 'mini' || saved === 'maxi') {
      setSelectedPlan(saved);
      setValue('plan', saved);
      // Очищаем sessionStorage после использования
      try {
        sessionStorage.removeItem('selected_plan');
      } catch {}
    }
  }, [setValue]);

  const onSubmit = async (data: SubscribeFormData) => {
    console.log('Form data:', data);
    // Здесь будет логика отправки формы
    alert('Дякуємо за заявку! Ми зв\'яжемося з вами найближчим часом.');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Заявка на підписку
          </h1>
          <p className="text-xl text-slate-600">
            Заповніть форму і ми зв&apos;яжемося з вами для оформлення підписки
          </p>
        </div>

        <form id="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Выбранный план */}
          {mounted && selectedPlan && (
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Обраний план:</p>
              <p className="text-lg font-semibold text-slate-900 capitalize">
                {selectedPlan === 'mini' ? 'Mini (1 книга за раз)' : 'Maxi (2 книги за раз)'}
              </p>
            </div>
          )}

          {/* Имя */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Ім&apos;я *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ваше ім&apos;я"
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
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="your@email.com"
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
              {...register('phone')}
              type="tel"
              id="phone"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="+380 XX XXX XX XX"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* План (скрытое поле) */}
          <input type="hidden" {...register('plan')} />

          {/* Сообщение */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
              Додаткова інформація
            </label>
            <textarea
              {...register('message')}
              id="message"
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ваші побажання або питання..."
            />
          </div>

          {/* Кнопка отправки */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-xl text-lg font-semibold"
          >
            {isSubmitting ? 'Відправляємо...' : 'Відправити заявку'}
          </Button>
        </form>
      </div>
    </div>
  );
}
