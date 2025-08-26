import "./globals.css";
import Providers from "@/components/Providers";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <Providers>
          {/* Шапка (внутри full-bleed секции, но контент — в контейнере) */}
          <Header />

          {/* Основной контент: ограничен контейнером */}
          <main className="flex-1">
            <div className="container">{children}</div>
          </main>

          {/* Футер: секция на всю ширину, внутри — контейнер с колонками */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
