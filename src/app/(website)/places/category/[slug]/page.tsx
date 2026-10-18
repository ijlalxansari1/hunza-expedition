import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import {
  getPublishedPlaceCategories,
  getPublishedPlaceCategoryBySlug,
  getPublishedPlacesInCategory,
} from '@/lib/editorialContent';

export const dynamic = 'force-dynamic';

type PlaceCategoryPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PlaceCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const category = await getPublishedPlaceCategoryBySlug(slug, isEnabled);
  if (!category) return { title: 'Category Not Found | Hunza Expeditions', robots: { index: false } };

  return {
    title: category.seoTitle || `${category.name} | Places | Hunza Expeditions`,
    description: category.metaDescription || category.description || `Explore ${category.name} in Gilgit-Baltistan.`,
    alternates: { canonical: `/places/category/${category.slug}` },
    robots: isEnabled ? { index: false, follow: false } : undefined,
  };
}

export default async function PlaceCategoryPage({ params }: PlaceCategoryPageProps) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const category = await getPublishedPlaceCategoryBySlug(slug, isEnabled);
  if (!category) notFound();

  const [places, categories] = await Promise.all([
    getPublishedPlacesInCategory(category, isEnabled),
    getPublishedPlaceCategories(),
  ]);
  const subcategories = categories.filter((item) => (
    typeof item.parentCategory === 'object'
    && item.parentCategory !== null
    && item.parentCategory.id === category.id
  ));

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[
          { label: 'Places', href: '/places' },
          { label: category.name },
        ]} />
        {isEnabled && (
          <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-950">
            Staff preview: this category may not be published.
          </p>
        )}
        <header className="py-8">
          {category.imageUrl && (
            <div className="relative mb-8 h-56 overflow-hidden rounded-2xl bg-stone-100 sm:h-72">
              <Image
                src={category.imageUrl}
                alt={category.imageAlt || category.name}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Places category</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#12283a] sm:text-4xl">{category.name}</h1>
          {category.description && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-600">{category.description}</p>
          )}
        </header>

        {subcategories.length > 0 && (
          <nav aria-label="Subcategories" className="mb-8">
            <ul className="flex flex-wrap gap-2">
              {subcategories.map((subcategory) => (
                <li key={subcategory.slug}>
                  <Link
                    href={`/places/category/${subcategory.slug}`}
                    className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50"
                  >
                    {subcategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {places.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <article key={place.slug} className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
                {place.heroImageUrl && (
                  <Link href={`/places/${place.slug}`} className="relative block h-56 bg-stone-100">
                    <Image
                      src={place.heroImageUrl}
                      alt={place.imageAlt || place.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </Link>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                    {place.geographicArea || place.region}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-[#12283a]">
                    <Link href={`/places/${place.slug}`} className="hover:text-emerald-800">{place.name}</Link>
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{place.shortDescription}</p>
                  <Link
                    href={`/places/${place.slug}`}
                    className="mt-auto inline-flex items-center gap-1 pt-5 text-xs font-semibold text-emerald-900"
                  >
                    View place details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600">
            There are no published places in this category yet.
          </p>
        )}
      </Container>
    </div>
  );
}
