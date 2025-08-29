"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RentalForm from "@/components/RentalForm";
import { convertGoogleDriveUrl, getBookPlaceholder } from "@/lib/utils/imageUtils";
import { BookOpen, MapPin, Clock, Phone, ArrowLeft } from "lucide-react";
import type { Book } from "@/lib/supabase";

// Данные точек самовывоза
const PICKUP_LOCATIONS = [
  {
    id: 1,
    name: "Головна точка самовивозу",
    address: "вул. Шевченка, 25, м. Київ",
    workingHours: "Пн-Пт: 9:00-18:00, Сб: 10:00-16:00",
    phone: "+380 95 123 45 67",
    description: "Центральна точка з найбільшим вибором книг"
  },
  {
    id: 2,
    name: "Точка самовивозу «Оболонь»",
    address: "пр. Оболонський, 15А, м. Київ",
    workingHours: "Пн-Сб: 10:00-19:00",
    phone: "+380 67 987 65 43",
    description: "Зручно розташована поруч з метро Оболонь"
  },
  {
    id: 3,
    name: "Точка самовивозу «Позняки»",
    address: "вул. Драгомирова, 7, м. Київ",
    workingHours: "Пн-Вс: 9:00-20:00",
    phone: "+380 93 456 78 90",
    description: "Працюємо без вихідних для вашої зручності"
  }
];

function RentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get("bookId");
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!bookId) {
      setError("ID книги не вказано");
      setLoading(false);
      return;
    }

    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}`);
        if (!response.ok) {
          throw new Error("Книга не знайдена");
        }
        const result = await response.json();
        if (result.success && result.data) {
          setBook(result.data);
        } else {
          throw new Error("Помилка завантаження даних книги");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Невідома помилка");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-sm">
            <BookOpen className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Помилка завантаження
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link 
              href="/books" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад до каталогу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageSrc = imageError || !book.cover_url ? getBookPlaceholder() : convertGoogleDriveUrl(book.cover_url);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with book info */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href={`/books/${book.id}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад до книги
            </Link>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
            {/* Book cover */}
            <div className="mx-auto lg:mx-0">
              <div className="aspect-[3/4] w-48 lg:w-full overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={imageSrc}
                  alt={`Обкладинка: ${book.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 192px, 200px"
                  onError={handleImageError}
                />
              </div>
            </div>

            {/* Book details */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600 mb-2">{book.author}</p>
              <p className="text-sm text-gray-500 mb-4">
                {book.category}{book.age_range ? ` • ${book.age_range}` : ""}
              </p>
              
              {book.short_description && (
                <p className="text-gray-700 leading-relaxed max-w-2xl">
                  {book.short_description}
                </p>
              )}

              {/* Availability status */}
              <div className="mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  book.available 
                    ? "text-green-700 bg-green-100" 
                    : "text-red-700 bg-red-100"
                }`}>
                  {book.available ? "✓ Доступна для оренди" : "✗ Усі екземпляри видані"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Main content - Rental form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Оформити оренду книги
            </h2>
            <RentalForm bookId={book.id} />
          </div>

          {/* Sidebar - Pickup locations */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Точки самовивозу
              </h3>
              <div className="space-y-4">
                {PICKUP_LOCATIONS.map((location) => (
                  <div key={location.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-semibold text-gray-900 mb-2">{location.name}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{location.address}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{location.workingHours}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{location.phone}</span>
                      </div>
                      <p className="text-gray-500 italic ml-6">
                        {location.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional info */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Як це працює?
              </h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 text-blue-900 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Заповніть форму оренди</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 text-blue-900 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Ми зв'яжемося для підтвердження</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 text-blue-900 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>Заберіть книгу у зручній точці</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    }>
      <RentPageContent />
    </Suspense>
  );
}