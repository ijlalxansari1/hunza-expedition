import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Compass, Users, CheckCircle2, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Community-Hosted Experiences | Hunza Expeditions",
  description:
    "Authentic village and cultural experiences in Gilgit-Baltistan arranged with consented local hosts, fair compensation, and respectful community partnerships.",
};

const experiences = [
  {
    title: "Orchard to Table: Traditional Apricot Harvesting & Processing",
    location: "Karimabad, Hunza Valley",
    category: "Culinary & Agriculture",
    duration: "Half Day (Approx. 3-4 hours)",
    season: "July – August (Harvest Window)",
    description: "Join a local farming family during the summer fruit harvest. Learn traditional sun-drying techniques, kernel cracking, and traditional apricot oil pressing methods passed down through generations.",
    imageUrl: "/images/hunza-hero.jpg",
    operationalStatus: "Operationally Approved",
  },
  {
    title: "Heritage Village Historian Walk & Ancient Water Channels",
    location: "Ganish & Altit Khun, Hunza",
    category: "Living Heritage",
    duration: "3 Hours",
    season: "April to October",
    description: "Walk with a village elder along the ancient stone water channels (kuhls) carved into the mountainsides. Discover how water-sharing treaties sustained mountain communities for centuries before modern roads.",
    imageUrl: "/images/baltit-fort.jpg",
    operationalStatus: "Operationally Approved",
  },
  {
    title: "Wakhi Bread Making & Home Hospitality in Upper Gojal",
    location: "Passu & Gulkin, Upper Hunza",
    category: "Cultural Immersion",
    duration: "3 Hours",
    season: "May to October",
    description: "Step inside a traditional Wakhi home. Participate in baking traditional pititi and giyaling flatbreads on a central hearth while learning about the Wakhi linguistic community of the high Karakorams.",
    imageUrl: "/images/passu-cones.jpg",
    operationalStatus: "In Review / Pilot Phase",
  },
];

export default function ExperiencesPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[{ label: "Experiences" }]} />

        {/* Header */}
        <div className="py-8 border-b border-stone-200/90 mb-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-[#2e5a44] text-xs font-semibold tracking-wide">
            <Users className="w-3.5 h-3.5" />
            <span>Locally Hosted Arrangements</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#12283a]">
            Community Experiences
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
            Meaningful encounters with the people of Gilgit-Baltistan. We do not stage artificial cultural performances.
            All experiences are arranged with consented local hosts who receive transparent, fair compensation.
          </p>
        </div>

        {/* Operating Principles Notice */}
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-6 sm:p-7 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 text-xs text-stone-700 max-w-2xl leading-relaxed">
            <span className="font-bold text-[#12283a] text-sm block">Our Community Code:</span>
            <p>
              1. Host consent & dignity first • 2. Direct economic benefits to local households • 3. Small-party limits to preserve authentic village tranquility.
            </p>
          </div>
          <Badge variant="earth" className="shrink-0 text-xs py-1 px-3">
            Fair Compensation Guaranteed
          </Badge>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200/90 overflow-hidden subtle-shadow flex flex-col"
            >
              <div className="relative h-56 w-full bg-stone-100">
                <Image
                  src={exp.imageUrl}
                  alt={exp.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="neutral" className="bg-white/95 text-stone-800 text-[11px] font-semibold">
                    {exp.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs text-stone-500 font-medium block">
                    {exp.location} • {exp.duration}
                  </span>
                  <h3 className="text-lg font-bold text-[#12283a] leading-snug">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">Season:</span>
                    <span className="font-semibold text-stone-800">{exp.season}</span>
                  </div>
                  <Button
                    href={`/plan-your-trip?experience=${encodeURIComponent(exp.title)}`}
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-xs"
                    icon={<Compass className="w-3.5 h-3.5 ml-1" />}
                  >
                    Include in Your Journey
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
