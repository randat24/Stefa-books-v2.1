"use client"

import Hero from "@/components/hero/Hero";
import Steps from "@/components/sections/Steps";
import PlansLite from "@/components/widgets/PlansLite";
import Categories from "@/components/sections/Categories";
import SubscribeFormHome from "@/components/subscribe/SubscribeFormHome";
import SocialProof from "@/components/sections/SocialProof";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import ContactLocation from "@/components/sections/ContactLocation";
import { Catalog } from "@/components/sections/Catalog";
import { BOOKS } from "@/lib/mock";

export default function HomePage() {
	return (
		<>
			{/* Hero */}
			<Hero />
			
			{/* Steps */}
			<Steps />
			
			{/* Каталог книг */}
			<Catalog books={BOOKS} />

			{/* Тарифы */}
			<PlansLite />

			{/* Categories */}
			<Categories />

			{/* Subscribe Form */}
			<SubscribeFormHome />

			{/* FAQ */}
			<FAQ />

			{/* Social Proof */}
			<SocialProof />

			{/* Contact Location */}
			<ContactLocation />

			{/* Final CTA */}
			<FinalCTA />
		</>
	)
}

