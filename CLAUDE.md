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
- **Tailwind CSS** with fluid typography and modern design system
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
│   └── plans/           # Subscription plans
├── components/          # React components
│   ├── ui/              # Reusable UI components (Button, Badge)
│   ├── sections/        # Page sections (FAQ, ContactLocation, SocialProof)
│   ├── hero/            # Hero section with steps card
│   ├── layouts/         # Header and navigation
│   └── subscribe/       # Subscription forms
├── lib/                 # Core utilities and data
│   ├── types.ts         # TypeScript definitions
│   ├── mock.ts          # Book data with real Ukrainian children's books
│   └── cn.ts            # Tailwind class merging
```

### Design System and Styling

**Fluid Typography System**: Modern clamp()-based typography that scales automatically:
- Font scale: `--font-size-xs` through `--font-size-6xl` using `clamp(min, preferred, max)`
- Example: `--font-size-base: clamp(1rem, 0.9rem + 0.3vw, 1.125rem)` (16-18px)
- All sizes scale naturally across viewport widths without media queries

**Design Token Architecture**: Comprehensive CSS variable system in `globals.css`:
- **Typography**: Fluid font sizes, line heights, and letter spacing
- **Spacing**: 8px-based scale (`--space-1` to `--space-32`) using rem units
- **Colors**: Semantic tokens (`--brand`, `--accent`, `--text-muted`)
- **Layout**: Section padding (`--section-padding`) with fluid scaling
- **Content width**: Typography-optimized `--content-width: 72ch`

**Container Queries**: Components use container queries for true component-level responsiveness:
- `.card-grid` and `.book-grid` adapt based on container width
- `@container (min-width: 480px)` → 2 columns
- `@container (min-width: 768px)` → 3 columns

**Yellow Accent Color**: Primary accent (`yellow-500`) used for CTA buttons and focus states.

**Typography Standards**:
- Never use px values except for borders (1px) and shadows
- All spacing uses CSS custom properties with rem/em units
- Buttons use `padding: 0.75em 1.5em` to scale with font size
- Icons sized in em units (`1.2em`) to scale with parent text

**Utility Classes**: Pre-built components for consistency:
- `.section`, `.container`, `.text-content` for layout
- `.btn-primary`, `.btn-outline`, `.btn-ghost` for actions
- `.card`, `.input` with built-in design tokens
- `.p-fluid`, `.gap-fluid` for responsive spacing

### Component Architecture Patterns

**Page Composition**: Homepage (`src/app/page.tsx`) demonstrates section-based composition:
- Hero → Steps → Catalog → Plans → Categories → Subscribe → FAQ → SocialProof → ContactLocation → FinalCTA

**State Management Strategy**:
- **Global filters**: Zustand store (`src/lib/store.ts`) for search/filter state
- **Favorites**: Separate Zustand store (`src/lib/favorites.ts`) with localStorage persistence
- **Form state**: React Hook Form + Zod validation for complex forms
- **Local UI state**: Component-level useState for interactions

**Book Data Model** (`src/lib/types.ts`):
- Core properties: `id`, `title`, `author`, `category`, `available`
- Rich metadata: `status`, `badges`, `rating`, `price`
- Ukrainian content structure with pricing in hryvnia (₴)

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

### External Integration Points
**Google Maps**: ContactLocation section includes embedded map for pickup address (вул. Маріупольська 13/2, Миколаїв).

**Image Optimization**: Next.js Image component configured for Unsplash remote patterns in `next.config.js`.

### Development Notes

**Package Manager**: Project preferentially uses pnpm but supports npm fallback.

**TypeScript**: Strict typing throughout with custom type definitions in `src/lib/types.ts`.

**Form Handling**: Complex subscription form with Ukrainian phone validation, file uploads, and conditional payment method display.

**Styling Guidelines**:
- Use design tokens from CSS custom properties (`var(--space-4)`, `var(--font-size-lg)`)
- Prefer utility classes (`.section`, `.btn-primary`) over custom CSS when available
- Never use fixed px values for typography or spacing (use rem/em via design tokens)
- Use container queries for component-level responsive design
- Apply semantic HTML with proper accessibility attributes

**Component Organization**:
- `/sections/` - Full-width page sections (Hero, FAQ, ContactLocation)
- `/ui/` - Reusable UI primitives (Button, Badge, Input)
- `/hero/` and `/subscribe/` - Feature-specific component groups
- `/layouts/` - Header, Footer, and layout components