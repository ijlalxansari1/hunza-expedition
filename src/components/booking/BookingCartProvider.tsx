'use client';

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

export interface BookingCartItem {
  slug: string;
  title: string;
  imageUrl: string;
  durationDays: number;
  price?: number;
  currency: string;
  pricingBasis?: string;
  destinations: string[];
}

interface BookingCartSnapshot {
  items: BookingCartItem[];
  isReady: boolean;
  storageError: string | null;
}

interface BookingCartContextValue extends BookingCartSnapshot {
  addTour: (item: BookingCartItem) => void;
  removeTour: (slug: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'hunza-expeditions-booking-cart';
const EMPTY_SNAPSHOT: BookingCartSnapshot = { items: [], isReady: false, storageError: null };

function isBookingCartItem(item: unknown): item is BookingCartItem {
  if (typeof item !== 'object' || item === null) return false;
  const candidate = item as Record<string, unknown>;
  return typeof candidate.slug === 'string'
    && typeof candidate.title === 'string'
    && typeof candidate.imageUrl === 'string'
    && typeof candidate.durationDays === 'number'
    && typeof candidate.currency === 'string'
    && (candidate.price === undefined || (typeof candidate.price === 'number' && Number.isFinite(candidate.price)))
    && (candidate.pricingBasis === undefined || typeof candidate.pricingBasis === 'string')
    && Array.isArray(candidate.destinations)
    && candidate.destinations.every((destination) => typeof destination === 'string');
}

function readInitialSnapshot(): BookingCartSnapshot {
  if (typeof window === 'undefined') return EMPTY_SNAPSHOT;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { items: [], isReady: true, storageError: null };
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every(isBookingCartItem)) {
      throw new Error('Saved trip contains invalid data.');
    }
    return { items: parsed, isReady: true, storageError: null };
  } catch (error) {
    console.error('Unable to load the saved trip:', error);
    return { items: [], isReady: true, storageError: 'Your saved trip could not be loaded from this browser.' };
  }
}

let snapshot = readInitialSnapshot();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function updateCart(items: BookingCartItem[]) {
  let storageError: string | null = null;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Unable to save the trip in this browser:', error);
    storageError = 'Your trip is available now, but could not be saved in this browser.';
  }
  snapshot = { items, isReady: true, storageError };
  listeners.forEach((listener) => listener());
}

function addTour(item: BookingCartItem) {
  if (snapshot.items.some((existing) => existing.slug === item.slug)) return;
  updateCart([...snapshot.items, item]);
}

function removeTour(slug: string) {
  updateCart(snapshot.items.filter((item) => item.slug !== slug));
}

function clearCart() {
  updateCart([]);
}

const BookingCartContext = createContext<BookingCartContextValue | null>(null);

export function BookingCartProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(
    () => ({ ...state, addTour, removeTour, clearCart }),
    [state],
  );

  return <BookingCartContext.Provider value={value}>{children}</BookingCartContext.Provider>;
}

export function useBookingCart() {
  const context = useContext(BookingCartContext);
  if (!context) {
    throw new Error('useBookingCart must be used within BookingCartProvider.');
  }
  return context;
}
