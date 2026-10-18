import React from "react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Leaf, ShieldCheck, Heart, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Responsible Travel Code & Community Ethics | Hunza Expeditions",
  description:
    "Our commitments to mountain conservation, leave-no-trace ethics, fair host compensation, and cultural dignity across Gilgit-Baltistan.",
};

export default function ResponsibleTravelPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Responsible Travel" }]} />

        <div className="py-8 border-b border-stone-200/90 mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-[#2e5a44] text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5" />
            <span>Environmental & Cultural Responsibility</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#12283a]">
            Responsible Travel Code
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            The fragile glacial ecosystems and ancient cultures of Gilgit-Baltistan require thoughtful stewardship.
            Here is how we practice responsible tourism and what we ask of every traveller who visits with us.
          </p>
        </div>

        <div className="space-y-10 text-sm text-stone-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#12283a] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>1. Direct Economic Benefit to Local Communities</span>
            </h2>
            <p>
              We deliberately prioritize locally owned guesthouses, family-run roadside cafes, local jeep drivers, and village guides. Rather than routing all tour revenue to external booking brokers, we ensure the financial benefits of tourism stay in the valleys where travellers are hosted.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#12283a] flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#b4532a]" />
              <span>2. Respect for Cultural Dignity & Photography</span>
            </h2>
            <p>
              Residents of northern Pakistan are known for their genuine hospitality. We ask visitors to treat local life with mutual respect. Always ask for consent before taking photographs of individuals, particularly women, elders, and children. When visiting village residential lanes or historical places of worship, dress modestly with shoulders and knees covered.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#12283a] flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span>3. Waste Reduction & Glacier Protection</span>
            </h2>
            <p>
              High mountain valleys have limited municipal waste infrastructure. We minimize single-use plastics by encouraging refillable water bottles and reusable bags. On glacier walks and trekking routes, we adhere strictly to Leave No Trace principles: all packaging and non-biodegradable waste must be brought back down to urban collection points.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#12283a] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>4. Small-Party Travel</span>
            </h2>
            <p>
              We avoid running massive 50-person bus convoys that strain narrow mountain roads, overwhelm small village resources, and degrade the tranquil quality of the travel experience. Our itineraries are curated primarily for private couples, families, and small hiking parties.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
