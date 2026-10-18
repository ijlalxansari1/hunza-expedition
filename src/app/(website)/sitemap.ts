import type { MetadataRoute } from 'next';
import {
  getPublishedArticles,
  getPublishedPlaceCategories,
  getPublishedPlaces,
} from '@/lib/editorialContent';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const [blogPosts, guides, places, categories] = await Promise.all([
    getPublishedArticles('blog'),
    getPublishedArticles('guide'),
    getPublishedPlaces(),
    getPublishedPlaceCategories(),
  ]);

  return [
    { url: `${baseUrl}/places`, changeFrequency: 'weekly', priority: 0.8 },
    ...categories.map((category) => ({
      url: `${baseUrl}/places/category/${category.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...places.map((place) => ({
      url: `${baseUrl}/places/${place.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      images: place.heroImageUrl ? [place.heroImageUrl] : undefined,
    })),
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/guides`, changeFrequency: 'weekly', priority: 0.7 },
    ...blogPosts.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.publishedAt || undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      images: [article.imageUrl],
    })),
    ...guides.map((article) => ({
      url: `${baseUrl}/guides/${article.slug}`,
      lastModified: article.publishedAt || undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      images: [article.imageUrl],
    })),
  ];
}
