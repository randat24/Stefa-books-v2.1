import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { emailService } from '@/lib/email';

interface SubscriptionData {
  name: string;
  email: string;
  phone: string;
  social?: string;
  plan: string;
  paymentMethod: string;
  message?: string;
  screenshot?: string;
  privacyConsent: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: SubscriptionData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'plan', 'paymentMethod', 'privacyConsent'];
    const missingFields = requiredFields.filter(field => !data[field as keyof SubscriptionData]);
    
    if (missingFields.length > 0) {
      logger.warn('Subscription form validation failed', { missingFields, data: { plan: data.plan, paymentMethod: data.paymentMethod } });
      return NextResponse.json(
        { error: 'Відсутні обов\'язкові поля', missingFields },
        { status: 400 }
      );
    }

    // Validate Ukrainian phone number
    const phoneRegex = /^\+380\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
      logger.warn('Invalid phone number format in subscription', { phone: data.phone });
      return NextResponse.json(
        { error: 'Неправильний формат телефону' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      logger.warn('Invalid email format in subscription', { email: data.email });
      return NextResponse.json(
        { error: 'Неправильний формат електронної пошти' },
        { status: 400 }
      );
    }

    // Generate unique submission ID
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    // Log successful submission (without sensitive data)
    logger.info('Subscription form submitted successfully', {
      submissionId,
      plan: data.plan,
      paymentMethod: data.paymentMethod,
      hasScreenshot: !!data.screenshot,
      timestamp: new Date().toISOString()
    });

    // Send email notifications
    await emailService.sendSubscriptionNotification({
      submissionId,
      customerData: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        plan: data.plan,
        paymentMethod: data.paymentMethod
      },
      hasScreenshot: !!data.screenshot
    });
    
    // Here you would typically:
    // 1. Save to database (Supabase, PostgreSQL, etc.)
    // 2. Process screenshot upload to cloud storage
    // 3. Create customer record
    return NextResponse.json({ 
      success: true, 
      submissionId,
      message: 'Заявку успішно надіслано! Ми зв\'яжемося з вами найближчим часом.'
    });

  } catch (error) {
    logger.error('Subscription API error', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Subscription API endpoint' },
    { status: 200 }
  );
}