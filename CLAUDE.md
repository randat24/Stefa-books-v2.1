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
│   ├── plans/           # Subscription plans
│   ├── subscribe/       # Subscription form page
│   ├── privacy/         # Privacy Policy (Ukrainian legal compliance)
│   └── terms/           # Terms of Use (Ukrainian law)
├── components/          # React components
│   ├── ui/              # Reusable UI components (Button, Badge)
│   ├── sections/        # Page sections (FAQ, ContactLocation, SocialProof)
│   ├── hero/            # Hero section with steps card
│   ├── layouts/         # Header and navigation
│   ├── subscribe/       # Subscription forms
│   └── widgets/         # PlansLite component
├── lib/                 # Core utilities and data
│   ├── types.ts         # TypeScript definitions
│   ├── mock.ts          # Book data with real Ukrainian children's books
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
- Global filters via Zustand (`src/lib/store.ts`)
- Form state via React Hook Form + Zod validation
- Local component state for UI interactions

**Icon System**: Exclusively uses Lucide React for consistency (no mixed icon sources or emojis).

### Data and Content
**Mock Data Structure**: Uses realistic Ukrainian children's book data (`src/lib/mock.ts`) with:
- Unsplash images for book covers
- Ukrainian titles, authors, and categories  
- Pricing in Ukrainian hryvnia (₴)

**Language**: Ukrainian interface throughout (`lang="uk"` in layout).

### Navigation and User Flow
**Header Navigation**: Includes quick access buttons:
- Головна, Каталог, Тарифи, Підписка (with yellow accent)

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
- **Legal Entity**: ФОП Власенко Стефанія Валентинівна (РНОКПП: 1234567890)

**Google Maps**: ContactLocation section includes embedded map for pickup address.

**Cloudinary Integration**: Used for screenshot uploads when users select "Переказ на карту" payment method.

**Image Optimization**: Next.js Image component configured for local book images in `/public/images/books/`.

### Development Notes

**Package Manager**: Project preferentially uses pnpm but supports npm fallback.

**TypeScript**: Strict typing throughout with custom type definitions in `src/lib/types.ts`.

**Form Handling**: Complex subscription form with Ukrainian phone validation, file uploads, and conditional payment method display.

**Cache Management & Style Issues**: 

When styles break or site behaves strangely, follow this escalating procedure:

```bash
# Level 1: Quick cache clear
rm -rf .next && pnpm dev

# Level 2: Full cache + dependencies reset  
rm -rf .next node_modules/.cache && pnpm install && pnpm dev

# Level 3: Nuclear option (CSS not generating)
rm -rf .next .swc node_modules && pnpm install && pnpm dev

# Level 4: Check if Tailwind compiles manually
pnpm tailwindcss -i src/app/globals.css -o test-output.css
```

**Common symptoms requiring cache clear:**
- CSS not loading (404 errors for static/css files)
- Styles suddenly disappear
- Components not rendering properly
- Build manifest conflicts
- Hydration errors

**Prevention:** Always use consistent package manager (pnpm preferred) and clear cache when switching between build/dev modes.