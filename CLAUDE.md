# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server at http://localhost:3000 (preferred)
- `npm run dev` - Alternative using npm
- `pnpm build` - Build production bundle
- `pnpm lint` - Run ESLint for code quality checks
- `pnpm lint:fix` - Run ESLint with automatic fixes
- `pnpm type-check` - Run TypeScript type checking without emitting files
- `pnpm check-styles` - Verify CSS generation and styling integrity
- `pnpm fix-styles` - Fix common CSS and styling issues
- `pnpm clean` - Clean all build artifacts, cache, and reports

### Testing
- `pnpm test` - Run all Jest unit and integration tests
- `pnpm test:watch` - Run Jest in watch mode for development
- `pnpm test:coverage` - Run tests with coverage report (70% threshold)
- `pnpm test:performance` - Run performance-specific tests
- `pnpm test:e2e` - Run Playwright end-to-end tests
- `pnpm test:e2e:ui` - Run E2E tests with Playwright UI
- `pnpm test:e2e:headed` - Run E2E tests in headed mode
- `pnpm test:all` - Run both unit and E2E tests

### Performance Analysis
- `pnpm analyze:performance` - Run comprehensive performance analysis
- `pnpm analyze:bundle` - Analyze bundle size with detailed breakdown

### Database Management
- `node scripts/seed-books.js` - Load catalog books into Supabase database
- `node scripts/fix-image-urls.js` - Fix book image URL format in database
- Access admin panel at http://localhost:3000/admin (development only)

### Installation
- `pnpm install` - Install dependencies (preferred package manager)
- `npm install` - Alternative using npm

## Architecture Overview

### Tech Stack
- **Next.js 15.5.2** with App Router (TypeScript) and performance optimizations
- **React 19.1.1** with client-side state management and modern features
- **Supabase 2.56.0** PostgreSQL database with Row Level Security (RLS)
- **Tailwind CSS 3.4.10** with custom design system and CSS variables
- **Zustand 5.0.8** for lightweight state management
- **React Hook Form 7.53.0 + Zod 3.23.8** for form validation
- **React Query 5.59.0** for data fetching and caching
- **Lucide React 0.441.0** for consistent iconography
- **Radix UI** components for dialogs, selects, tabs, and other primitives
- **Cloudinary 2.7.0** for image upload and optimization
- **Framer Motion 12.23.12** installed but not actively used (only CSS transitions)

### Testing Infrastructure
- **Jest + React Testing Library** for unit and integration tests
- **Playwright** for end-to-end testing across Chrome, Firefox, Safari
- **Error Boundaries** with comprehensive fallback UIs
- **Coverage thresholds** set at 70% for branches, functions, lines, statements
- **Test environments**: jsdom for components, node for API endpoints

### Project Structure
The application follows Next.js App Router conventions with a component-based architecture:

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout with Header/Footer
│   ├── page.tsx         # Homepage with section composition
│   ├── books/           # Book catalog with filters
│   │   └── page.tsx     # Suspense-wrapped catalog with SimpleSearch
│   ├── admin/           # Admin panel with database management
│   │   ├── layout.tsx   # Force dynamic rendering for admin routes
│   │   ├── page.tsx     # Admin dashboard with statistics and books table
│   │   ├── actions.ts   # Server Actions for CRUD operations
│   │   ├── data.ts      # Database queries and data fetching
│   │   └── components/  # Admin-specific components
│   ├── plans/           # Subscription plans
│   ├── subscribe/       # Subscription form page
│   ├── privacy/         # Privacy Policy (Ukrainian legal compliance)
│   └── terms/           # Terms of Use (Ukrainian law)
├── components/          # React components
│   ├── ui/              # Reusable UI components (Button, Badge)
│   ├── search/          # Search system components
│   │   ├── HeaderSearch.tsx    # Modal search overlay (light theme)
│   │   ├── SimpleSearch.tsx    # Main catalog search with filters
│   │   └── SearchProvider.tsx  # Context provider (legacy)
│   ├── filters/         # Filter system
│   │   └── FilterPopup.tsx     # Catalog-style filter popup
│   ├── catalog/         # Catalog components
│   │   └── CatalogPopup.tsx    # Category browser popup
│   ├── error-boundary/  # Error handling components
│   │   ├── ErrorBoundary.tsx      # Main error boundary with fallback UI
│   │   ├── SearchErrorBoundary.tsx # Search-specific error handling
│   │   └── FormErrorBoundary.tsx   # Form-specific error handling
│   ├── sections/        # Page sections (FAQ, ContactLocation, SocialProof)
│   ├── hero/            # Hero section with steps card
│   ├── layouts/         # Header and navigation
│   ├── subscribe/       # Subscription forms
│   └── widgets/         # PlansLite component
├── lib/                 # Core utilities and data
│   ├── api/             # Client-side API utilities
│   │   └── books.ts     # Books API with caching integration
│   ├── search/          # Advanced search system
│   │   ├── fuzzySearch.ts     # Typo-tolerant search
│   │   ├── semanticSearch.ts  # Content-based similarity
│   │   ├── analytics.ts       # Search behavior tracking
│   │   └── autocomplete.ts    # ML-powered suggestions
│   ├── types.ts         # TypeScript definitions
│   ├── types/admin.ts   # Admin panel type definitions
│   ├── mock.ts          # Book data with real Ukrainian children's books
│   ├── supabase.ts      # Supabase client and database types
│   ├── database.types.ts # Auto-generated Supabase types
│   ├── store.ts         # Zustand state management (filters)
│   ├── recentViews.ts   # Recent book views utility with localStorage
│   ├── cache.ts         # Multi-layer API caching system
│   ├── logger.ts        # Structured logging utility
│   ├── serviceWorker.ts # Service Worker registration and management
│   └── cn.ts            # Tailwind class merging
├── __tests__/           # Unit and integration tests
│   ├── components/      # Component tests (Button, Badge, etc.)
│   └── lib/             # Utility function tests
├── tests/               # E2E tests
│   └── e2e/             # Playwright test files
├── scripts/             # Database and maintenance scripts
│   ├── seed-books.js    # Load catalog books into database
│   ├── fix-image-urls.js # Fix book image URLs
│   └── check-styles.sh  # Style verification script
├── supabase/            # Database schema and migrations
│   └── setup_database.sql # Complete database schema
├── public/              # Static assets
│   ├── sw.js            # Service Worker for offline functionality
│   ├── logo.svg         # Application logo
│   └── images/          # Book covers and placeholder images
└── middleware.ts        # Next.js middleware for admin routes
```

### Design System and Styling
**CSS Variables Architecture**: The project uses a comprehensive CSS variable system defined in `globals.css`:
- Semantic color tokens (`--brand`, `--accent`, `--text-muted`)
- Consistent spacing and radius variables
- Shadow system for elevation

**Yellow Accent Color**: Primary accent is yellow (`yellow-500`) used for:
- CTA buttons (subscription, primary actions)
- Important notifications and badges
- Hover states and focus indicators

**Button Consistency**: All buttons use `rounded-full` styling for visual unity.

**Tailwind Configuration**: Extended with custom design tokens, typography system, and Tailwind plugins (@tailwindcss/typography, @tailwindcss/forms).

### Component Architecture Patterns

**Page Composition**: Homepage (`src/app/page.tsx`) demonstrates section-based composition:
- Hero → Steps → Catalog → Plans → Categories → Subscribe → FAQ → SocialProof → ContactLocation → FinalCTA

**State Management Strategy**:
- Global filters via Zustand (`src/lib/store.ts`) - simple q/category/availability filters
- Form state via React Hook Form + Zod validation
- Local component state for UI interactions (search modals, popups)
- URL-based state for search queries and category filters

**Icon System**: Exclusively uses Lucide React for consistency (no mixed icon sources or emojis).

### Data and Content
**Mock Data Structure**: Uses realistic Ukrainian children's book data (`src/lib/mock.ts`) with:
- Unsplash images for book covers
- Ukrainian titles, authors, and categories  
- Pricing in Ukrainian hryvnia (₴)

**Language**: Ukrainian interface throughout (`lang="uk"` in layout).

### Navigation and User Flow
**Header Navigation**: Modern navigation with integrated search functionality:
- Search button opens modal search overlay with live results
- Головна (Home) → root page
- Каталог (Catalog) → direct link to /books page  
- Підписка (Subscription) with yellow accent CTA button

**Search System Architecture**:
- **HeaderSearch**: Modal overlay with live search, categorized results (Books, Categories, Authors)
- **SimpleSearch**: Main catalog page search with URL parameter integration  
- **FilterPopup**: Comprehensive category browser similar to catalog structure
- All search components integrate via URL parameters for seamless navigation

**Interactive Steps Card**: 4-step process linking to different page sections:
1. Choose plan → #plans
2. Browse catalog → /books
3. Fill subscription form → #subscribe  
4. Pickup location → #pickup-location

### Business Context and External Integration Points
**Ukrainian Book Rental Service**: Stefa.books is a subscription-based book rental service operating in Mykolaiv, Ukraine:
- **Target Market**: Ukrainian families with children
- **Business Model**: Monthly subscriptions (Mini 300₴, Maxi 500₴, Premium 2500₴/6mo)  
- **Fulfillment**: Self-pickup only from partnering café at вул. Маріупольська 13/2, Миколаїв
- **Payment Methods**: Monobank card transfer or online payment
- **Legal Entity**: Федорова Анастасія Віталіївна (РНОКПП: 1234567890)

**Google Maps**: ContactLocation section includes embedded map for pickup address.

**Cloudinary Integration**: Used for screenshot uploads when users select "Переказ на карту" payment method.

**Image Optimization**: Next.js Image component configured for local book images in `/public/images/books/`.

### Database Architecture

**Supabase Integration**: PostgreSQL database with comprehensive schema:
- **Books Table**: Complete book management with search vectors, ratings, availability tracking
- **Users Table**: Subscription and user management
- **Rentals Table**: Book lending tracking with overdue management  
- **Payments Table**: Transaction history and payment method tracking
- **Row Level Security (RLS)**: Configured for data protection

**Database Constraints**: Enforced status values for data integrity:
- Book status: `'available', 'issued', 'reserved', 'lost'`
- User status: `'active', 'inactive', 'suspended'`
- Rental status: `'active', 'overdue', 'returned', 'lost'`
- Payment status: `'pending', 'completed', 'failed', 'refunded'`

**Full-Text Search**: PostgreSQL tsvector with trigram matching for Ukrainian content.

### Admin Panel Architecture

**Server Actions Pattern**: Modern Next.js approach for database operations:
- `src/app/admin/actions.ts`: CRUD operations with Zod validation
- `src/app/admin/data.ts`: Database queries and statistics
- Force dynamic rendering to prevent static generation issues

**Admin Components**:
- **BooksTable**: Full CRUD with search, pagination, and inline editing
- **EditBookDialog**: Modal form with file upload and validation
- **AddBookDialog**: Book creation with cover upload to Cloudinary
- **Statistics Dashboard**: Real-time KPI metrics and business intelligence

**Security**: Development-only access via middleware, production requires JWT authentication.

### Development Notes

**Package Manager**: Project preferentially uses pnpm but supports npm fallback.

**TypeScript**: Strict typing throughout with custom type definitions in `src/lib/types.ts`.

**Form Handling**: Complex subscription form with Ukrainian phone validation, file uploads, and conditional payment method display.

**Error Handling**: Comprehensive error boundary system:
- **ErrorBoundary**: Main component with fallback UI and development error details
- **SearchErrorBoundary**: Specialized for search functionality failures
- **FormErrorBoundary**: Form-specific error handling with retry options
- **BookViewTracker**: Utility component for tracking book views with recent views persistence
- **useErrorBoundary** hook for functional components to trigger error boundaries

**Testing Strategy**:
- **Unit Tests**: Components (Button, Badge, BookCard) and utilities (logger, recentViews) 
- **Integration Tests**: Search functionality, form validation, API endpoints
- **E2E Tests**: Complete user journeys (homepage, search, navigation, accessibility)
- **Mock Strategy**: Browser APIs (localStorage, IntersectionObserver), Next.js modules

**Search System Implementation**: 
- **HeaderSearch**: Light theme modal with live search, categorized results (Books/Categories/Authors)
- **SimpleSearch**: Main catalog page component with URL parameter integration (`?search=` and `?category=`)
- **FilterPopup**: Comprehensive category browser triggered by filter button, mirrors catalog structure
- All components work together via URL state and navigation for seamless user experience

**Cache Management & Style Issues Prevention**: 

### Root Causes of Style Failures

**1. Next.js Version Conflicts**
- Problem: Global Next.js version conflicts with project version
- Solution: Use project-local Next.js (avoid global installs)
- Detection: Check `node_modules/.bin/next` version vs `package.json`

**2. CSS Generation Pipeline Breaks**
- Problem: Tailwind CSS not compiling or .next/static/css files missing
- Detection: Check if `_next/static/css/app/layout.css` returns 404
- Root cause: Next.js webpack can't generate CSS bundles

**3. Environment Variable Issues**
- Problem: Missing .env.local or environment variables causing build failures
- Critical variables: CLOUDINARY_* for image uploads
- Solution: Always have .env.local with required variables

**4. Cache Corruption**
- Problem: Stale .next, .swc, or node_modules cache
- Symptoms: Styles work then suddenly stop, build manifest errors

### Escalating Troubleshooting Procedure

```bash
# Level 1: Quick cache clear
rm -rf .next && pnpm dev

# Level 2: Full cache + dependencies reset  
rm -rf .next node_modules/.cache && pnpm install && pnpm dev

# Level 3: Nuclear option (CSS not generating)
rm -rf .next .swc node_modules && pnpm install && pnpm dev

# Level 4: Check if Tailwind compiles manually
pnpm tailwindcss -i src/app/globals.css -o test-output.css

# Level 5: Verify static files exist
ls -la .next/static/css/app/
curl -I http://localhost:3000/_next/static/css/app/layout.css
```

### Early Warning System

**Check these indicators before styles break:**

```bash
# 1. Verify CSS generation on each build
test -f .next/static/css/app/layout.css && echo "✅ CSS generated" || echo "❌ CSS missing"

# 2. Check Next.js version consistency  
npx next --version && grep '"next"' package.json

# 3. Monitor build manifest
cat .next/app-build-manifest.json | grep -q "static/css" && echo "✅ CSS in manifest" || echo "❌ No CSS in manifest"
```

**Common Symptoms:**
- CSS not loading (404 errors for static/css files)
- Styles suddenly disappear during development
- Components rendering without styling
- Build manifest missing CSS entries
- Hydration errors with styling mismatches
- Server restarts breaking CSS pipeline

**Prevention Rules:**
1. Always use pnpm (consistent package manager)
2. Never install Next.js globally if project has local version
3. Clear cache when switching between build/dev modes
4. Keep .env.local file with all required variables
5. Verify CSS generation after major dependency changes
6. Use Next.js 14.2.4 (stable version) instead of newer unstable versions

### Admin Panel Development Notes

**Critical Server Actions Issue**: Never use `revalidatePath()` in Server Actions within the admin panel - it causes "Invariant: static generation store missing" errors in Next.js 14. Instead:
- Use manual data refresh through component state
- Call `onRefresh()` callbacks after successful operations
- Rely on `force-dynamic` in admin layout to prevent static generation

**Database Status Constraints**: When updating book status, only use these values:
- `'available'` - Book is ready for rental
- `'issued'` - Book is currently rented out  
- `'reserved'` - Book is reserved for specific user
- `'lost'` - Book is missing/damaged

**Image URL Format**: All book cover URLs should use `/images/books/filename.ext` format (not `http://localhost:3001/images/books/`) for proper Next.js Image optimization.

**Admin Middleware (`src/middleware.ts`)**: 
- Development environment bypasses authentication for `/admin` routes
- Production requires valid JWT token in `admin_token` cookie matching `ADMIN_JWT_SECRET`
- Sets aggressive no-cache headers for admin routes to prevent static generation issues
- Protects both `/admin/:path*` and `/api/admin/:path*` routes

### API Architecture and Data Flow

**Unified API System**: The application uses a dual-layer API approach combining client-side and server-side data fetching:

**Client-Side API (`src/lib/api/books.ts`)**:
- Handles server-side vs client-side URL resolution with `getBaseUrl()` and `buildApiUrl()`
- Provides typed response interfaces (`BooksResponse`, `BookResponse`, `CategoriesResponse`)
- Includes utility functions: `fetchPopularBooks()`, `fetchNewBooks()`, `searchBooks()`, `fetchBooksByCategory()`
- Implements proper error handling with success/error response patterns

**Server-Side API Routes (`src/app/api/books/route.ts`)**:
- GET endpoint for fetching books with filtering (category, search, limit, availability)
- POST endpoint for fetching categories
- Individual book endpoint at `/api/books/[id]` with proper 404 handling
- Supabase integration with full-text search using `ilike` pattern matching
- Structured logging with context-aware logger utility

**Critical Type Safety**: All components must import `Book` type from `@/lib/supabase` (not `@/lib/types`) to ensure compatibility with database schema. The Supabase types are auto-generated from the database schema.

**Image Handling Pattern**: Book covers use `book.cover_url` field with fallback to placeholder:
```tsx
<Image src={book.cover_url || '/images/book-placeholder.svg'} />
```

**Search Integration**: Advanced search system with multiple engines in `src/lib/search/`:
- **FuzzySearchEngine**: Typo-tolerant search with correction suggestions
- **SemanticSearchEngine**: Content-based similarity search
- **SearchAnalyticsEngine**: User behavior tracking and personalized suggestions
- **MLAutocompleteEngine**: Intelligent query completion
- **SearchProvider**: React context for managing search state across components

All search components integrate through URL parameters (`?search=` and `?category=`) for seamless navigation and bookmarking.

### Critical Development Patterns

**Component Type Import Pattern**: Always import the `Book` type from the correct source:
```tsx
// ✅ Correct - uses database-generated types
import type { Book } from '@/lib/supabase';

// ❌ Incorrect - uses outdated local types
import type { Book } from '@/lib/types';
```

**BookViewTracker Usage**: Updated to be more flexible with bookId and optional book object:
```tsx
// ✅ Correct - provides both bookId and book object when available
<BookViewTracker bookId={book.id} book={book} />

// ✅ Also acceptable - just bookId for basic tracking
<BookViewTracker bookId={bookId} />
```

**HeaderSearch Modal Architecture**: Uses high z-index and proper backdrop for full-screen coverage:
```tsx
// Fixed overlay structure with stronger blur and dimming
<div className="fixed inset-0 z-[9999]">
  <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={handleClose} />
  // Modal content
</div>
```

**API Error Handling Pattern**: Consistent response structure across all API routes:
```tsx
// Success response
return NextResponse.json({ success: true, data: books, count: books.length })

// Error response  
return NextResponse.json({ success: false, error: 'Error message' }, { status: 500 })
```

### Performance Optimizations

**Bundle Optimization**: The application implements comprehensive performance optimizations:

**Code Splitting**: Dynamic imports with React.lazy() for non-critical components:
```tsx
const PlansLite = lazy(() => import("@/components/widgets/PlansLite"));
const Categories = lazy(() => import("@/components/sections/Categories"));
// All lazy components wrapped with Suspense and loading states
<Suspense fallback={<div className="h-80 bg-slate-50 animate-pulse rounded-lg" />}>
  <PlansLite />
</Suspense>
```

**API Caching**: Multi-layer caching system (`src/lib/cache.ts`):
- In-memory cache with configurable TTL (Time To Live)
- Separate cache instances for different data types (books, categories, search)
- Automatic cache cleanup and invalidation
- Cache-first strategy for static data, network-first for dynamic content

**Image Optimization**: Enhanced Next.js image handling:
```tsx
<Image
  src={book.cover_url || '/images/book-placeholder.svg'}
  alt={book.title}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..." // Base64 placeholder
  sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 100vw"
/>
```

**Service Worker**: Offline-first PWA capabilities (`public/sw.js`):
- Static asset caching for offline functionality
- API response caching with network-first strategy
- Background sync for offline actions
- Update notifications for new versions
- Registration utility (`src/lib/serviceWorker.ts`)

**Production Optimizations**: Next.js configuration includes:
- Automatic console.log removal in production builds
- WebP/AVIF image format optimization
- Package import optimization for Lucide React and Radix UI
- Memory-based worker optimizations
- Aggressive security headers

### Environment Configuration

**Environment Variables**: Comprehensive environment setup with multiple configuration files:
- `.env.example` - Template with all required variables
- `.env.local.example` - Development configuration template  
- `.env.production` - Production environment template

**Critical Environment Variables**:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Security
ADMIN_JWT_SECRET=your-super-secret-admin-jwt-token
```

### Logging and Debugging

**Structured Logging**: Professional logging system (`src/lib/logger.ts`) replaces console statements:
```tsx
import { logger } from '@/lib/logger';

// Development vs production logging levels
logger.debug('Cache hit for key', { key, data }, 'Cache');
logger.info('API request successful', { count: books.length }, 'API');  
logger.error('Database connection failed', error, 'Database');
```

**Context-Based Logging**: Organized by functional areas (API, Cache, Search, Analytics, Admin) for better debugging and monitoring.