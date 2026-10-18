import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { getPublishedPlaceCategories, getPublishedPlaces } from "@/lib/editorialContent";

export const metadata: Metadata = {
  title: "Places to Visit in Gilgit-Baltistan | Hunza Expeditions",
  description: "Explore historic forts, mountain villages, lakes, glaciers, and other notable places across Gilgit-Baltistan.",
};

export const revalidate = 30;

export default async function PlacesPage() {
  const [places, categories] = await Promise.all([
    getPublishedPlaces(),
    getPublishedPlaceCategories(),
  ]);

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[{ label: "Places" }]} />
        <header className="py-8 border-b border-stone-200/90 mb-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[#b4532a] text-xs font-semibold tracking-wide">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Landmarks, villages & natural wonders</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#12283a]">
            Places to Explore
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
            Discover the forts, valleys, glaciers, and communities that make journeys through Gilgit-Baltistan memorable.
          </p>
        </header>

        {categories.length > 0 && (
          <nav aria-label="Browse places by category" className="mb-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-600">Browse by category</h2>
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/places/category/${category.slug}`}
                    className="inline-flex items-center rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-[#01411c] transition hover:border-emerald-700 hover:bg-emerald-50"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {places.map((place) => (
            <article key={place.slug} className="bg-white rounded-xl border border-stone-200/90 overflow-hidden subtle-shadow flex flex-col">
              {place.heroImageUrl && (
                <Link href={`/places/${place.slug}`} className="relative h-56 bg-stone-100 block">
                  <Image
                    src={place.heroImageUrl}
                    alt={place.imageAlt || place.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </Link>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#176b3a]">{place.region}</p>
                <h2 className="mt-2 text-xl font-bold text-[#12283a]">
                  <Link href={`/places/${place.slug}`} className="hover:text-[#176b3a]">{place.name}</Link>
                </h2>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">{place.shortDescription}</p>
                {place.primaryCategory && typeof place.primaryCategory === "object" && (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Place categories">
                    {[place.primaryCategory, ...(place.additionalCategories ?? [])]
                      .filter((category): category is Exclude<typeof category, number> => typeof category !== "number")
                      .map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/places/category/${category.slug}`}
                            className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-900"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
                <Link
                  href={`/places/${place.slug}`}
                  className="mt-auto pt-5 inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-[#176b3a]"
                >
                  View place details<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {places.length === 0 && (
          <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600">
            There are no published places to display yet.
          </p>
        )}
      </Container>
    </div>
  );
}
