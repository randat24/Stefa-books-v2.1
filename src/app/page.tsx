"use client"

import { Suspense, lazy } from "react";
import Hero from "@/components/hero/Hero";
import Steps from "@/components/sections/Steps";

// Dynamic imports for non-critical components
const PlansLite = lazy(() => import("@/components/widgets/PlansLite"));
const Categories = lazy(() => import("@/components/sections/Categories"));
const SubscribeFormHome = lazy(() => import("@/components/subscribe/SubscribeFormHome"));
const SocialProof = lazy(() => import("@/components/sections/SocialProof"));
const FAQ = lazy(() => import("@/components/sections/FAQ"));
const FinalCTA = lazy(() => import("@/components/sections/FinalCTA"));
const ContactLocation = lazy(() => import("@/components/sections/ContactLocation"));
const Catalog = lazy(() => import("@/components/sections/Catalog").then(mod => ({ default: mod.Catalog })));
const BookRecommendations = lazy(() => import("@/components/sections/BookRecommendations").then(mod => ({ default: mod.BookRecommendations })));
const RecentViews = lazy(() => import("@/components/sections/RecentViews").then(mod => ({ default: mod.RecentViews })));

export default function HomePage() {
	return (
		<>
			{/* Hero */}
			<Hero />
			
			{/* Steps */}
			<Steps />
			
			{/* Recent Views */}
			<Suspense fallback={<div className="h-32 bg-slate-50 animate-pulse rounded-lg" />}>
				<RecentViews maxItems={5} />
			</Suspense>

			{/* Каталог книг */}
			<Suspense fallback={<div className="h-96 bg-slate-50 animate-pulse rounded-lg" />}>
				<Catalog />
			</Suspense>

			{/* Тарифы */}
			<Suspense fallback={<div className="h-80 bg-slate-50 animate-pulse rounded-lg" />}>
				<PlansLite />
			</Suspense>

			{/* Categories */}
			<Suspense fallback={<div className="h-64 bg-slate-50 animate-pulse rounded-lg" />}>
				<Categories />
			</Suspense>

			{/* Subscribe Form */}
			<Suspense fallback={<div className="h-96 bg-slate-50 animate-pulse rounded-lg" />}>
				<SubscribeFormHome />
			</Suspense>

			{/* FAQ */}
			<Suspense fallback={<div className="h-80 bg-slate-50 animate-pulse rounded-lg" />}>
				<FAQ />
			</Suspense>

			{/* Social Proof */}
			<Suspense fallback={<div className="h-48 bg-slate-50 animate-pulse rounded-lg" />}>
				<SocialProof />
			</Suspense>

			{/* Contact Location */}
			<Suspense fallback={<div className="h-64 bg-slate-50 animate-pulse rounded-lg" />}>
				<ContactLocation />
			</Suspense>

			{/* Final CTA */}
			<Suspense fallback={<div className="h-32 bg-slate-50 animate-pulse rounded-lg" />}>
				<FinalCTA />
			</Suspense>
		</>
	)
}