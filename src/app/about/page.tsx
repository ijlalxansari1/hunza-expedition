import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Mountain, ShieldCheck, MapPin, HeartHandshake, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "About Hunza Expeditions | Locally Rooted Tourism in Gilgit-Baltistan",
  description:
    "Learn about Hunza Expeditions: our operating philosophy, community commitments, mountain safety standards, and approach to travel in northern Pakistan.",
};

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: "About Us" }]} />

        {/* Hero Banner */}
        <div className="max-w-3xl py-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[#b4532a] text-xs font-semibold tracking-wide">
            <Mountain className="w-3.5 h-3.5" />
            <span>Our Approach to Travel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#12283a]">
            Well-Organised Mountain Journeys Built on Local Knowledge
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Hunza Expeditions is a tourism company based in Gilgit-Baltistan, Pakistan. We help travellers discover northern Pakistan through practical travel planning, dependable local communication, and carefully arranged experiences involving local people.
          </p>
        </div>

        {/* Story & Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 my-12 items-center">
          <div className="lg:col-span-6 relative h-96 rounded-2xl overflow-hidden subtle-shadow">
            <Image
              src="/images/hunza-hero.jpg"
              alt="Hunza Valley orchards and Karakoram mountains"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12283a] tracking-tight">
              Why We Do Things Differently
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
              <p>
                Too often, travel in northern Pakistan is sold through rigid mass-bus tours or automated booking platforms that fail to account for mountain realities. Road conditions, altitude acclimatisation, and local harvest cycles cannot be handled by algorithms.
              </p>
              <p>
                We operate as a high-touch, enquiry-driven travel planner. We listen to what you want to experience—whether that is slow walks through ancient walnut orchards, active glacier hikes in Nagar, or heritage exploration in restored royal palaces—and design a custom itinerary with realistic travel pacing.
              </p>
            </div>
          </div>
        </div>

        {/* Three Core Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200/90 subtle-shadow space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#12283a] text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-[#12283a]">Clear Expectations & Pricing</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              No hidden fees, surprise vehicle downgrades, or misleading claims. We clearly define what is included, what is excluded, and what seasonal conditions to expect.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200/90 subtle-shadow space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#b4532a] text-white flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#12283a]">Fair Community Partnerships</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We partner directly with local family guesthouses, certified guides, and village hosts. We ensure they receive fair, transparent compensation for their time and hospitality.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200/90 subtle-shadow space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#2e5a44] text-white flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="text-lg font-bold text-[#12283a]">Dependable Communication</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              From your first enquiry to your final departure, you communicate directly with individuals who know these roads, hotels, and mountain passes intimately.
            </p>
          </div>
        </div>

        {/* Operating Location */}
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Where We Are Based
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#12283a]">
              Karimabad, Hunza Valley, Gilgit-Baltistan
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Our operations are centered in the heart of the Karakoram mountains, enabling direct oversight of our vehicle fleet, local drivers, and village arrangements.
            </p>
          </div>
          <Button href="/contact" variant="primary" size="md">
            Get in Touch
          </Button>
        </div>
      </Container>
    </div>
  );
}
