import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const preview = await draftMode();
  preview.disable();
  return NextResponse.redirect(new URL('/blog', request.url));
}
