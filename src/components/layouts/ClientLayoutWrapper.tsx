'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import { BackToTop } from '@/components/ui/BackToTop';
import { ErrorBoundary } from '@/components/error-boundary';
import { registerServiceWorker, checkServiceWorkerUpdate } from '@/lib/serviceWorker';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isSubscribePage = pathname === '/subscribe';
  const isBooksPage = pathname === '/books';

  // Register service worker on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
      
      // Check for updates periodically
      const updateInterval = setInterval(checkServiceWorkerUpdate, 60000); // Every minute
      
      return () => clearInterval(updateInterval);
    }
  }, []);

  // Для админ-панели возвращаем только children без Header/Footer
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Для страниц подписок и книг возвращаем без container ограничений
  if (isSubscribePage || isBooksPage) {
    return (
      <>
        <ErrorBoundary fallback={
          <header className="bg-white shadow-sm">
            <div className="container py-4">
              <h1 className="text-xl font-bold">Stefa.books</h1>
            </div>
          </header>
        }>
          <Header />
        </ErrorBoundary>

        {/* Основной контент: БЕЗ ограничений контейнера */}
        <main className="flex-1">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>

        <ErrorBoundary fallback={
          <footer className="bg-gray-50 py-8">
            <div className="container text-center text-gray-500">
              <p>© 2025 Stefa.books</p>
            </div>
          </footer>
        }>
          <Footer />
        </ErrorBoundary>
        
        <BackToTop />
      </>
    );
  }

  // Для обычных страниц возвращаем полный layout с Header/Footer
  return (
    <>
      {/* Шапка (внутри full-bleed секции, но контент — в контейнере) */}
      <ErrorBoundary fallback={
        <header className="bg-white shadow-sm">
          <div className="container py-4">
            <h1 className="text-xl font-bold">Stefa.books</h1>
          </div>
        </header>
      }>
        <Header />
      </ErrorBoundary>

      {/* Основной контент: ограничен контейнером */}
      <main className="flex-1">
        <ErrorBoundary>
          <div className="container">{children}</div>
        </ErrorBoundary>
      </main>

      {/* Футер: секция на всю ширину, внутри — контейнер с колонками */}
      <ErrorBoundary fallback={
        <footer className="bg-gray-50 py-8">
          <div className="container text-center text-gray-500">
            <p>© 2025 Stefa.books</p>
          </div>
        </footer>
      }>
        <Footer />
      </ErrorBoundary>
      
      {/* Кнопка вверх */}
      <BackToTop />
    </>
  );
}