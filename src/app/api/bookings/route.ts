import { NextRequest, NextResponse } from 'next/server';
import { getPublishedTours } from '@/lib/catalog';
import { saveEnquiry } from '@/lib/enquiryStore';
import { bookingRequestSchema } from '@/lib/validations/booking';
import { enquirySchema } from '@/lib/validations/enquiry';

const paymentLabels = {
  card: 'Credit or debit card (secure link after confirmation)',
  bank_transfer: 'Bank transfer (details after confirmation)',
  discuss: 'Discuss payment options with a trip specialist',
} as const;

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = bookingRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          message: 'Please check your details and try again.',
        },
        { status: 400 },
      );
    }
    if (parsed.data.website_field) {
      return NextResponse.json({ success: false, message: 'Submission rejected.' }, { status: 400 });
    }

    const publishedTours = await getPublishedTours();
    const selectedTours = parsed.data.tours.map((slug) => publishedTours.find((tour) => tour.slug === slug));
    if (selectedTours.some((tour) => !tour)) {
      return NextResponse.json(
        { success: false, message: 'One or more tours are no longer available. Refresh the tour list and try again.' },
        { status: 400 },
      );
    }

    const tours = selectedTours.filter((tour) => tour !== undefined);
    const durationDays = tours.reduce((total, tour) => total + tour.durationDays, 0);
    if (durationDays > 60) {
      return NextResponse.json(
        { success: false, message: 'The selected tours exceed the maximum 60-day trip duration. Please contact us to arrange a longer itinerary.' },
        { status: 400 },
      );
    }

    const destinations = [...new Set(tours.flatMap((tour) => tour.destinations.map((destination) => destination.name)))];
    const itemDetails = tours.map((tour) => {
      const estimate = tour.price === undefined
        ? 'price to be confirmed'
        : `${tour.currency || 'USD'} ${tour.price.toLocaleString()} per person (indicative)`;
      return `- ${tour.title}: ${estimate}`;
    });
    const requestNotes = [
      'TOUR BOOKING REQUEST',
      `Selected tours:\n${itemDetails.join('\n')}`,
      `Preferred payment: ${paymentLabels[parsed.data.paymentPreference]}`,
      'Payment status: no payment collected; availability, final itinerary, total price, and payment terms require manual confirmation.',
      parsed.data.specialRequests ? `Additional requests: ${parsed.data.specialRequests}` : '',
    ].filter(Boolean).join('\n\n');

    const enquiry = enquirySchema.safeParse({
      website_field: parsed.data.website_field,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      preferredContact: parsed.data.preferredContact,
      countryOfResidence: parsed.data.countryOfResidence,
      startDate: parsed.data.startDate,
      dateFlexibility: parsed.data.dateFlexibility,
      durationDays,
      adultsCount: parsed.data.adultsCount,
      childrenCount: parsed.data.childrenCount,
      childrenAges: parsed.data.childrenAges,
      budgetCurrency: 'USD',
      accommodationStyle: 'flexible',
      selectedDestinations: destinations.length > 0 ? destinations : tours.map((tour) => tour.title),
      selectedInterests: tours.map((tour) => tour.title),
      specialRequests: requestNotes,
      privacyConsent: parsed.data.privacyConsent,
    });

    if (!enquiry.success) {
      return NextResponse.json(
        { success: false, errors: enquiry.error.flatten().fieldErrors, message: 'Please check your booking details and try again.' },
        { status: 400 },
      );
    }

    const { referenceId } = await saveEnquiry(
      enquiry.data,
      'Received via Tour Booking Checkout. Payment and booking await manual confirmation.',
    );

    return NextResponse.json({
      success: true,
      referenceId,
      message: 'Your booking request has been sent for manual review.',
    });
  } catch (error) {
    console.error('Error processing tour booking request:', error);
    return NextResponse.json(
      { success: false, message: 'We could not save your booking request. Please try again or contact us directly.' },
      { status: 500 },
    );
  }
}
