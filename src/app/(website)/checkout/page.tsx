import type { Metadata } from 'next';
import { CheckoutPage } from '@/components/booking/CheckoutPage';

export const metadata: Metadata = {
  title: 'Booking Checkout | Hunza Expeditions',
  description: 'Share your travel dates and preferences to request a confirmed itinerary and quotation.',
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
