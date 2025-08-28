import "./globals.css";
import Providers from "@/components/Providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { ClientLayoutWrapper } from "@/components/layouts/ClientLayoutWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <ErrorBoundary>
          <Providers>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
