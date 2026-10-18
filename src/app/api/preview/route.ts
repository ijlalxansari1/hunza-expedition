import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/../payload.config';
import { hasStaffRole } from '@/lib/payloadAccess';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug') || '';
  const type = request.nextUrl.searchParams.get('type') || 'article';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) {
    return NextResponse.json({ message: 'A valid content slug is required.' }, { status: 400 });
  }
  if (!['article', 'place', 'place-category'].includes(type)) {
    return NextResponse.json({ message: 'A supported preview content type is required.' }, { status: 400 });
  }

  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers: request.headers });
  if (!hasStaffRole(user)) {
    return NextResponse.json({ message: 'Sign in to Payload with an authorised staff account to preview content.' }, { status: 401 });
  }

  let path: string;
  if (type === 'article') {
    const result = await payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const article = result.docs[0];
    if (!article || (article.contentType !== 'guide' && article.contentType !== 'blog')) {
      return NextResponse.json({ message: 'Article not found.' }, { status: 404 });
    }
    path = article.contentType === 'blog' ? `/blog/${slug}` : `/guides/${slug}`;
  } else if (type === 'place') {
    const result = await payload.find({
      collection: 'places',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (!result.docs[0]) return NextResponse.json({ message: 'Place not found.' }, { status: 404 });
    path = `/places/${slug}`;
  } else {
    const result = await payload.find({
      collection: 'place-categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (!result.docs[0]) return NextResponse.json({ message: 'Place category not found.' }, { status: 404 });
    path = `/places/category/${slug}`;
  }

  const preview = await draftMode();
  preview.enable();
  return NextResponse.redirect(new URL(path, request.url), { headers: { 'Cache-Control': 'no-store' } });
}
