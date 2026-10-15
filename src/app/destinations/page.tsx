import React from "react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DestinationGrid } from "@/components/destinations/DestinationGrid";
import { getPublishedDestinations } from "@/sanity/lib/queries";
import { Button } from "@/components/ui/Button";
import { Compass, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Destinations in Gilgit-Baltistan | Hunza Expeditions",
  description:
    "Discover the valleys of northern Pakistan: Hunza Valley, Nagar, Passu & Gojal, and Skardu Baltistan. Verified local context, attractions, and practical travel advice.",
};

export default async function DestinationsPage() {
  const destinations = await getPublishedDestinations();

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: "Destinations" }]} />

        {/* Page Header */}
        <div className="py-8 border-b border-stone-200/90 mb-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[#b4532a] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gilgit-Baltistan, Northern Pakistan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#12283a]">
            Destinations & Valleys
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
            From the terraced apricot orchards of Karimabad to the serrated spires of Passu and the cold desert
            plateaus of Baltistan, explore the regions where Hunza Expeditions arranges thoughtful, locally hosted journeys.
          </p>
        </div>

        {/* Destinations Interactive Grid */}
        <DestinationGrid destinations={destinations} />

        {/* Custom Journey planning banner */}
        <div className="mt-16 bg-[#12283a] rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Looking for a combined multi-valley itinerary?
            </h3>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              We design tailor-made journeys connecting multiple valleys across Gilgit-Baltistan according to your travel dates, preferred pace, and interests.
            </p>
          </div>
          <Button
            href="/plan-your-trip"
            variant="accent"
            size="lg"
            className="shrink-0"
            icon={<Compass className="w-5 h-5 ml-1" />}
          >
            Build Your Itinerary
          </Button>
        </div>
      </Container>
    </div>
  );
}
