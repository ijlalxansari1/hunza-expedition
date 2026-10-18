'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, MapPin, ShoppingBag, Trash2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useBookingCart } from './BookingCartProvider';

export function CartPage() {
  const { items, isReady, storageError, removeTour } = useBookingCart();

  if (!isReady) {
    return <Container className="py-20 text-center text-sm text-stone-500">Loading your trip…</Container>;
  }

  return (
    <div className="min-h-[65vh] bg-stone-50 py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Your journey</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#01411c] sm:text-4xl">Trip basket</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Collect the tours you&apos;re considering, then send one request with your dates and group details.
              Nothing is charged until your itinerary and price are confirmed.
            </p>
          </div>

          {storageError && (
            <p role="alert" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              {storageError}
            </p>
          )}

          {items.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#01411c]">Your trip basket is empty</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
                Explore our curated itineraries and add the journeys you&apos;d like us to help arrange.
              </p>
              <Link href="/tours" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#01411c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#176b3a]">
                Explore tours <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="space-y-4">
                {items.map((item) => (
                  <article key={item.slug} className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
                    <Link href={`/tours/${item.slug}`} className="relative h-44 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-28 sm:w-40">
                      <Image src={item.imageUrl} alt="" fill sizes="(max-width: 640px) 100vw, 160px" className="object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/tours/${item.slug}`} className="text-lg font-bold text-[#01411c] hover:text-[#176b3a]">
                        {item.title}
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-stone-600">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{item.durationDays} days</span>
                        {item.destinations.length > 0 && (
                          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{item.destinations.join(', ')}</span>
                        )}
                      </div>
                      <p className="mt-3 text-xs leading-5 text-stone-500">
                        {item.price ? `From ${item.currency} ${item.price.toLocaleString()} per person` : 'Price confirmed in your personal quotation'}
                        {item.pricingBasis ? ` · ${item.pricingBasis}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTour(item.slug)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg px-3 text-xs font-semibold text-stone-500 hover:bg-red-50 hover:text-red-700 sm:self-center"
                      aria-label={`Remove ${item.title} from your trip`}
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </article>
                ))}
                <Link href="/tours" className="inline-flex items-center gap-2 px-1 py-2 text-sm font-semibold text-emerald-900 hover:text-emerald-700">
                  Continue exploring <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
                <h2 className="text-lg font-bold text-[#01411c]">Request summary</h2>
                <div className="mt-5 space-y-3 border-y border-stone-100 py-4 text-sm">
                  <div className="flex justify-between gap-4 text-stone-600"><span>Selected tours</span><span className="font-semibold text-stone-900">{items.length}</span></div>
                  <div className="flex justify-between gap-4 text-stone-600"><span>Availability</span><span className="font-semibold text-stone-900">To be confirmed</span></div>
                  <div className="flex justify-between gap-4 text-stone-600"><span>Payment due now</span><span className="font-semibold text-emerald-800">£0.00</span></div>
                </div>
                <p className="mt-4 text-xs leading-5 text-stone-500">
                  Any displayed tour price is indicative only. We&apos;ll confirm dates, availability, inclusions, and the final total before requesting payment.
                </p>
                <Link href="/checkout" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#01411c] px-4 py-3 text-sm font-semibold text-white hover:bg-[#176b3a]">
                  Continue to booking <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-3 text-center text-[11px] text-stone-500">Secure request · No card details collected</p>
              </aside>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
