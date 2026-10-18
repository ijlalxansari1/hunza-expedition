import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import type { ArticleListing as ArticleListingData, ArticleContent } from '@/lib/editorialContent';

interface ArticleListingProps {
  listing: ArticleListingData;
  basePath: '/blog' | '/guides';
  contentType: 'blog' | 'guide';
  category?: string;
  search?: string;
}

function ArticleCard({ article, basePath }: { article: ArticleContent; basePath: string }) {
  const author = typeof article.authorProfile === 'object' && article.authorProfile
    ? article.authorProfile.name
    : article.author;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`${basePath}/${article.slug}`} className="relative block h-52 overflow-hidden bg-stone-100">
        <Image
          src={article.imageUrl}
          alt={article.imageAlt || article.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {article.imageCaption && (
          <span className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-1.5 text-[10px] text-white">
            {article.imageCaption}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-emerald-900">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1">{article.category}</span>
          <span className="text-stone-400">{article.readTimeMinutes} min read</span>
          {article.publishedAt && (
            <time dateTime={article.publishedAt} className="text-stone-500">
              {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </time>
          )}
        </div>
        <h2 className="mt-3 text-lg font-bold leading-snug text-[#01411c]">
          <Link href={`${basePath}/${article.slug}`} className="hover:text-emerald-700">{article.title}</Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-stone-600">{article.excerpt}</p>
        {article.tags && article.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Article tags">
            {article.tags.slice(0, 4).map((tag) => (
              <li key={tag} className="rounded-md bg-stone-100 px-2 py-1 text-[10px] text-stone-600">#{tag}</li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <span className="text-xs text-stone-500">{author ? `By ${author}` : 'Hunza Expeditions'}</span>
          <Link href={`${basePath}/${article.slug}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:text-emerald-700">
            Read article <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function pageHref(basePath: string, page: number, category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('q', search);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function ArticleListing({
  listing,
  basePath,
  contentType,
  category,
  search,
}: ArticleListingProps) {
  return (
    <div>
      <form action={basePath} method="get" className="mb-8 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px_auto]">
        <label className="relative">
          <span className="sr-only">Search articles</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            name="q"
            maxLength={100}
            defaultValue={search}
            placeholder="Search articles…"
            className="min-h-11 w-full rounded-lg border border-stone-200 bg-stone-50 pl-9 pr-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          />
        </label>
        <label>
          <span className="sr-only">Filter by category</span>
          <select
            name="category"
            defaultValue={category || ''}
            className="min-h-11 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          >
            <option value="">All categories</option>
            {listing.categories.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#01411c] px-5 text-sm font-semibold text-white transition hover:bg-[#176b3a]">
          Search {contentType === 'blog' ? 'blog' : 'guides'}
        </button>
      </form>

      {listing.articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listing.articles.map((article) => <ArticleCard key={article.slug} article={article} basePath={basePath} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-bold text-[#01411c]">No articles found</h2>
          <p className="mt-2 text-sm text-stone-600">Try another search or category.</p>
          {(category || search) && (
            <Link href={basePath} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Clear filters
            </Link>
          )}
        </div>
      )}

      {listing.totalPages > 1 && (
        <nav aria-label="Article pages" className="mt-10 flex items-center justify-center gap-5">
          {listing.page > 1 ? (
            <Link href={pageHref(basePath, listing.page - 1, category, search)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-xs font-semibold text-stone-700 hover:border-emerald-700">
              <ArrowLeft className="h-4 w-4" /> Previous
            </Link>
          ) : <span />}
          <span className="text-xs text-stone-500">Page {listing.page} of {listing.totalPages}</span>
          {listing.page < listing.totalPages ? (
            <Link href={pageHref(basePath, listing.page + 1, category, search)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-xs font-semibold text-stone-700 hover:border-emerald-700">
              Next <ArrowRight className="h-4 w-4" />
            </Link>
          ) : <span />}
        </nav>
      )}
    </div>
  );
}
