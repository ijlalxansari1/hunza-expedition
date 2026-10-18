import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { getPlaceBySlug } from "@/lib/editorialContent";

export const dynamic = "force-dynamic";

type PlacePageProps = { params: Promise<{ slug: string }> };

function designationLabel(type: string): string {
  switch (type) {
    case "unesco_world_heritage":
      return "UNESCO World Heritage Site — Inscribed";
    case "unesco_tentative_list":
      return "UNESCO World Heritage Tentative List";
    case "unesco_intangible_heritage":
      return "UNESCO-recognised intangible cultural heritage";
    case "unesco_global_geopark":
      return "UNESCO Global Geopark";
    case "unesco_biosphere_reserve":
      return "UNESCO Biosphere Reserve";
    case "unesco_other":
      return "Other UNESCO designation";
    case "national_protected_area":
      return "National protected-area designation";
    default:
      return "Other official designation";
  }
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const place = await getPlaceBySlug(slug, isEnabled);
  if (!place) return { title: "Place Not Found | Hunza Expeditions", robots: { index: false } };
  return {
    title: place.seoTitle || `${place.name} | Hunza Expeditions`,
    description: place.metaDescription || place.shortDescription,
    openGraph: place.heroImageUrl ? { images: [{ url: place.heroImageUrl }] } : undefined,
    robots: isEnabled ? { index: false, follow: false } : undefined,
  };
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const place = await getPlaceBySlug(slug, isEnabled);
  if (!place) notFound();

  return (
    <article className="pb-16 sm:pb-24">
      <div className="bg-stone-50 border-b border-stone-200/80">
        <Container>
          <Breadcrumbs items={[
            { label: "Places", href: "/places" },
            { label: place.name },
          ]} />
        </Container>
      </div>
      {place.heroImageUrl && (
        <div className="relative h-[360px] sm:h-[480px] bg-stone-900">
          <Image
            src={place.heroImageUrl}
            alt={place.imageAlt || place.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b2a]/85 via-[#0e1b2a]/15 to-transparent" />
          <Container className="absolute inset-x-0 bottom-0 pb-10 sm:pb-14">
            <p className="text-sm font-semibold text-emerald-200">{place.region}</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold text-white">{place.name}</h1>
            <p className="mt-3 max-w-3xl text-base sm:text-lg text-stone-100">{place.shortDescription}</p>
          </Container>
        </div>
      )}
      <Container className="pt-10 sm:pt-14">
        {!place.heroImageUrl && (
          <header className="mb-8">
            <p className="text-sm font-semibold text-emerald-800">{place.region}</p>
            <h1 className="mt-2 text-4xl font-bold text-[#12283a]">{place.name}</h1>
            <p className="mt-3 max-w-3xl text-lg text-stone-600">{place.shortDescription}</p>
          </header>
        )}
        {isEnabled && (
          <p className="mb-6 max-w-3xl rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-950">
            Staff preview: this place may not be published.
          </p>
        )}
        <div className="max-w-3xl space-y-6">
          {place.description && (
            <p className="text-base sm:text-lg leading-relaxed text-stone-700">{place.description}</p>
          )}
          {place.locationNote && (
            <p className="inline-flex items-center gap-2 text-sm text-stone-600">
              <MapPin className="w-4 h-4" aria-hidden="true" /> {place.locationNote}
            </p>
          )}
          {place.geographicArea && (
            <p className="text-sm text-stone-600"><strong>Geographic area:</strong> {place.geographicArea}</p>
          )}
          {(place.primaryCategory || (place.additionalCategories?.length ?? 0) > 0) && (
            <div>
              <p className="text-sm font-semibold text-stone-800">Place categories</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {[place.primaryCategory, ...(place.additionalCategories ?? [])]
                  .filter((category): category is Exclude<typeof category, number | null | undefined> => (
                    typeof category === "object" && category !== null
                  ))
                  .map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/places/category/${category.slug}`}
                        className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-50"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {place.travelTypes && place.travelTypes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-stone-800">Travel types</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {place.travelTypes.map((travelType) => (
                  <li key={travelType} className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700">{travelType}</li>
                ))}
              </ul>
            </div>
          )}
          {place.officialDesignations && place.officialDesignations.length > 0 && (
            <section className="space-y-3" aria-labelledby="official-designations">
              <h2 id="official-designations" className="text-lg font-bold text-[#12283a]">Verified official designations</h2>
              {place.officialDesignations.map((designation) => {
                if (typeof designation === "number") return null;
                const isIntangible = designation.designationType === "unesco_intangible_heritage";
                return (
                  <article key={designation.id} className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
                    <div className="flex items-start gap-2">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="font-semibold">{designationLabel(designation.designationType)}</p>
                        <p className="mt-1">{designation.officialName}</p>
                        {isIntangible && (
                          <p className="mt-2 text-xs">
                            This is a recognised cultural element associated with this area, not a World Heritage inscription of the physical place.
                          </p>
                        )}
                        {designation.designationType === "unesco_tentative_list" && (
                          <p className="mt-2 text-xs">
                            A Tentative List entry is not an inscribed World Heritage Site.
                          </p>
                        )}
                        <p className="mt-2 text-xs">
                          {designation.geographicArea}, {designation.countryOrArea}
                          {designation.lastVerifiedAt && ` · Verified ${new Date(designation.lastVerifiedAt).toLocaleDateString("en-GB")}`}
                        </p>
                        <a href={designation.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold underline">
                          View official source
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
          {place.sourceLinks && place.sourceLinks.length > 0 && (
            <section aria-labelledby="place-sources">
              <h2 id="place-sources" className="text-sm font-semibold text-stone-800">Verified place information sources</h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                {place.sourceLinks.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-emerald-900 underline">{source.title}</a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {place.gallery && place.gallery.length > 0 && (
            <section aria-label="Place gallery" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {place.gallery.map((image) => (
                <div key={`${image.imageUrl}-${image.imageAlt}`} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100">
                  <Image src={image.imageUrl} alt={image.imageAlt} fill sizes="(max-width: 640px) 50vw, 240px" className="object-cover" />
                  {image.caption && <p className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white">{image.caption}</p>}
                </div>
              ))}
            </section>
          )}
          {place.showOnMap && place.coordinates && (
            <a
              href={`https://www.openstreetmap.org/?mlat=${place.coordinates.lat}&mlon=${place.coordinates.lng}#map=12/${place.coordinates.lat}/${place.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 underline"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              View {place.mapMarkerLabel || place.name} on map
            </a>
          )}
          {place.relatedExperiences?.some((experience) => typeof experience !== "number") && (
            <section aria-labelledby="related-experiences">
              <h2 id="related-experiences" className="text-lg font-bold text-[#12283a]">Related experiences</h2>
              <ul className="mt-2 space-y-2">
                {place.relatedExperiences.map((experience) => typeof experience === "number" ? null : (
                  <li key={experience.id} className="text-sm text-stone-700">
                    <span className="font-semibold">{experience.title}</span>
                    {"location" in experience && typeof experience.location === "string" && ` · ${experience.location}`}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {place.relatedTours?.some((tour) => typeof tour !== "number") && (
            <section aria-labelledby="related-tours">
              <h2 id="related-tours" className="text-lg font-bold text-[#12283a]">Related tours</h2>
              <ul className="mt-2 space-y-2">
                {place.relatedTours.map((tour) => typeof tour === "number" ? null : (
                  <li key={tour.id}><Link href={`/tours/${tour.slug}`} className="text-sm font-semibold text-emerald-900 hover:underline">{tour.title}</Link></li>
                ))}
              </ul>
            </section>
          )}
          {place.relatedArticles?.some((article) => typeof article !== "number") && (
            <section aria-labelledby="related-guides">
              <h2 id="related-guides" className="text-lg font-bold text-[#12283a]">Related stories & guides</h2>
              <ul className="mt-2 space-y-2">
                {place.relatedArticles.map((article) => typeof article === "number" ? null : (
                  <li key={article.id}>
                    <Link
                      href={`/${article.contentType === "blog" ? "blog" : "guides"}/${article.slug}`}
                      className="text-sm font-semibold text-emerald-900 hover:underline"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#176b3a] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to places
          </Link>
        </div>
      </Container>
    </article>
  );
}
