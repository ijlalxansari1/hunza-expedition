import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mountain, ArrowRight, Compass } from "lucide-react";
import { Tour } from "@/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  const difficultyColors = {
    Gentle: "earth" as const,
    Moderate: "primary" as const,
    Challenging: "accent" as const,
    Strenuous: "accent" as const,
  };

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden subtle-shadow subtle-shadow-hover transition-all duration-300 flex flex-col h-full">
      {/* Tour Image */}
      <div className="relative h-60 w-full overflow-hidden bg-stone-100">
        <Image
          src={tour.heroImageUrl}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge
            variant={difficultyColors[tour.difficulty] || "primary"}
            className="bg-white/95 backdrop-blur-sm text-stone-900 font-semibold text-[11px]"
          >
            {tour.difficulty}
          </Badge>
          <span className="text-[11px] font-semibold text-white/95 bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/20">
            {tour.durationDays} Days
          </span>
        </div>

        {/* Destination Tag */}
        <div className="absolute bottom-3 left-3 text-xs text-white/95 font-medium flex items-center gap-1.5 drop-shadow-sm">
          <Mountain className="w-3.5 h-3.5 text-amber-300" />
          <span>{tour.destinations.map((d) => d.name).join(" • ")}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#12283a] group-hover:text-[#b4532a] transition-colors tracking-tight line-clamp-2">
            <Link href={`/tours/${tour.slug}`}>
              {tour.title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
            {tour.shortSummary}
          </p>
        </div>

        {/* Pricing / Seasonal Guidance Note */}
        <div className="pt-3 border-t border-stone-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-stone-500 font-medium">Estimated basis:</span>
            {tour.price ? (
              <span className="text-sm font-bold text-[#12283a]">
                From ${tour.price} {tour.currency}
              </span>
            ) : (
              <span className="text-xs text-stone-600 italic">Seasonal quotation</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Link
              href={`/tours/${tour.slug}`}
              className="inline-flex items-center text-xs font-bold text-[#12283a] hover:text-[#b4532a] transition-colors gap-1 group/link"
            >
              <span>View full itinerary</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>

            <Button
              href={`/plan-your-trip?tour=${tour.slug}`}
              variant="ghost"
              size="sm"
              className="text-xs text-[#b4532a] hover:bg-amber-50 px-2.5 py-1"
            >
              <Compass className="w-3.5 h-3.5 mr-1" />
              <span>Enquire</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
