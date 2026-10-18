import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Car,
  Compass,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getDestinationBySlug } from "@/lib/catalog";
import { getPublishedPlaces } from "@/lib/editorialContent";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 30;

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return {
      title: "Destination Not Found | Hunza Expeditions",
    };
  }

  return {
    title: destination.seoTitle || `${destination.name} Travel Guide | Hunza Expeditions`,
    description: destination.metaDescription || destination.shortDescription,
    openGraph: {
      title: `${destination.name} | Hunza Expeditions`,
      description: destination.shortDescription,
      images: [{ url: destination.heroImageUrl }],
    },
  };
}

export default async function SingleDestinationPage({
  params,
}: DestinationPageProps) {
  const { slug } = await params;
  const [destination, places] = await Promise.all([
    getDestinationBySlug(slug),
    getPublishedPlaces(slug),
  ]);

  if (!destination) {
    notFound();
  }

  return (
    <div className="pb-16 sm:pb-24">
      {/* Breadcrumbs Section */}
      <div className="bg-stone-50 border-b border-stone-200/80">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Destinations", href: "/destinations" },
              { label: destination.name },
            ]}
          />
        </Container>
      </div>

      {/* Hero Banner Section */}
      <section className="relative h-[480px] sm:h-[560px] w-full bg-stone-900 overflow-hidden">
        <Image
          src={destination.heroImageUrl}
          alt={destination.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b2a] via-[#0e1b2a]/40 to-black/30" />
        
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-10 sm:pb-14">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="accent" className="bg-[#b4532a] text-white border-none font-semibold text-xs">
                  {destination.region}
                </Badge>
                {destination.coordinates && (
                  <span className="text-xs text-stone-300 font-mono">
                    {destination.coordinates.lat}° N, {destination.coordinates.lng}° E
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
                {destination.name}
              </h1>

              <p className="text-base sm:text-xl text-stone-200 font-normal leading-relaxed drop-shadow">
                {destination.shortDescription}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  href={`/plan-your-trip?destination=${destination.slug}`}
                  variant="accent"
                  size="md"
                  icon={<Compass className="w-4 h-4 ml-1" />}
                >
                  Plan a Trip to {destination.name}
                </Button>
                <Button
                  href={`/tours?destination=${destination.slug}`}
                  variant="outline"
                  size="md"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                >
                  Browse {destination.name} Tours
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Main Content Body */}
      <Container className="pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Editorial & Destination Details (8 cols) */}
          <div className="lg:col-span-8 space-y-14">
            {/* 1. Overview & Local Context */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#12283a] tracking-tight">
                Overview & Cultural Context
              </h2>
              <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-base sm:text-lg">
                <p>{destination.overview}</p>
              </div>
            </section>

            {/* 2. Places of Interest & Heritage Attractions */}
            {places.length > 0 && (
              <section className="space-y-6 pt-6 border-t border-stone-200">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#b4532a]">
                    <Building2 className="w-4 h-4" />
                    <span>Notable Sites</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#12283a] tracking-tight">
                    Places of Interest & Heritage
                  </h2>
                  <p className="text-sm text-stone-600">
                    Important historical monuments, natural landmarks, and cultural settlements in {destination.name}.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {places.map((place) => (
                    <div
                      key={place.slug}
                      className="bg-white rounded-xl border border-stone-200/90 overflow-hidden subtle-shadow flex flex-col"
                    >
                      {place.heroImageUrl && (
                        <div className="relative h-48 w-full bg-stone-100">
                          <Image
                            src={place.heroImageUrl}
                            alt={place.imageAlt || place.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold text-[#12283a]">
                            <Link href={`/places/${place.slug}`} className="hover:text-[#176b3a]">
                              {place.name}
                            </Link>
                          </h4>
                          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                            {place.description || place.shortDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Best Time to Visit & Seasonal Breakdown */}
            {destination.bestTimeToVisit && (
              <section className="space-y-6 pt-6 border-t border-stone-200">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1f6b85]">
                    <Calendar className="w-4 h-4" />
                    <span>Seasonal Guidance</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#12283a] tracking-tight">
                    Best Time to Visit
                  </h2>
                  <p className="text-sm sm:text-base text-stone-600">
                    {destination.bestTimeToVisit.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.bestTimeToVisit.seasons.map((season) => (
                    <div
                      key={season.season}
                      className="bg-stone-50 border border-stone-200/80 rounded-xl p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-[#12283a]">
                          {season.season}
                        </h4>
                        <span className="text-xs font-medium text-[#b4532a] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {season.months}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {season.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Transport & Access Guidance */}
            {destination.transportNotes && (
              <section className="space-y-4 pt-6 border-t border-stone-200">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-600">
                  <Car className="w-4 h-4" />
                  <span>Getting There</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#12283a] tracking-tight">
                  Transport & Road Access
                </h2>
                <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 text-sm text-stone-700 leading-relaxed space-y-3">
                  <p>{destination.transportNotes}</p>
                  <p className="text-xs text-stone-500 italic">
                    Note: Mountain transit times are estimated under normal driving conditions. Karakoram road conditions fluctuate with weather.
                  </p>
                </div>
              </section>
            )}

            {/* 5. Practical Travel Advice & Cultural Etiquette */}
            {destination.practicalInfo && destination.practicalInfo.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-stone-200">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#12283a] tracking-tight">
                  Practical Travel Advice & Local Etiquette
                </h2>
                <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-6">
                  <ul className="space-y-3">
                    {destination.practicalInfo.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-[#2e5a44] shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* 6. Safety & Mountain Environment Advisory */}
            {destination.safetyNotes && (
              <section className="bg-amber-50/60 border border-amber-200 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-base">
                  <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>Safety, Altitude & Mountain Environment Notice</span>
                </div>
                <p className="text-sm text-amber-950/80 leading-relaxed">
                  {destination.safetyNotes}
                </p>
              </section>
            )}
          </div>

          {/* Right Column: Sticky Trip Planning Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Trip Action Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-lg space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                    Plan Your Visit
                  </span>
                  <h3 className="text-2xl font-bold text-[#12283a] tracking-tight">
                    Visit {destination.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Tell us your preferred travel season, duration, and group style. We will prepare a feasible, custom itinerary and quotation.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    href={`/plan-your-trip?destination=${destination.slug}`}
                    variant="accent"
                    size="lg"
                    className="w-full justify-center"
                    icon={<Compass className="w-4 h-4 ml-1" />}
                  >
                    Build Custom Itinerary
                  </Button>

                  <Button
                    href={`/tours?destination=${destination.slug}`}
                    variant="outline"
                    size="md"
                    className="w-full justify-center text-stone-800"
                  >
                    Browse Available Tours
                  </Button>
                </div>

                <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>No automated charges or fake availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Manually reviewed by local Gilgit-Baltistan team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Flexible adjustments before any confirmation</span>
                  </div>
                </div>
              </div>

              {/* Editorial / CMS Management Info for Admins */}
              <div className="bg-stone-50 rounded-xl border border-dashed border-stone-300 p-4 text-xs text-stone-600 space-y-2">
                <div className="flex items-center justify-between font-semibold text-stone-800">
                  <span>CMS Publishing Status</span>
                  <Badge variant="primary" size="sm" className="capitalize text-[10px]">
                    {destination.publicationStatus}
                  </Badge>
                </div>
                <p className="text-[11px] text-stone-500">
                  Destination records can be edited directly in the Payload admin without modifying codebase files.
                </p>
                <Link
                  href="/admin/collections/destinations"
                  className="inline-flex items-center gap-1 font-semibold text-[#12283a] hover:underline pt-1"
                >
                  <span>Manage destinations in Payload</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
