import type { Metadata } from 'next';
import { BookOpenText, PenLine } from 'lucide-react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { ArticleListing } from '@/components/editorial/ArticleListing';
import { getPublishedArticlePage } from '@/lib/editorialContent';

export const metadata: Metadata = {
  title: 'Stories & Journal | Hunza Expeditions',
  description: 'Stories and practical perspectives on travel, people, heritage, and landscapes across Gilgit-Baltistan.',
  alternates: { canonical: '/blog' },
};

export const dynamic = 'force-dynamic';

type BlogPageProps = {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const category = params.category?.slice(0, 80);
  const search = params.q?.slice(0, 100);
  const page = Number(params.page);
  const listing = await getPublishedArticlePage({
    contentType: 'blog',
    category,
    search,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[{ label: 'Blog' }]} />
        <div className="mb-8 space-y-4 border-b border-stone-200/90 py-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-900">
            <PenLine className="h-3.5 w-3.5" />
            <span>Hunza Expeditions Journal</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#12283a] sm:text-4xl lg:text-5xl">Stories from the mountains</h1>
          <p className="max-w-3xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Explore published stories and perspectives from across Gilgit-Baltistan. Every article is prepared and published by our team.
          </p>
        </div>
        {listing.totalDocs === 0 && (
          <div className="mb-6 flex gap-3 rounded-xl border border-stone-200 bg-white p-4 text-xs leading-5 text-stone-600">
            <BookOpenText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-900" />
            The journal is being prepared. In the Payload admin, create an article and set its content type to “Blog post” to publish it here.
          </div>
        )}
        <ArticleListing listing={listing} basePath="/blog" contentType="blog" category={category} search={search} />
      </Container>
    </div>
  );
}
