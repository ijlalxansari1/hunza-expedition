import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { EditorialArticlePage } from '@/components/editorial/EditorialArticlePage';
import { getArticleBySlug, getPublishedArticles } from '@/lib/editorialContent';

export const dynamic = 'force-dynamic';

type BlogArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const article = await getArticleBySlug(slug, 'blog', isEnabled);
  if (!article) return { title: 'Article Not Found | Hunza Expeditions', robots: { index: false } };
  const title = article.seoTitle || `${article.title} | Hunza Expeditions`;
  return {
    title,
    description: article.metaDescription || article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    robots: isEnabled ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      title,
      description: article.metaDescription || article.excerpt,
      images: [{ url: article.imageUrl, alt: article.imageAlt || article.title }],
      publishedTime: article.publishedAt || undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const article = await getArticleBySlug(slug, 'blog', isEnabled);
  if (!article) notFound();
  const publishedArticles = await getPublishedArticles('blog');
  const related = publishedArticles
    .filter((item) => item.slug !== slug && (
      article.relatedArticles?.includes(item.slug) || item.category === article.category
    ))
    .slice(0, 3);

  return <EditorialArticlePage article={article} contentType="blog" preview={isEnabled} relatedArticles={related} />;
}
