# Stefa.Books — Modern Starter

A modern book rental service built with Next.js 15, React 18, and Tailwind CSS.

## Features

- 🏠 **Homepage** - Service overview and how it works
- 📚 **Live Catalog** - Searchable book catalog with filters
- 🎯 **Smart Search** - Search by title, author, or category
- 🔍 **Advanced Filters** - Category and availability filtering
- ❤️ **Favorites** - Save books to favorites (localStorage)
- 📝 **Rental Form** - Complete rental request form with validation
- 📱 **Responsive Design** - Mobile-first design approach
- 🎨 **Modern UI** - Beautiful cards, hover effects, and smooth animations

## Tech Stack

- **Framework**: Next.js 15.0.3
- **React**: 18.3.1
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── books/             # Books routes
│       ├── page.tsx       # Catalog page
│       └── [id]/          # Individual book
│           └── page.tsx   # Book detail page
├── components/             # React components
│   ├── ui/                # UI components
│   │   └── button.tsx     # Button component
│   ├── Header.tsx         # Site header
│   ├── Footer.tsx         # Site footer
│   ├── BookCard.tsx       # Book card component
│   ├── RentalForm.tsx     # Rental form
│   └── favorites/         # Favorites components
│       └── FavoriteButton.tsx
├── lib/                    # Utilities and stores
│   ├── cn.ts              # Class name utility
│   ├── types.ts           # TypeScript types
│   ├── mock.ts            # Mock data
│   ├── store.ts           # Zustand store
│   └── favorites.ts       # Favorites store
└── ...
```

## Key Components

### BookCard
- Hover effects with scale animation
- Quick action buttons (favorite, share, view)
- Badge system for trending/bestseller/discount
- Rating display with stars
- Availability status

### RentalForm
- Form validation with Zod schema
- React Hook Form integration
- Responsive grid layout
- Success state handling
- Ukrainian language support

### Search & Filters
- Real-time search across title, author, category
- Category dropdown filter
- Availability toggle
- Results counter
- Responsive toolbar layout

## Customization

### Colors
Edit `tailwind.config.ts` to customize the brand colors:

```typescript
colors: {
  brand: { 
    50: "#f5f3ff", 
    500: "#8b5cf6", 
    700: "#6d28d9" 
  }
}
```

### Mock Data
Add more books in `src/lib/mock.ts`:

```typescript
export const BOOKS: Book[] = [
  {
    id: "4",
    title: "Your Book Title",
    author: "Author Name",
    cover: "https://picsum.photos/seed/book4/600/800",
    category: "Category",
    available: true,
    // ... other properties
  }
];
```

## Deployment

### Build
```bash
pnpm build
```

### Start Production
```bash
pnpm start
```

## Next Steps

- [ ] Connect to Supabase backend
- [ ] Add user authentication
- [ ] Implement real payment processing
- [ ] Add admin panel for book management
- [ ] Integrate with external book APIs
- [ ] Add email notifications
- [ ] Implement real-time availability updates

## License

MIT License - feel free to use this project for your own book rental service!
