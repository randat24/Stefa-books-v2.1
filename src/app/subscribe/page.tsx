'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CreditCard, Building2, CheckCircle, Copy, Check } from 'lucide-react';

type PlanType = 'mini' | 'maxi' | 'premium';
type PaymentMethod = 'card' | 'online';

type SubscribeFormData = {
  name: string;
  email: string;
  phone: string;
  plan?: PlanType;
  paymentMethod?: PaymentMethod;
  message?: string;
};

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: string;
    period: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
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
      paymentMethod: undefined,
      message: '',
    },
  });

  // Читаем параметры плана из URL
  useEffect(() => {
    setMounted(true);
    const planName = searchParams.get('plan');
    const price = searchParams.get('price');
    const period = searchParams.get('period');
    
    if (planName && price && period) {
      setSelectedPlan({
        name: planName,
        price: price,
        period: decodeURIComponent(period)
      });
      setValue('plan', planName as PlanType);
    }
  }, [searchParams, setValue]);

  const getPlanDescription = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'mini':
        return 'Mini (1 книга за раз)';
      case 'maxi':
        return 'Maxi (2 книги за раз)';
      case 'premium':
        return 'Premium (2 книги за раз на 6 місяців)';
      default:
        return planName;
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const onSubmit = async (data: SubscribeFormData) => {
    const submitData = {
      ...data,
      paymentMethod,
      selectedPlan: selectedPlan ? {
        name: selectedPlan.name,
        price: selectedPlan.price,
        period: selectedPlan.period
      } : null
    };
    console.log('Form data:', submitData);
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

        <form id="form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Выбранный план */}
          {mounted && selectedPlan && (
            <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-slate-600">Обраний тариф:</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-slate-900 capitalize">
                  {getPlanDescription(selectedPlan.name)}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedPlan.price} {selectedPlan.period}
                </p>
              </div>
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

          {/* Способ оплаты */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-4">
              Спосіб оплати *
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => {
                  setPaymentMethod('card');
                  setValue('paymentMethod', 'card');
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <Building2 className={`h-6 w-6 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <p className={`font-semibold ${paymentMethod === 'card' ? 'text-blue-900' : 'text-slate-700'}`}>
                      Переказ на карту Monobank
                    </p>
                    <p className={`text-sm ${paymentMethod === 'card' ? 'text-blue-700' : 'text-slate-500'}`}>
                      Отримаєте реквізити для оплати
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => {
                  setPaymentMethod('online');
                  setValue('paymentMethod', 'online');
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'online' ? 'border-green-500 bg-green-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'online' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <CreditCard className={`h-6 w-6 ${paymentMethod === 'online' ? 'text-green-600' : 'text-slate-400'}`} />
                  <div>
                    <p className={`font-semibold ${paymentMethod === 'online' ? 'text-green-900' : 'text-slate-700'}`}>
                      Онлайн оплата
                    </p>
                    <p className={`text-sm ${paymentMethod === 'online' ? 'text-green-700' : 'text-slate-500'}`}>
                      Картою через інтернет
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Информация для перевода */}
          {mounted && paymentMethod === 'card' && (
            <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Інформація для переказу
                </h3>
              </div>

              <div className="space-y-4">
                {/* Номер карты */}
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">Номер карти:</p>
                    <p className="text-xl font-bold text-blue-600 tracking-wider">4441 1144 4444 4444</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('4441114444444444', 'card')}
                    className="ml-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {copiedField === 'card' ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-slate-400 hover:text-blue-600" />
                    )}
                  </button>
                </div>

                {/* Получатель */}
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">Отримувач:</p>
                    <p className="text-lg font-semibold text-slate-900">СТЕФА КНИГИ</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('СТЕФА КНИГИ', 'recipient')}
                    className="ml-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {copiedField === 'recipient' ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-slate-400 hover:text-blue-600" />
                    )}
                  </button>
                </div>

                {/* Банк */}
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">Банк:</p>
                    <p className="text-lg font-semibold text-slate-900">Монобанк</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('Монобанк', 'bank')}
                    className="ml-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {copiedField === 'bank' ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-slate-400 hover:text-blue-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Важная информация */}
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    <strong>Важливо:</strong> Після переказу збережіть чек і вкажіть його номер в коментарії. 
                    Це допоможе нам швидше обробити вашу заявку.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* План (скрытое поле) */}
          <input type="hidden" {...register('plan')} />
          <input type="hidden" {...register('paymentMethod')} />

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
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 py-4 px-6 rounded-2xl text-lg font-semibold transition-colors"
          >
            {isSubmitting ? 'Відправляємо...' : 'Оформити підписку'}
          </Button>
        </form>
      </div>
    </div>
  );
}
