'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center text-sm text-slate-600 ${className}`} aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
        aria-label="Головна сторінка"
      >
        <Home className="h-4 w-4" />
        <span>Головна</span>
      </Link>
      
      {items.map((item, index) => (
        <Fragment key={index}>
          <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
          {item.href && index < items.length - 1 ? (
            <Link 
              href={item.href}
              className="hover:text-slate-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}