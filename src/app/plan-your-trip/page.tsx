import React, { Suspense } from "react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { JourneyBuilder } from "@/components/journey-builder/JourneyBuilder";
import { getPublishedDestinations } from "@/sanity/lib/queries";
import { Compass, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Plan Your Custom Journey | Hunza Expeditions",
  description:
    "Design a personalized journey through northern Pakistan. Select valleys, trip duration, interests, and preferences for an itemized, manually confirmed itinerary.",
};

export default async function PlanYourTripPage() {
  const destinations = await getPublishedDestinations();

  return (
    <div className="py-8 sm:py-14 bg-stone-100/50 min-h-screen">
      <Container>
        <Breadcrumbs items={[{ label: "Plan Your Trip" }]} />

        {/* Intro Banner */}
        <div className="max-w-3xl mx-auto text-center py-6 sm:py-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[#b4532a] text-xs font-semibold tracking-wide">
            <Compass className="w-3.5 h-3.5" />
            <span>Guided Itinerary Planning</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#12283a]">
            Build Your Northern Pakistan Journey
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Tell us about your timing, preferred valleys, and travel style. Our Gilgit-Baltistan team will review road feasibility, accommodation quality, and seasonal timing to craft a realistic quotation.
          </p>
        </div>

        {/* Multi-step Journey Builder */}
        <Suspense fallback={<div className="text-center py-12 text-sm text-stone-500">Loading planner...</div>}>
          <JourneyBuilder destinations={destinations} />
        </Suspense>

        {/* Trust & Policy Assurance */}
        <div className="max-w-2xl mx-auto mt-12 text-center text-xs text-stone-500 space-y-2">
          <div className="flex items-center justify-center gap-2 text-stone-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Enquiry-based planning • No automatic card charges</span>
          </div>
          <p>
            We do not share your contact information with external marketing lists. Your details are used exclusively by our operational team to discuss your trip.
          </p>
        </div>
      </Container>
    </div>
  );
}
