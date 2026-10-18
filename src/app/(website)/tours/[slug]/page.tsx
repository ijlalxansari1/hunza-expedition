import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Mountain,
  Compass,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Calendar,
  Briefcase,
  Building,
  Car,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getTourBySlug } from "@/lib/catalog";
import { AddTourToCartButton } from "@/components/booking/AddTourToCartButton";

interface SingleTourPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 30;

export async function generateMetadata({
  params,
}: SingleTourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    return { title: "Tour Not Found | Hunza Expeditions" };
  }

  return {
    title: tour.seoTitle || `${tour.title} | Hunza Expeditions`,
    description: tour.metaDescription || tour.shortSummary,
    openGraph: {
      title: `${tour.title} | Hunza Expeditions`,
      description: tour.shortSummary,
      images: [{ url: tour.heroImageUrl }],
    },
  };
}

export default async function SingleTourPage({ params }: SingleTourPageProps) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  return (
    <div className="pb-16 sm:pb-24">
      {/* Breadcrumbs */}
      <div className="bg-stone-50 border-b border-stone-200/80">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Tours", href: "/tours" },
              { label: tour.title },
            ]}
          />
        </Container>
      </div>

      {/* Hero Section */}
      <section className="relative h-[440px] sm:h-[520px] w-full bg-stone-900 overflow-hidden">
        <Image
          src={tour.heroImageUrl}
          alt={tour.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b2a] via-[#0e1b2a]/45 to-black/30" />

        <div className="absolute inset-0 flex items-end">
          <Container className="pb-10 sm:pb-14">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" className="bg-[#b4532a] text-white border-none font-semibold text-xs">
                  {tour.difficulty}
                </Badge>
                <Badge variant="neutral" className="bg-white/90 text-stone-800 font-semibold text-xs">
                  {tour.durationDays} Days / {tour.durationDays - 1} Nights
                </Badge>
                <span className="text-xs text-stone-300">
                  {tour.travelStyle}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                {tour.title}
              </h1>

              <p className="text-sm sm:text-lg text-stone-200 max-w-2xl font-normal leading-relaxed">
                {tour.shortSummary}
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* Content Layout */}
      <Container className="pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#12283a] tracking-tight">
                Trip Overview
              </h2>
              <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-base sm:text-lg">
                <p>{tour.fullDescription}</p>
              </div>
            </section>

            {/* Quick Key Facts Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-stone-50 rounded-xl border border-stone-200/90 text-xs text-stone-700">
              <div className="space-y-1">
                <span className="text-stone-500 font-medium block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" /> Duration
                </span>
                <span className="font-bold text-sm text-[#12283a]">{tour.durationDays} Days</span>
              </div>
              <div className="space-y-1">
                <span className="text-stone-500 font-medium block flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-stone-400" /> Difficulty
                </span>
                <span className="font-bold text-sm text-[#12283a]">{tour.difficulty}</span>
              </div>
              <div className="space-y-1">
                <span className="text-stone-500 font-medium block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" /> Season
                </span>
                <span className="font-bold text-sm text-[#12283a]">{tour.season}</span>
              </div>
              <div className="space-y-1">
                <span className="text-stone-500 font-medium block flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-stone-400" /> Style
                </span>
                <span className="font-bold text-sm text-[#12283a]">{tour.travelStyle}</span>
              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <section className="space-y-6 pt-4 border-t border-stone-200">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#b4532a]">
                  Step by Step
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#12283a] tracking-tight">
                  Day-by-Day Itinerary
                </h2>
                <p className="text-sm text-stone-600">
                  Each day is paced to ensure comfortable road transit, photographic opportunities, and cultural encounters.
                </p>
              </div>

              <div className="space-y-4">
                {tour.itinerary.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#12283a] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        D{day.dayNumber}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-[#12283a]">
                        {day.title}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-11">
                      {day.description}
                    </p>

                    {(day.accommodation || day.mealsIncluded || day.travelNotes) && (
                      <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-4 text-xs text-stone-500 pl-11">
                        {day.accommodation && (
                          <div className="flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-stone-400" />
                            <span>Stay: <strong>{day.accommodation}</strong></span>
                          </div>
                        )}
                        {day.mealsIncluded && (
                          <div>
                            Meals: <strong>{day.mealsIncluded}</strong>
                          </div>
                        )}
                        {day.travelNotes && (
                          <div className="flex items-center gap-1.5 text-stone-600 italic">
                            <Car className="w-3.5 h-3.5 text-stone-400" />
                            <span>{day.travelNotes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <section className="pt-6 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50/50 rounded-xl border border-emerald-200/80 p-5 sm:p-6 space-y-3">
                <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>What&apos;s Included</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-emerald-950/80">
                  {tour.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 sm:p-6 space-y-3">
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-stone-400" />
                  <span>What&apos;s Excluded</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                  {tour.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-stone-400 font-bold">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Packing & Things to Bring */}
            {tour.packingRequirements && tour.packingRequirements.length > 0 && (
              <section className="pt-6 border-t border-stone-200 space-y-3">
                <h3 className="text-xl font-bold text-[#12283a]">Packing Advice & Gear</h3>
                <div className="bg-stone-50 rounded-xl p-5 border border-stone-200/80">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-stone-700">
                    {tour.packingRequirements.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2e5a44] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Safety & Altitude Notice */}
            {tour.safetyNotes && (
              <section className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 sm:p-6 text-xs sm:text-sm text-amber-950/85 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Mountain Safety & Altitude Acclimatisation</span>
                </div>
                <p>{tour.safetyNotes}</p>
              </section>
            )}
          </div>

          {/* Sticky Right Column (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Quotation & Booking Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-lg space-y-5">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                    Pricing Basis
                  </span>
                  {tour.price ? (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#12283a]">
                          ${tour.price}
                        </span>
                        <span className="text-xs text-stone-500 uppercase">{tour.currency}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">{tour.pricingBasis}</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xl font-bold text-[#12283a]">Seasonal Quotation</span>
                      <p className="text-xs text-stone-500 mt-1">Rates vary based on season and vehicle choice.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <AddTourToCartButton
                    tour={{
                      slug: tour.slug,
                      title: tour.title,
                      imageUrl: tour.heroImageUrl,
                      durationDays: tour.durationDays,
                      price: tour.price,
                      currency: tour.currency || "USD",
                      pricingBasis: tour.pricingBasis,
                      destinations: tour.destinations.map((destination) => destination.name),
                    }}
                  />

                  <Button
                    href={`/plan-your-trip?tour=${tour.slug}`}
                    variant="accent"
                    size="lg"
                    className="w-full justify-center"
                    icon={<Compass className="w-4 h-4 ml-1" />}
                  >
                    Enquire About This Tour
                  </Button>

                  <Button
                    href="/tours"
                    variant="outline"
                    size="md"
                    className="w-full justify-center text-stone-800"
                  >
                    Browse Other Tours
                  </Button>
                </div>

                <div className="pt-3 border-t border-stone-100 text-xs text-stone-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>No automated booking charges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Customizable for private departures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Itemized transparent quotation</span>
                  </div>
                </div>
              </div>

              {/* Destinations covered */}
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-3">
                <span className="text-xs font-bold text-[#12283a] uppercase tracking-wider block">
                  Destinations Covered
                </span>
                <div className="space-y-2">
                  {tour.destinations.map((d) => (
                    <Link
                      key={d._id}
                      href={`/destinations/${d.slug}`}
                      className="flex items-center justify-between text-xs font-semibold text-stone-700 hover:text-[#b4532a] bg-white p-2.5 rounded-lg border border-stone-200 transition-colors"
                    >
                      <span>{d.name}</span>
                      <span className="text-stone-400">View Guide →</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
