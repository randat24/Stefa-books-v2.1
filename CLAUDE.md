# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server at http://localhost:3000 (preferred)
- `npm run dev` - Alternative using npm
- `pnpm build` - Build production bundle
- `pnpm lint` - Run ESLint for code quality checks

### Installation
- `pnpm install` - Install dependencies (preferred package manager)
- `npm install` - Alternative using npm

## Architecture Overview

### Tech Stack
- **Next.js 14** with App Router (TypeScript)
- **React 18** with client-side state management
- **Tailwind CSS** with custom design system and CSS variables
- **Zustand** for lightweight state management
- **React Hook Form + Zod** for form validation
- **React Query** for data fetching and caching
- **Lucide React** for consistent iconography
- **Framer Motion** installed but not actively used (only CSS transitions)

### Project Structure
The application follows Next.js App Router conventions with a component-based architecture:

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout with Header/Footer
│   ├── page.tsx         # Homepage with section composition
│   ├── books/           # Book catalog with filters
│   │   └── page.tsx     # Suspense-wrapped catalog with SimpleSearch
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
│   ├── sections/        # Page sections (FAQ, ContactLocation, SocialProof)
│   ├── hero/            # Hero section with steps card
│   ├── layouts/         # Header and navigation
│   ├── subscribe/       # Subscription forms
│   └── widgets/         # PlansLite component
├── lib/                 # Core utilities and data
│   ├── types.ts         # TypeScript definitions
│   ├── mock.ts          # Book data with real Ukrainian children's books
│   ├── store.ts         # Zustand state management (filters)
│   └── cn.ts            # Tailwind class merging
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

### Development Notes

**Package Manager**: Project preferentially uses pnpm but supports npm fallback.

**TypeScript**: Strict typing throughout with custom type definitions in `src/lib/types.ts`.

**Form Handling**: Complex subscription form with Ukrainian phone validation, file uploads, and conditional payment method display.

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