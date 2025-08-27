'use client';

import { useEffect, useState, Suspense } from 'react';
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
  social?: string;
  plan?: PlanType;
  paymentMethod?: PaymentMethod;
  message?: string;
  privacyConsent: boolean;
  screenshot?: FileList;
};

function SubscribeContent() {
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
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SubscribeFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '+380',
      plan: undefined,
      paymentMethod: undefined,
      message: '',
      privacyConsent: false,
    },
  });

  // Читаем параметры плана из URL
  useEffect(() => {
    setMounted(true);
    const planName = searchParams.get('plan');
    
    if (planName) {
      let planDetails = { name: planName, price: '', period: 'місяць' };
      
      // Определяем детали плана на основе названия
      switch (planName.toLowerCase()) {
        case 'mini':
          planDetails = { name: 'Mini', price: '300 грн', period: 'місяць' };
          break;
        case 'maxi':
          planDetails = { name: 'Maxi', price: '500 грн', period: 'місяць' };
          break;
        case 'premium':
          planDetails = { name: 'Premium', price: '800 грн', period: 'місяць' };
          break;
        default:
          planDetails = { name: planName, price: '300 грн', period: 'місяць' };
      }
      
      setSelectedPlan(planDetails);
      setValue('plan', planName as PlanType);
    }
  }, [searchParams, setValue]);

  const getPlanDescription = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'mini':
        return 'Mini';
      case 'maxi':
        return 'Maxi';
      case 'premium':
        return 'Premium';
      default:
        return planName;
    }
  };

  const getPlanDetails = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'mini':
        return '1 книга за раз, повертайте та беріть нову';
      case 'maxi':
        return '1-2 книги за раз, повертайте та беріть нові';
      case 'premium':
        return 'До 2 книг за раз на 6 місяців';
      default:
        return 'Деталі тарифу';
    }
  };

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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 mb-2">
            Заявка на підписку
          </h1>
          <p className="text-xl text-slate-600">
            Заповніть форму і ми зв&apos;яжемося з вами для оформлення підписки
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-6">
          <form id="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Выбранный план */}
          {mounted && selectedPlan && (
            <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-base font-semibold text-slate-600">Обраний тариф:</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold text-slate-900 capitalize mb-1">
                    {getPlanDescription(selectedPlan.name)}
                  </p>
                  <p className="text-base text-slate-700">
                    {getPlanDetails(selectedPlan.name)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedPlan.price}
                  </p>
                  <p className="text-sm text-blue-500">
                    {selectedPlan.period}
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* Компактные поля */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-slate-700 mb-2">
                Ім&apos;я *
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ваше ім&apos;я"
              />
              {errors.name && (
                <p className="mt-1 text-base text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-base font-semibold text-slate-700 mb-2">
                Телефон *
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                inputMode="tel"
                onChange={onPhoneInput}
                onBlur={() => trigger("phone")}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="+380 XX XXX XX XX"
              />
              {errors.phone && (
                <p className="mt-1 text-base text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-slate-700 mb-2">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-base text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="social" className="block text-base font-semibold text-slate-700 mb-2">
                Телеграм/Інстаграм
              </label>
              <input
                {...register('social')}
                type="text"
                id="social"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="@username або t.me/username"
              />
            </div>
          </div>

          {/* Способ оплаты */}
          <div>
            <label className="block text-base font-semibold text-slate-700 mb-2">
              Спосіб оплати *
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              <div
                className={`relative rounded-lg border-2 p-3 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : paymentMethod === null
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-200 opacity-60'
                }`}
                onClick={() => {
                  setPaymentMethod('card');
                  setValue('paymentMethod', 'card');
                }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <Building2 className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <p className={`font-semibold text-base ${paymentMethod === 'card' ? 'text-blue-900' : 'text-slate-700'}`}>
                      Переказ на карту Monobank
                    </p>
                    <p className={`text-xs ${paymentMethod === 'card' ? 'text-blue-700' : 'text-slate-500'}`}>
                      Отримаєте реквізити для оплати
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`relative rounded-lg border-2 p-3 cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-green-500 bg-green-50'
                    : paymentMethod === null
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-200 opacity-60'
                }`}
                onClick={() => {
                  setPaymentMethod('online');
                  setValue('paymentMethod', 'online');
                }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'online' ? 'border-green-500 bg-green-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'online' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <CreditCard className={`h-5 w-5 ${paymentMethod === 'online' ? 'text-green-600' : 'text-slate-400'}`} />
                  <div>
                    <p className={`font-semibold text-base ${paymentMethod === 'online' ? 'text-green-900' : 'text-slate-700'}`}>
                      Онлайн оплата
                    </p>
                    <p className={`text-xs ${paymentMethod === 'online' ? 'text-green-700' : 'text-slate-500'}`}>
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
              <div className="flex items-center gap-3 mb-2">
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
                    <p className="text-base font-semibold text-slate-600 mb-1">Номер карти:</p>
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
                    <p className="text-base font-semibold text-slate-600 mb-1">Отримувач:</p>
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
                    <p className="text-base font-semibold text-slate-600 mb-1">Банк:</p>
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
                  <p className="text-base text-yellow-800">
                    <strong>Важливо:</strong> Після переказу збережіть чек і вкажіть його номер в коментарії. 
                    Це допоможе нам швидше обробити вашу заявку.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Скриншот для перевода на карту */}
          {mounted && paymentMethod === 'card' && (
            <div>
              <label htmlFor="screenshot" className="block text-base font-semibold text-slate-700 mb-2">
                Скріншот оплати *
              </label>
              <input
                {...register("screenshot", {
                  required: paymentMethod === 'card' ? "Скріншот оплати обов'язковий" : false
                })}
                id="screenshot"
                type="file"
                accept="image/*"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              <p className="mt-1 text-base text-slate-500">
                Завантажте скріншот підтвердження переказу (JPG, PNG до 10MB)
              </p>
              {errors.screenshot && (
                <p className="mt-1 text-base text-red-600">{errors.screenshot.message}</p>
              )}
            </div>
          )}

          {/* План (скрытое поле) */}
          <input type="hidden" {...register('plan')} />
          <input type="hidden" {...register('paymentMethod')} />

          {/* Сообщение */}
          <div>
            <label htmlFor="message" className="block text-base font-semibold text-slate-700 mb-2">
              Додаткова інформація
            </label>
            <textarea
              {...register('message')}
              id="message"
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ваші побажання або питання..."
            />
          </div>

          {/* Согласие на обработку данных */}
          <div className="flex items-start gap-3">
            <input
              {...register('privacyConsent', {
                required: 'Необхідно підтвердити згоду на обробку даних'
              })}
              id="privacyConsent"
              type="checkbox"
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="privacyConsent" className="text-base text-slate-600">
              Я погоджуюся з обробкою моїх персональних даних відповідно до політики конфіденційності
              {errors.privacyConsent && (
                <span className="block text-xs text-red-600 mt-1">{errors.privacyConsent.message}</span>
              )}
            </label>
          </div>

          {/* Кнопка отправки */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 py-3 px-6 rounded-xl text-base font-semibold transition-colors"
          >
            {isSubmitting ? 'Відправляємо...' : 'Оформити підписку'}
          </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SubscribeContent />
    </Suspense>
  );
}
