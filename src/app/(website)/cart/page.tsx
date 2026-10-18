import type { Metadata } from 'next';
import { CartPage } from '@/components/booking/CartPage';

export const metadata: Metadata = {
  title: 'Your Trip Basket | Hunza Expeditions',
  description: 'Review the tours in your trip basket before sending a booking request.',
};

export default function CartRoute() {
  return <CartPage />;
}
