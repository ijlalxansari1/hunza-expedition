// middleware.ts (Next.js 16 Node middleware)
// middleware.ts (Next.js 16 Node middleware – now a pass‑through)
import { NextResponse } from 'next/server';

// No‑op middleware – we moved rate‑limiting to API routes.
export const middleware = async () => {
  return NextResponse.next();
};
