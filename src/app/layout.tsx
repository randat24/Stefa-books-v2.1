import "./globals.css";
import "./styles.css";
import "./basic-styles.css";
import "/public/output.css";
import Providers from "@/components/Providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { ClientLayoutWrapper } from "@/components/layouts/ClientLayoutWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white text-slate-900" suppressHydrationWarning>
        <ErrorBoundary>
          <Providers>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
