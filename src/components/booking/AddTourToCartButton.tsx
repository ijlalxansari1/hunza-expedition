'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ShoppingBag } from 'lucide-react';
import { useBookingCart, type BookingCartItem } from './BookingCartProvider';

export function AddTourToCartButton({ tour }: { tour: BookingCartItem }) {
  const { items, addTour } = useBookingCart();
  const [justAdded, setJustAdded] = useState(false);
  const isAdded = items.some((item) => item.slug === tour.slug);

  if (isAdded || justAdded) {
    return (
      <Link
        href="/cart"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-100"
      >
        <Check className="h-4 w-4" />
        Added to your trip — view cart
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addTour(tour);
        setJustAdded(true);
      }}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#01411c] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#176b3a] focus:outline-none focus:ring-2 focus:ring-[#176b3a] focus:ring-offset-2"
    >
      <ShoppingBag className="h-4 w-4" />
      Add to trip
    </button>
  );
}
