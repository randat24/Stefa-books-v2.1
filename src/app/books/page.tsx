import { Suspense } from 'react';
import { SimpleSearch } from '@/components/search/SimpleSearch';
import { Loader2 } from 'lucide-react';

function BooksPageFallback() {
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-600" />
        <p className="text-slate-600">Завантаження каталогу книг...</p>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Каталог книг
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Оберіть потрібну книгу з нашого каталогу дитячих книг. 
            Використовуйте пошук та фільтри для швидкого знаходження.
          </p>
        </div>
        
        <Suspense fallback={<BooksPageFallback />}>
          <SimpleSearch />
        </Suspense>
      </div>
    </div>
  );
}