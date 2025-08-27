"use client";
import { Clock, Mail, Instagram, Phone, ExternalLink } from "lucide-react";

export default function ContactLocation() {
  return (
    <section id="pickup-location" className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-gradient-to-b from-slate-50 to-white py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Точка видачі книг
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Забирайте книги в зручному місці в центрі Миколаєва. Працюємо для вашої зручності щодня.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Карта */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2719.8234567890123!2d31.9946!3d46.9658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c5c16a12345678%3A0x1234567890abcdef!2z0LLRg9C7LiDQnNCw0YDRltGD0L_QvtC70YzRgdGM0LrQsCwgMTMvMiwg0JzQuNC60L7Qu9Cw0ZfQsiwg0KPQutGA0LDRl9C90LA!5e0!3m2!1suk!2sua!4v1234567890123!5m2!1suk!2sua"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-slate-900">вул. Маріупольська 13/2</p>
                    <p className="text-sm text-slate-600">Миколаїв, Україна</p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=вул.+Маріупольська+13/2,+Миколаїв"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-900 rounded-full hover:bg-yellow-400 transition-colors font-semibold shadow-md hover:shadow-lg"
                  >
                    <ExternalLink className="size-4" />
                    Відкрити в картах
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Информация */}
          <div>
            <div className="space-y-6">
              {/* Время работы */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="size-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Години роботи</h3>
                </div>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Пн-Пт:</span>
                    <span className="font-medium">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Субота:</span>
                    <span className="font-medium">10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Неділя:</span>
                    <span className="font-medium text-red-500">вихідний</span>
                  </div>
                </div>
              </div>

              {/* Контакты */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Контакти</h3>
                <div className="space-y-4">
                  <a 
                    href="tel:+380501234567" 
                    className="flex items-center gap-3 p-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Phone className="size-4 text-slate-600" />
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900">+38 (050) 123-45-67</span>
                  </a>
                  
                  <a 
                    href="mailto:info@stefa.books" 
                    className="flex items-center gap-3 p-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Mail className="size-4 text-slate-600" />
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900">info@stefa.books</span>
                  </a>
                  
                  <a 
                    href="https://instagram.com/stefa.books" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Instagram className="size-4 text-slate-600" />
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900">@stefa.books</span>
                  </a>
                </div>
              </div>

              {/* Важная информация */}
              <div className="card p-6 bg-yellow-50 border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <div className="w-5 h-5 bg-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-yellow-800 text-xs">!</span>
                  </div>
                  Важливо знати
                </h4>
                <ul className="text-sm text-yellow-900 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Попередньо зателефонуйте перед візитом</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>При собі мати документ, що посвідчує особу</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Книги видаються згідно з оформленою заявкою</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}