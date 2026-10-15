import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  Mountain,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { getPublishedDestinations } from "@/sanity/lib/queries";

export default async function HomePage() {
  const destinations = await getPublishedDestinations();
  const featuredDestinations = destinations.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 sm:pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[600px] sm:min-h-[680px] flex items-center justify-center bg-stone-900 overflow-hidden">
        <Image
          src="/images/hunza-hero.jpg"
          alt="Hunza Valley landscape with snow-capped Karakoram peaks"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70 scale-105 transition-transform duration-[8000ms] hover:scale-100"
        />
        {/* Layered gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1520] via-[#0e1b2a]/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1520]/40 via-transparent to-transparent" />

        <Container className="relative z-10 py-20 text-white space-y-7 max-w-4xl">
          {/* Location pill */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-xs sm:text-sm font-medium text-amber-300">
              <Mountain className="w-4 h-4" />
              <span>Gilgit-Baltistan, Pakistan</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="animate-fade-in-up delay-100 text-center space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              Thoughtful Journeys
              <br />
              <span className="text-amber-300/90">Through Northern Pakistan</span>
            </h1>

            <p className="text-base sm:text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed drop-shadow font-normal">
              Combining the dramatic landscapes of the Karakorams and Himalayas with carefully arranged, locally hosted experiences.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up delay-200 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              href="/plan-your-trip"
              variant="accent"
              size="lg"
              className="w-full sm:w-auto text-base shadow-lg shadow-[#b4532a]/30"
              icon={<Compass className="w-5 h-5 ml-1" />}
            >
              Plan a Custom Journey
            </Button>
            <Button
              href="/destinations"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
            >
              Explore Destinations
            </Button>
          </div>

          {/* Key promise badges */}
          <div className="animate-fade-in-up delay-300 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-stone-300 text-center">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Practical, realistic planning</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Clear expectations & pricing</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Locally rooted arrangements</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Confirmed manual reviews</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. DISCOVERY INTRO & CORE PHILOSOPHY */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#b4532a]">
              <Sparkles className="w-4 h-4" />
              <span>The Hunza Expeditions Approach</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#12283a]">
              Travel shaped by local knowledge, not generic templates.
            </h2>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              We believe a journey to northern Pakistan should be well-organised, realistic about mountain transit,
              and deeply respectful of local community life. We do not use automated booking bots or fabricate availability.
              Every journey begins with a conversation about what you hope to experience.
            </p>
          </div>

          <div className="lg:col-span-5 bg-stone-50 border border-stone-200/90 rounded-2xl p-6 sm:p-8 space-y-5">
            <h4 className="font-bold text-lg text-[#12283a]">Our Operating Commitment</h4>
            <ul className="space-y-3.5 text-sm text-stone-700">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#12283a]/10 text-[#12283a] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <span><strong>No hidden fees:</strong> We outline inclusions, vehicle types, and meal arrangements clearly in every quotation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#12283a]/10 text-[#12283a] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <span><strong>Respectful local partnerships:</strong> Activities and homestays involve consented community hosts who receive fair compensation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#12283a]/10 text-[#12283a] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <span><strong>Realistic pacing:</strong> We do not rush mountain roads; itineraries include necessary acclimatisation and contingency buffers.</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* 3. FEATURED DESTINATIONS */}
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200/80">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#b4532a]">
              Where We Operate
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#12283a]">
              Featured Destinations
            </h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-xl">
              Explore key regions across Gilgit-Baltistan with verified historical context, seasonal travel guidance, and local attractions.
            </p>
          </div>
          <Button
            href="/destinations"
            variant="outline"
            size="md"
            className="shrink-0"
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            View All Destinations
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredDestinations.map((dest) => (
            <DestinationCard key={dest._id} destination={dest} />
          ))}
        </div>
      </Container>

      {/* 4. HOW JOURNEY PLANNING WORKS */}
      <section className="bg-stone-100/70 border-y border-stone-200/80 py-16 sm:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1f6b85]">
              Transparent Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#12283a]">
              How Your Journey Is Arranged
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              A straightforward, 3-step planning process with zero automated payment pressure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200/90 subtle-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#12283a] text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-[#12283a]">Share Your Preferences</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Choose your destinations, travel season, group size, and interests using our guided journey builder form.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200/90 subtle-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#b4532a] text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-[#12283a]">Feasibility & Quotation</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Our local team reviews road conditions, seasonal weather, and accommodation availability to prepare an honest, itemized quotation.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200/90 subtle-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#2e5a44] text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-[#12283a]">Confirmed Arrangements</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Once you are satisfied with the route and pricing, arrangements are locked with trusted local drivers, hosts, and certified guides.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              href="/plan-your-trip"
              variant="accent"
              size="lg"
              icon={<Compass className="w-4 h-4 ml-1" />}
            >
              Start Planning Your Itinerary
            </Button>
          </div>
        </Container>
      </section>

      {/* 5. CMS & EDITORIAL HIGHLIGHT BANNER */}
      <Container>
        <div className="bg-white rounded-2xl border border-stone-200/90 p-8 sm:p-10 subtle-shadow flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Content Management & Administration</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#12283a]">
              Manage Destinations & Content in Sanity Studio
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Business owners can publish new destinations, update seasonal guidance, add places of interest, and review incoming enquiries without editing code.
            </p>
          </div>
          <Button
            href="/studio"
            variant="outline"
            size="md"
            className="shrink-0"
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            Open Content Studio
          </Button>
        </div>
      </Container>
    </div>
  );
}
