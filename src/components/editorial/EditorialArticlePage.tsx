import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, CalendarDays, Clock3 } from 'lucide-react';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { ArticleContent } from '@/lib/editorialContent';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Container } from '@/components/ui/Container';

interface EditorialArticlePageProps {
  article: ArticleContent;
  contentType: 'guide' | 'blog';
  preview?: boolean;
  relatedArticles?: ArticleContent[];
}

const pathFor = (contentType: 'guide' | 'blog') => contentType === 'blog' ? '/blog' : '/guides';

export function EditorialArticlePage({
  article,
  contentType,
  preview = false,
  relatedArticles = [],
}: EditorialArticlePageProps) {
  const author = typeof article.authorProfile === 'object' && article.authorProfile
    ? article.authorProfile
    : null;
  const authorName = author?.name || article.author;
  const publishedTime = article.publishedAt || undefined;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl,
    datePublished: publishedTime,
    author: author
      ? { '@type': 'Person', name: author.name, url: author.websiteUrl || undefined }
      : { '@type': 'Organization', name: authorName || 'Hunza Expeditions' },
    mainEntityOfPage: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${pathFor(contentType)}/${article.slug}`,
  };
  const legacyParagraphs = (article.content || '')
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <article className="pb-16 sm:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <div className="border-b border-stone-200/80 bg-stone-50">
        <Container>
          <Breadcrumbs items={[
            { label: contentType === 'blog' ? 'Blog' : 'Travel Guides', href: pathFor(contentType) },
            { label: article.title },
          ]} />
        </Container>
      </div>
      {preview && (
        <div className="bg-amber-100 px-4 py-2 text-center text-xs font-semibold text-amber-950">
          Preview mode — this {article.publicationStatus} article is not visible to the public.
          {' '}<Link href="/api/exit-preview" prefetch={false} className="underline">Exit preview</Link>
        </div>
      )}
      <header className="relative flex min-h-[380px] items-end bg-stone-900 sm:min-h-[480px]">
        <Image src={article.imageUrl} alt={article.imageAlt || article.title} fill priority sizes="100vw" className="object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b2a]/95 via-[#0e1b2a]/25 to-transparent" />
        <Container className="relative z-10 py-12 sm:py-16">
          <Link href={pathFor(contentType)} className="text-sm font-medium text-white/90 hover:text-white">
            ← {contentType === 'blog' ? 'All blog posts' : 'All travel guides'}
          </Link>
          <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200">
            <BookOpen className="h-4 w-4" aria-hidden="true" /> {article.category}
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-5xl">{article.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-100 sm:text-lg">{article.excerpt}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-200">
            {authorName && <span>By {authorName}</span>}
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{article.readTimeMinutes} min read</span>
            {publishedTime && (
              <time dateTime={publishedTime} className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(publishedTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            )}
          </div>
        </Container>
      </header>

      {article.imageCaption && (
        <Container className="pt-3">
          <p className="mx-auto max-w-3xl text-right text-[11px] italic text-stone-500">{article.imageCaption}</p>
        </Container>
      )}

      <Container className="pt-10 sm:pt-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="prose prose-stone max-w-none text-stone-700">
            {article.richContent ? (
              <RichText data={article.richContent} />
            ) : legacyParagraphs.length > 0 ? (
              legacyParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
                {preview ? 'Add the full article body in the Payload rich-text editor to complete this preview.' : 'The full article is being prepared.'}
              </p>
            )}
            {article.tags && article.tags.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Article tags">
                {article.tags.map((tag) => <li key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900">#{tag}</li>)}
              </ul>
            )}
          </div>

          <aside className="space-y-5">
            {author && (
              <section className="rounded-2xl border border-stone-200 bg-white p-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900">About the author</h2>
                {author.imageUrl && (
                  <div className="relative mt-4 aspect-square w-20 overflow-hidden rounded-full bg-stone-100">
                    <Image src={author.imageUrl} alt={author.imageAlt || author.name} fill sizes="80px" className="object-cover" />
                  </div>
                )}
                <h3 className="mt-3 text-base font-bold text-[#01411c]">{author.name}</h3>
                <p className="mt-2 text-xs leading-5 text-stone-600">{author.biography}</p>
              </section>
            )}
            {relatedArticles.length > 0 && (
              <section className="rounded-2xl border border-stone-200 bg-white p-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900">Related reading</h2>
                <ul className="mt-3 space-y-3">
                  {relatedArticles.map((related) => (
                    <li key={related.slug}>
                      <Link href={`${pathFor(related.contentType)}/${related.slug}`} className="text-sm font-semibold leading-5 text-[#01411c] hover:text-emerald-700">
                        {related.title}
                      </Link>
                      <span className="mt-1 block text-[11px] text-stone-500">{related.readTimeMinutes} min read</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </article>
  );
}
