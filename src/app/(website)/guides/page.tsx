import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { ArticleListing } from '@/components/editorial/ArticleListing';
import { getPublishedArticlePage } from '@/lib/editorialContent';

export const metadata: Metadata = {
  title: 'Practical Travel Guides & Advice | Hunza Expeditions',
  description: 'Factual, realistic guidance for travelling in Gilgit-Baltistan and northern Pakistan: seasons, road access, cultural etiquette, and packing.',
  alternates: { canonical: '/guides' },
};

export const dynamic = 'force-dynamic';

type GuidesPageProps = {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
};

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const params = await searchParams;
  const category = params.category?.slice(0, 80);
  const search = params.q?.slice(0, 100);
  const page = Number(params.page);
  const listing = await getPublishedArticlePage({
    contentType: 'guide',
    category,
    search,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[{ label: 'Travel Guides' }]} />
        <div className="mb-8 space-y-4 border-b border-stone-200/90 py-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#1f6b85]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Practical Field Knowledge</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#12283a] sm:text-4xl lg:text-5xl">Travel Guides & Mountain Advice</h1>
          <p className="max-w-3xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Practical information to help you prepare for a journey through the Karakoram, local culture, and mountain seasons.
          </p>
        </div>
        <ArticleListing listing={listing} basePath="/guides" contentType="guide" category={category} search={search} />
      </Container>
    </div>
  );
}
