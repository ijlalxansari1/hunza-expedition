import React, { Suspense } from "react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { TourGrid } from "@/components/tours/TourGrid";
import { getPublishedTours } from "@/sanity/lib/queries";
import { Button } from "@/components/ui/Button";
import { Compass, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Tours & Curated Itineraries | Hunza Expeditions",
  description:
    "Explore curated multi-day journeys through Hunza Valley, Gojal, Passu, and Baltistan. Transparent itineraries, realistic mountain pacing, and local guides.",
};

interface ToursPageProps {
  searchParams: Promise<{ destination?: string }>;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const { destination } = await searchParams;
  const tours = await getPublishedTours();

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[{ label: "Tours" }]} />

        {/* Page Header */}
        <div className="py-8 border-b border-stone-200/90 mb-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[#b4532a] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Mountain Journeys</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#12283a]">
            Tours & Itineraries
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
            Carefully paced journeys crafted around seasonal conditions, living culture, and high mountain landscapes.
            Every tour can be adapted into a customized itinerary for private departures.
          </p>
        </div>

        {/* Tour Grid with Filtering */}
        <Suspense fallback={<div className="text-center py-12 text-sm text-stone-500">Loading tours...</div>}>
          <TourGrid tours={tours} initialDestinationFilter={destination} />
        </Suspense>

        {/* Custom Journey planning banner */}
        <div className="mt-16 bg-[#12283a] rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Need a customized departure or private group dates?
            </h3>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              We arrange private bespoke departures for families, photographers, hiking pairs, and solo travellers. Tell us what you want to see.
            </p>
          </div>
          <Button
            href="/plan-your-trip"
            variant="accent"
            size="lg"
            className="shrink-0"
            icon={<Compass className="w-5 h-5 ml-1" />}
          >
            Design Custom Itinerary
          </Button>
        </div>
      </Container>
    </div>
  );
}
