import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import { Destination } from "@/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const placesCount = destination.placesOfInterest?.length || 0;

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden subtle-shadow subtle-shadow-hover transition-all duration-300 flex flex-col h-full">
      {/* Destination Image */}
      <div className="relative h-60 w-full overflow-hidden bg-stone-100">
        <Image
          src={destination.heroImageUrl}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Region Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-stone-800 text-[11px] font-semibold">
            {destination.region}
          </Badge>
        </div>

        {/* Places of Interest Tag */}
        {placesCount > 0 && (
          <div className="absolute bottom-3 left-3 text-xs text-white/95 font-medium flex items-center gap-1.5 drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>{placesCount} places of interest</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <h3 className="text-xl font-bold text-[#12283a] group-hover:text-[#b4532a] transition-colors tracking-tight">
            <Link href={`/destinations/${destination.slug}`}>
              {destination.name}
            </Link>
          </h3>
          <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed">
            {destination.shortDescription}
          </p>
        </div>

        {/* Action Footnotes */}
        <div className="pt-5 mt-5 border-t border-stone-100 flex items-center justify-between gap-2">
          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex items-center text-sm font-semibold text-[#12283a] hover:text-[#b4532a] transition-colors gap-1 group/link"
          >
            <span>Explore details</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>

          <Button
            href={`/plan-your-trip?destination=${destination.slug}`}
            variant="ghost"
            size="sm"
            className="text-xs text-stone-600 hover:text-[#12283a] px-2 py-1"
            title={`Plan a journey including ${destination.name}`}
          >
            <Compass className="w-3.5 h-3.5 mr-1 text-stone-400" />
            <span>Plan Trip</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
