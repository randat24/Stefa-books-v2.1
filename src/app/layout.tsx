import "./globals.css";
import Providers from "@/components/Providers";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { ErrorBoundary } from "@/components/error-boundary";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <ErrorBoundary>
          <Providers>
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
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
